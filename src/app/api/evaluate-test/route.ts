import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { Resend } from "resend";
import { getSelectionEmail, getRejectionEmail } from "@/lib/email-templates";
import { registerIntern, generateInternID } from "@/lib/registry";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // 2. Sovereign Onboarding Sequence
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
    }

    // 3. Automated Onboarding Email (Resend)
    try {
      const host = req.headers.get("origin") || "https://kevryn.ai";
      const loginUrl = internId ? `${host}/offer?id=${internId}` : host;

      const emailHtml = (result.verdict === "ADMITTED" && internId)
        ? getSelectionEmail(name, role, loginUrl, internId)
        : getRejectionEmail(name, role);

      await resend.emails.send({
        from: 'KevRyn Protocol <onboarding@resend.dev>',
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
