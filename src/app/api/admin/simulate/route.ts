import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { runCascadeFlow } from "@/lib/cascadeflow";
import { currentUser } from "@clerk/nextjs/server";

const ADMIN_WHITELIST = [
  'ravirajjavvadhi@gmail.com',
  '___KarsaTek OS_ADMIN_EMAIL___'
];

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const emails = user.emailAddresses.map(e => e.emailAddress.toLowerCase());
    const isAdmin = emails.some(email => ADMIN_WHITELIST.includes(email));

    if (!isAdmin) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const body = await req.json();
    const { id, teamStack, managerProfile, projectScope, culture, jobDescription } = body;

    if (!id) {
      return NextResponse.json({ error: "MISSING_CANDIDATE_ID" }, { status: 400 });
    }

    const db = await getDb();
    const intern = await db.collection("interns").findOne({ _id: id as any });

    if (!intern) {
      return NextResponse.json({ error: "CANDIDATE_NOT_FOUND" }, { status: 404 });
    }

    // Retrieve top-performing employee metrics from hindsight memory
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

    const systemPrompt = `You are KarsaTek OS's AI Hiring Simulation Engine.
You simulate a candidate's compatibility and long-term projection within a specific team.
Evaluate this candidate against the target job requirements and company profile.
Use the hindsight context from our company's top-performing employees in the same role to calibrate your predictions.

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

    const userPrompt = `Candidate Profile:
- Name: ${intern.name}
- Role: ${intern.role}
- Tech Test: ${intern.score}%
- AI Interview Verdict: ${intern.interviewEvaluation?.hiringRecommendation || "N/A"}
- Multidimensional Strengths: ${JSON.stringify(intern.interviewEvaluation?.scores || {})}

Company Team Profile:
- Tech Stack: ${teamStack || "Not Specified"}
- Manager Profile: ${managerProfile || "Not Specified"}
- Project Scope: ${projectScope || "Not Specified"}
- Team Culture: ${culture || "Not Specified"}
- Job Requirements: ${jobDescription || "Not Specified"}

Hindsight Top-Performers (Calibration Context):
${JSON.stringify(hindsightContext)}

Run simulation and return the JSON.`;

    const flowResult = await runCascadeFlow({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      priority: "HEAVY",
      response_format: { type: "json_object" }
    });

    const simulation = JSON.parse(flowResult.content || "{}");

    // Cache the simulation data back to the candidate's document
    await db.collection("interns").updateOne(
      { _id: id as any },
      { $set: { simulationData: simulation } }
    );

    return NextResponse.json(simulation);
  } catch (err: any) {
    console.error("[SIMULATE_ENGINE_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
