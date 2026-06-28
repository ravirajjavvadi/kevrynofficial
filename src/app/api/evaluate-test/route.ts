import { NextResponse } from "next/server";
import { getSelectionEmail, getRejectionEmail } from "@/lib/email-templates";
import { registerIntern, generateInternID } from "@/lib/registry";
import { runCascadeFlow } from "@/lib/cascadeflow";
import nodemailer from "nodemailer";

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
    const systemPrompt = `You are KarsaTek OS's Technical Verifier. 
Analyze the candidate's test results for the role: ${role}.
Performance Data:
- Questions Answered: ${Object.keys(answers).length} / ${totalQuestions}
- Protocol Breaches (Strikes): ${strikes}

Evaluate the technical aptitude. 
If strikes > 3, the candidate is usually REJECTED for integrity.
If score > 70%, they are ADMITTED.

Return ONLY a RAW JSON object matching this schema:
{
  "score": number (0-100),
  "verdict": "ADMITTED" | "REJECTED",
  "technical_depth": "EXTREME" | "MODERATE" | "LOW",
  "summary": "Brief 1-sentence technical feedback",
  "candidateIntelligence": {
    "technicalAbility": { "score": number, "explanation": "string", "confidence": number },
    "communication": { "score": number, "explanation": "string", "confidence": number },
    "learningSpeed": { "score": number, "explanation": "string", "confidence": number },
    "adaptability": { "score": number, "explanation": "string", "confidence": number },
    "leadership": { "score": number, "explanation": "string", "confidence": number },
    "problemSolving": { "score": number, "explanation": "string", "confidence": number },
    "cultureFit": { "score": number, "explanation": "string", "confidence": number },
    "riskLevel": { "score": number, "explanation": "string", "confidence": number }
  }
}`;

    const userPrompt = `Candidate: ${name}
Answers Map: ${JSON.stringify(answers)}`;

    const flowResult = await runCascadeFlow({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      priority: "HEAVY",
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(flowResult.content || "{}");

    // 2. Sovereign Onboarding Sequence & Identity Generation
    let internId = null;

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

      // NATIVE MONGODB INITIAL SYNCHRONIZATION (Guaranteed)
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
              status: "TEST_COMPLETED",
              candidateIntelligence: result.candidateIntelligence || {},
              testResult: {
                score: result.score,
                technical_depth: result.technical_depth,
                summary: result.summary,
                strikes,
                answers
              }
            }
          },
          { upsert: true }
        );
        console.log("[AUTOMATION SUCCESS] Initial MongoDB Sync Complete. Promoted to Interview Round.");
      } catch(dbErr) {
        console.error("[CRITICAL] Initial MongoDB Synchronization failed:", dbErr);
      }
    } else {
      // REJECTED
      const newId = generateInternID(name, role);
      internId = newId;
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
              status: "REJECTED",
              candidateIntelligence: result.candidateIntelligence || {},
              testResult: {
                score: result.score,
                technical_depth: result.technical_depth,
                summary: result.summary,
                strikes,
                answers
              }
            }
          },
          { upsert: true }
        );

        // Send rejection email immediately
        const emailHtml = getRejectionEmail(name, role);
        await transporter.sendMail({
          from: `"KarsaTek OS Protocol" <${process.env.EMAIL_USER}>`,
          to: email, 
          subject: `[PROTOCOL] Application Update: ${role}`,
          html: emailHtml,
        });
        console.log(`[REJECTION] Dispatched rejection email to ${email}`);
      } catch (err) {
        console.error("[REJECT_SYNC_ERROR]", err);
      }
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
