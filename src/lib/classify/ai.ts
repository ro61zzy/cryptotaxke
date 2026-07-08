import { z } from "zod";
import type {
  Address,
  ClassificationResult,
  NormalizedTransaction,
  TxCategory,
} from "@/types";
import { getChatModel, getOpenAIClient } from "@/lib/ai/client";

const AI_CONFIDENCE_THRESHOLD = 0.7;

const categorySchema = z.object({
  category: z.enum([
    "trade",
    "transfer_in",
    "transfer_out",
    "internal_transfer",
    "staking_reward",
    "airdrop",
    "liquidity",
    "nft",
    "fee",
    "contract_interaction",
    "unknown",
  ]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});

export function needsAiClassification(result: ClassificationResult): boolean {
  return result.confidence < AI_CONFIDENCE_THRESHOLD;
}

/** Re-classify ambiguous transactions with the LLM. */
export async function classifyWithAi(
  tx: NormalizedTransaction,
  wallet: Address,
  heuristic: ClassificationResult,
): Promise<ClassificationResult> {
  if (!needsAiClassification(heuristic)) return heuristic;

  const openai = getOpenAIClient();
  if (!openai) return heuristic;

  const movements = tx.movements
    .map((m) => `${m.direction}: ${m.amount} ${m.symbol}`)
    .join(", ");

  try {
    const response = await openai.chat.completions.create({
      model: getChatModel(),
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Classify a crypto transaction for tax purposes. " +
            'Return JSON: {"category": one of trade|transfer_in|transfer_out|internal_transfer|staking_reward|airdrop|liquidity|nft|fee|contract_interaction|unknown, "confidence": 0-1, "reasoning": string}',
        },
        {
          role: "user",
          content: JSON.stringify({
            wallet,
            from: tx.from,
            to: tx.to,
            movements,
            heuristicGuess: heuristic.category,
          }),
        },
      ],
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) return heuristic;

    const parsed = categorySchema.parse(JSON.parse(raw));
    return {
      category: parsed.category as TxCategory,
      confidence: parsed.confidence,
      source: "ai",
      reasoning: parsed.reasoning,
    };
  } catch {
    return heuristic;
  }
}
