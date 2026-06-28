import Groq from "groq-sdk";
import { getDb } from "@/lib/db";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export type ModelPriority = "LIGHT" | "HEAVY";

export interface CascadeFlowParams {
  messages: any[];
  priority: ModelPriority;
  response_format?: { type: "json_object" | "text" };
  temperature?: number;
  max_tokens?: number;
}

// Token pricing per 1,000,000 tokens
const PRICING = {
  LIGHT: {
    model: "llama-3.1-8b-instant",
    inputCostPerM: 0.05,
    outputCostPerM: 0.08,
  },
  HEAVY: {
    model: "llama-3.3-70b-versatile",
    inputCostPerM: 0.59,
    outputCostPerM: 0.79,
  },
};

/**
 * Route LLM queries based on task weight and log token cost savings to MongoDB.
 */
export async function runCascadeFlow(params: CascadeFlowParams) {
  const { priority, messages, response_format, temperature = 0.2, max_tokens } = params;

  const targetConfig = PRICING[priority];
  const heavyConfig = PRICING["HEAVY"];

  try {
    const startTime = Date.now();
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: targetConfig.model,
      temperature,
      max_tokens,
      response_format: response_format as any,
    });
    const duration = Date.now() - startTime;

    const usage = chatCompletion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    const promptTokens = usage.prompt_tokens;
    const completionTokens = usage.completion_tokens;

    // Calculate actual cost
    const actualCost = 
      (promptTokens / 1000000) * targetConfig.inputCostPerM +
      (completionTokens / 1000000) * targetConfig.outputCostPerM;

    // Calculate equivalent cost if routed to heavy model
    const baselineHeavyCost = 
      (promptTokens / 1000000) * heavyConfig.inputCostPerM +
      (completionTokens / 1000000) * heavyConfig.outputCostPerM;

    // Cost saved is the difference if we successfully chose the lightweight model
    const costSaved = priority === "LIGHT" ? Math.max(0, baselineHeavyCost - actualCost) : 0;

    // Log the transaction in MongoDB asynchronously
    try {
      const db = await getDb();
      await db.collection("audit_logs").insertOne({
        timestamp: new Date(),
        model: targetConfig.model,
        priority,
        promptTokens,
        completionTokens,
        totalTokens: usage.total_tokens,
        actualCost,
        costSaved,
        latencyMs: duration,
      });
    } catch (dbErr) {
      console.warn("[WARNING] CascadeFlow audit logging failed:", dbErr);
    }

    return {
      content: chatCompletion.choices[0]?.message?.content || "",
      model: targetConfig.model,
      usage,
      costSaved,
    };
  } catch (err: any) {
    console.error(`[CASCADEFLOW ERROR] Model routing failed:`, err);
    throw err;
  }
}
