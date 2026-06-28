import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import nodemailer from "nodemailer";
import { getSelectionEmail, getRejectionEmail } from "@/lib/email-templates";
import { registerIntern, generateInternID } from "@/lib/registry";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { name, email, role, answers, questions, strikes } = await req.json();

    if (!email || !name || !role) {
      return NextResponse.json({ error: "MISSING_IDENTITY_METADATA" }, { status: 400 });
    }

    // 1. Prepare AI Evaluation Prompt
    const totalQuestions = questions.length;
    const systemPrompt = `You are KevRyn's Technical Verifier. 
Analyze the candidate's test results for the role: ${role}.
Performance Data:
- Questions Answered: ${Object.keys(answers).length} / ${totalQuestions}
- Protocol Breaches (Strikes): ${strikes}

Evaluate the technical aptitude. 
If strikes > 3, the candidate is usually REJECTED for integrity.
If score > 70%, they are ADMITTED.

Return ONLY a RAW JSON object:
{
  "score": number (0-100),
  "verdict": "ADMITTED" | "REJECTED",
  "technical_depth": "EXTREME" | "MODERATE" | "LOW",
  "summary": "Brief 1-sentence technical feedback"
}`;

    const userPrompt = `Candidate: ${name}
Answers Map: ${JSON.stringify(answers)}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(chatCompletion.choices[0].message.content || "{}");

    // 2. Sovereign Onboarding Sequence & Identity Generation
    let internId = null;
    let tempPwd = undefined;
    let clerkUserId = null;

    if (result.verdict === "ADMITTED") {
      const newId = generateInternID(name, role);
      const registeredData = registerIntern({
        id: newId,
        name: name,
        email: email,
        role: role.replace('-', ' ').toUpperCase(),
        score: result.score || 0,
        domain: role
      });
      internId = registeredData.id;

      // 2A. NATIVE MONGODB INITIAL SYNCHRONIZATION (Guaranteed)
      try {
        const { getDb } = await import("@/lib/db");
        const db = await getDb();
        
        await db.collection("interns").updateOne(
          { _id: internId! as any },
          {
            $set: {
              internId: internId,
              name,
              email,
              role: role.replace('-', ' ').toUpperCase(),
              domain: role,
              score: result.score || 0,
              totalPoints: 0,
              joinedAt: new Date(),
              status: "ACTIVE"
            }
          },
          { upsert: true }
        );
        console.log("[AUTOMATION SUCCESS] Initial MongoDB Sync Complete.");
      } catch(dbErr) {
        console.error("[CRITICAL] Initial MongoDB Synchronization failed:", dbErr);
      }

      // Generate a secure temporary password
      tempPwd = "KR-" + Math.random().toString(36).substring(2, 10).toUpperCase() + "!";

      // 2B. CLERK IDENTITY PROVISIONING
      try {
        const clerkRes = await fetch("https://api.clerk.com/v1/users", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email_address: [email],
            password: tempPwd,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' '),
            public_metadata: { clearance: 3, role: "intern", internId }
          })
        });

        if (clerkRes.ok) {
          const clerkData = await clerkRes.json();
          clerkUserId = clerkData.id;
          console.log("[AUTOMATION SUCCESS] Clerk Identity Generated:", clerkUserId);
          
          // Update MongoDB with Clerk ID
          try {
            const { getDb } = await import("@/lib/db");
            const db = await getDb();
            await db.collection("interns").updateOne(
              { _id: internId! as any },
              { $set: { clerkId: clerkUserId } }
            );
            console.log("[AUTOMATION SUCCESS] Clerk ID linked in MongoDB.");
          } catch (dbLinkErr) {
            console.error("[WARNING] Could not link Clerk ID in MongoDB:", dbLinkErr);
          }
        } else {
          console.error("[CLERK PROVISION ERROR]", await clerkRes.text());
        }
      } catch (authErr) {
        console.error("[IDENTITY FAILURE] Could not reach Clerk API:", authErr);
      }
    }

    // 3. Automated Onboarding Email (Resend)
    try {
      const host = req.headers.get("origin") || "https://kevryn.ai";
      const offerUrl = internId ? `${host}/offer?id=${internId}` : host;
      const workspaceUrl = `${host}/workspace`;

      const emailHtml = (result.verdict === "ADMITTED" && internId)
        ? getSelectionEmail(name, role, workspaceUrl, offerUrl, internId, tempPwd)
        : getRejectionEmail(name, role);

      await transporter.sendMail({
        from: `"KevRyn Protocol" <${process.env.EMAIL_USER}>`,
        to: email, 
        subject: result.verdict === "ADMITTED" 
          ? `[PROTOCOL] Selection Confirmation: ${role}` 
          : `[PROTOCOL] Application Update: ${role}`,
        html: emailHtml,
      });

      console.log(`[ONBOARDING] Official Protocol dispatched to ${email} | Verdict: ${result.verdict}`);
    } catch (emailErr) {
      console.error("[ONBOARDING ERROR] Protocol Dispatch Failed:", emailErr);
    }

    return NextResponse.json({ ...result, internId });

  } catch (err: any) {
    console.error("[EVALUATION ERROR] System Failure:", err);
    return NextResponse.json(
      { error: "EVALUATION_CRITICAL_FAILURE", message: err.message },
      { status: 500 }
    );
  }
}
