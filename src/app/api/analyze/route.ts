import { NextRequest, NextResponse } from "next/server";
import { runCascadeFlow } from "@/lib/cascadeflow";
import zlib from "zlib";

export const maxDuration = 60; // Extend Vercel runtime to 60 seconds

// Workaround for pdf-parse browser-API dependencies in Node environment
if (typeof global.DOMMatrix === "undefined") {
  (global as any).DOMMatrix = class DOMMatrix {};
}

function render_page(pageData: any): Promise<string> {
  const render_options = {
    normalizeWhitespace: false,
    disableCombineTextItems: false
  };

  return pageData.getTextContent(render_options)
    .then(function(textContent: any) {
      let lastY, text = '';
      for (const item of textContent.items) {
        if (lastY === item.transform[5] || !lastY){
          text += item.str;
        } else {
          text += '\n' + item.str;
        }    
        lastY = item.transform[5];
      }            
      return text;
    });
}

async function parsePdfStatically(dataBuffer: Uint8Array): Promise<string> {
  const PDFJS = require("pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js");
  PDFJS.disableWorker = true;
  
  const doc = await PDFJS.getDocument(dataBuffer);
  const numPages = doc.numPages;
  let text = "";

  for (let i = 1; i <= numPages; i++) {
    const pageText = await doc.getPage(i).then((pageData: any) => render_page(pageData)).catch(() => "");
    text = `${text}\n\n${pageText}`;
  }

  doc.destroy();
  return text;
}

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
    const clientExtractedText = formData.get("extractedText") as string | null;

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

    if (clientExtractedText && clientExtractedText.trim().length >= 50) {
      resumeText = clientExtractedText;
      console.log("[API] Using client-side pre-extracted text, length:", resumeText.length);
    } else {
      try {
        // 1. Try our build-safe static PDFJS parser first (runs 100% serverless-safe)
        resumeText = await parsePdfStatically(buffer);
        console.log("[STATIC PDFJS SUCCESS] Extracted length:", resumeText.length);
      } catch (staticErr) {
        console.warn("[STATIC PDFJS FAILED] Falling back to unpdf:", staticErr);
      }

      // 2. Fallback to unpdf if custom parser fails or returns empty result
      if (!resumeText || resumeText.length < 50) {
        try {
          const { extractText } = await import("unpdf");
          const { text } = await extractText(buffer);
          resumeText = Array.isArray(text) ? text.join("\n") : text;
          console.log("[UNPDF FALLBACK SUCCESS] Extracted length:", resumeText.length);
        } catch (unpdfErr: any) {
          console.error("[ALL PARSERS FAILED]", unpdfErr);
          // Fallback to basic ASCII extraction if everything fails
          try {
            const pdfString = Buffer.from(buffer).toString("binary");
            const plainTextMatches = pdfString.match(/[a-zA-Z0-9\s,.]{4,}/g);
            resumeText = plainTextMatches ? plainTextMatches.join(" ") : "";
            console.log("[ASCII FALLBACK SUCCESS] Extracted length:", resumeText.length);
          } catch (asciiErr) {
            return NextResponse.json(
              { 
                error: "EXTRACTION_FAILED", 
                message: "Could not read PDF. Ensure the file is not encrypted."
              },
              { status: 422 }
            );
          }
        }
      }
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

    const systemPrompt = `You are KarsaTek OS's Neural Recruitment Engine — an elite AI ATS system. 
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

    const result = await runCascadeFlow({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      priority: "LIGHT",
      temperature: 0.3,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });

    const rawContent = result.content;

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
