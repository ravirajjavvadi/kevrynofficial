import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { runCascadeFlow } from "@/lib/cascadeflow";

export async function POST(req: Request) {
  try {
    const { id, history, strikes = 0 } = await req.json();

    if (!id || !Array.isArray(history)) {
      return NextResponse.json({ error: "MISSING_IDENTITY_OR_TRANSCRIPT" }, { status: 400 });
    }

    const db = await getDb();
    const intern = await db.collection("interns").findOne({ _id: id as any });

    if (!intern) {
      return NextResponse.json({ error: "CANDIDATE_NOT_FOUND" }, { status: 404 });
    }

    // Retrieve top performers for comparison context
    const topPerformers = await db.collection("company_memory")
      .find({ role: intern.role, score: { $gte: 4 } })
      .limit(3)
      .toArray();

    const hindsightContext = topPerformers.map(t => ({
      name: t.name,
      feedback: t.feedback,
      score: t.score,
      retained: t.retained
    }));

    // Prepare evaluation system prompt
    const systemPrompt = `You are KarsaTek OS's Cognitive Interview Evaluator.
Analyze the provided interview transcript and generate a structured multi-dimensional evaluation.
Compare the candidate's answers against the historical company memory context (top performers) to calibrate recommendation.

You MUST respond ONLY with a raw, valid JSON object matching this schema:
{
  "hiringRecommendation": "RECOMMENDED" | "RECOMMENDED_WITH_TRAINING" | "HOLD" | "REJECT",
  "hiringConfidence": number (0-100),
  "explainableReasoning": "Detailed 2-3 sentence explanation of the recommendation.",
  "behavioralAnalysis": {
    "speakingConsistency": "Description of candidate's voice/explanation consistency.",
    "responseHesitation": "Observations on reply hesitation or time taken to reason.",
    "stressHandling": "How the candidate handled technical pressure or direct follow-up questions."
  },
  "scores": {
    "reasoningDepth": { "score": number (0-100), "confidence": number (0-100), "evidence": "string", "reference": "string" },
    "architecturalThinking": { "score": number (0-100), "confidence": number (0-100), "evidence": "string", "reference": "string" },
    "decisionMaking": { "score": number (0-100), "confidence": number (0-100), "evidence": "string", "reference": "string" },
    "tradeoffAnalysis": { "score": number (0-100), "confidence": number (0-100), "evidence": "string", "reference": "string" },
    "adaptability": { "score": number (0-100), "confidence": number (0-100), "evidence": "string", "reference": "string" },
    "communication": { "score": number (0-100), "confidence": number (0-100), "evidence": "string", "reference": "string" },
    "cultureFit": { "score": number (0-100), "confidence": number (0-100), "evidence": "string", "reference": "string" }
  },
  "historicalComparison": {
    "similarEmployeeName": "string",
    "comparisonRationale": "string (1-2 sentences comparing this candidate's debate performance to the benchmark employee)"
  }
}`;

    const userPrompt = `Candidate: ${intern.name}
Role: ${intern.role}
Assessment Score: ${intern.score}%
Company Memory Benchmarks: ${JSON.stringify(hindsightContext)}

Interview Transcript:
---
${JSON.stringify(history)}
---`;

    const flowResult = await runCascadeFlow({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      priority: "HEAVY",
      response_format: { type: "json_object" }
    });

    const evaluation = JSON.parse(flowResult.content || "{}");

    // Run default team simulation context
    const simSystemPrompt = `You are KarsaTek OS's AI Hiring Simulation Engine.
Evaluate the candidate's alignment with a high-performance baseline product engineering team.

You MUST respond ONLY with a raw, valid JSON object matching this schema:
{
  "teamCompatibility": number (0-100),
  "successProbability": number (0-100),
  "promotionPotential": number (0-100),
  "attritionRisk": number (0-100),
  "burnoutRisk": number (0-100),
  "learningCurveWeeks": number,
  "confidenceScore": number (0-100),
  "explainableReasoning": "Detailed 2-3 sentence prediction of how the candidate fits this team."
}`;

    const simUserPrompt = `Candidate Profile:
- Name: ${intern.name}
- Tech Test: ${intern.score}%
- AI Interview Recommendation: ${evaluation.hiringRecommendation}
- Evaluation Scores: ${JSON.stringify(evaluation.scores)}

Baseline Team stack: React, Next.js, FastAPI, Postgres.
Manager profile: High autonomy, details-oriented.
Culture: Speed-focused, high ownership.`;

    const simFlowResult = await runCascadeFlow({
      messages: [
        { role: "system", content: simSystemPrompt },
        { role: "user", content: simUserPrompt }
      ],
      priority: "HEAVY",
      response_format: { type: "json_object" }
    });

    const simulation = JSON.parse(simFlowResult.content || "{}");

    // Update MongoDB record
    await db.collection("interns").updateOne(
      { _id: id as any },
      {
        $set: {
          status: "INTERVIEWED",
          interviewTranscript: history,
          interviewStrikes: strikes,
          interviewEvaluation: evaluation,
          simulationData: simulation,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ success: true, evaluation, simulation });
  } catch (err: any) {
    console.error("[INTERVIEW_SUBMIT_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

