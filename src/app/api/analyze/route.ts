import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const maxDuration = 60; // Extend Vercel runtime to 60 seconds


// Workaround for pdf-parse browser-API dependencies in Node environment
if (typeof global.DOMMatrix === "undefined") {
  (global as any).DOMMatrix = class DOMMatrix {};
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ROLE_REQUIREMENTS: Record<string, string> = {
  "ai-engineer": "Deep learning, LLMs, Python, CUDA, PyTorch, distributed systems, FastAPI, model fine-tuning",
  "frontend-architect": "React, Next.js, TypeScript, Framer Motion, GSAP, CSS animations, design systems, web performance",
  "backend-sovereign": "Node.js, NestJS, PostgreSQL, Redis, REST APIs, microservices, cryptography, Docker",
  "unspecified": "Software engineering, problem solving, teamwork, communication, coding fundamentals",
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const role = (formData.get("role") as string) || "unspecified";

    if (!file) {
      return NextResponse.json(
        { error: "NO_ASSET", message: "No resume file provided." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "INVALID_FORMAT", message: "Only PDF files are accepted." },
        { status: 400 }
      );
    }

    // Extract raw text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    let resumeText = "";

    try {
      // Use unpdf for ultra-stable extraction in Next.js (no worker issues)
      const { extractText } = await import("unpdf");
      const { text } = await extractText(buffer);
      resumeText = Array.isArray(text) ? text.join("\n") : text;
    } catch (err: any) {
      console.error("[PDF EXTRACTION ERROR]", err);
      return NextResponse.json(
        { 
          error: "EXTRACTION_FAILED", 
          message: "Could not read PDF. Ensure the file is not encrypted.", 
          details: err?.message || String(err) 
        },
        { status: 422 }
      );
    }

    if (!resumeText.trim() || resumeText.trim().length < 50) {
      return NextResponse.json({
        mastery_index: 0,
        verdict: "HOLD",
        extracted_skills: [],
        experience_summary: "Could not extract sufficient data from resume.",
        match_reason: "Resume appears to be image-based or empty.",
        recommendation: "Please submit a text-based PDF resume.",
      });
    }

    const roleRequirements = ROLE_REQUIREMENTS[role] || ROLE_REQUIREMENTS["unspecified"];

    const systemPrompt = `You are KevRyn's Neural Recruitment Engine — an elite AI ATS system. 
Your job is to analyze a candidate's resume against a specific role and produce a structured evaluation.
You MUST respond ONLY with a valid JSON object. No markdown, no explanation, no preamble.
The JSON must follow this exact schema:
{
  "mastery_index": <number 0-100>,
  "verdict": <"APPROVED" | "HOLD" | "DECLINED">,
  "extracted_skills": <array of up to 12 skill strings>,
  "experience_summary": <1-2 sentence string>,
  "match_reason": <1-2 sentence string explaining verdict>,
  "recommendation": <short action string e.g. "Move to Test Phase" or "Re-apply with stronger project portfolio">
}
Verdict rules:
- APPROVED: mastery_index >= 65 — strong match, proceed to test phase
- HOLD: mastery_index 35-64 — partial match, manual review required
- DECLINED: mastery_index < 35 — insufficient match for this role`;

    const userPrompt = `Role: ${role.replace(/-/g, " ").toUpperCase()}
Required Skills: ${roleRequirements}

Candidate Resume:
---
${resumeText.slice(0, 6000)}
---

Evaluate and return the JSON.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 800,
    });

    const rawContent = chatCompletion.choices[0]?.message?.content || "";

    // Safely parse the JSON response
    let analysis;
    try {
      // Strip any accidental markdown fences
      const cleaned = rawContent.replace(/```json|```/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "PARSE_FAILED", message: "AI returned malformed output. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);
  } catch (err: any) {
    console.error("[ANALYZE ROUTE ERROR]", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: err.message || "An unexpected error occurred in the Neural Engine." },
      { status: 500 }
    );
  }
}
