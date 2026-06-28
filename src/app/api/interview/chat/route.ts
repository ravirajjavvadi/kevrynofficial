import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { runCascadeFlow } from "@/lib/cascadeflow";

export async function POST(req: Request) {
  try {
    const { id, history, currentResponse, role, name } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "MISSING_CANDIDATE_ID" }, { status: 400 });
    }

    const db = await getDb();
    const intern = await db.collection("interns").findOne({ _id: id as any });

    if (!intern) {
      return NextResponse.json({ error: "CANDIDATE_NOT_FOUND" }, { status: 404 });
    }

    // Role-specific templates
    const interviewBlueprint = {
      role: intern.role || role || "Software Engineer",
      skills: intern.domain || "General Engineering",
      score: intern.score || 0,
      summary: intern.testResult?.summary || "Completed Technical Assessment Arena."
    };

    const systemPrompt = `You are KarsaTek OS's Autonomous AI Interviewer, simulating a highly experienced Senior Engineering Manager running in **AI Debate Mode**.
Your goal is to conduct an adaptive, cognitive technical interview. Do not just ask simple questions: challenge the candidate's assumptions.

AI Debate Mode Rules:
1. When the candidate gives a technical response, do not just accept it. Actively challenge their trade-offs (e.g. "Kafka has high complexity. Why not RabbitMQ?").
2. Introduce unexpected runtime constraints (e.g. "What if traffic scales 10x?", "What if your consumer crashes?", "How would you handle duplicate deliveries?").
3. Force decision-making between competing designs, and require them to explain the architectural trade-offs.
4. Keep questions conversational, direct, and concise (1-2 sentences max).
5. If history is empty, introduce yourself briefly (1 sentence) and ask a tailored starter question based on their target role and test summary.
6. Return only your question or conversation response. No explanations, no meta-commentary.`;

    const formattedMessages = [
      { role: "system", content: systemPrompt }
    ];

    // Append history
    if (Array.isArray(history)) {
      history.forEach((h: any) => {
        formattedMessages.push({ role: h.role, content: h.content });
      });
    }

    // Append candidate's latest response
    if (currentResponse) {
      formattedMessages.push({ role: "user", content: currentResponse });
    }

    // Call Groq Llama 70B via CascadeFlow (Heavyweight task)
    const result = await runCascadeFlow({
      messages: formattedMessages,
      priority: "HEAVY",
      temperature: 0.3,
      max_tokens: 400
    });

    return NextResponse.json({ question: result.content });
  } catch (err: any) {
    console.error("[INTERVIEW_CHAT_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
