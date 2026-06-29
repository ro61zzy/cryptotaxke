import { z } from "zod";
import type {
  ClassificationResult,
  NormalizedTransaction,
  TransactionExplanation,
} from "@/types";
import { getOpenAIClient } from "./client";
import { explainWithTemplate } from "@/lib/explain/templates";

const explanationSchema = z.object({
  summary: z.string(),
  taxable: z.boolean(),
  note: z.string().optional(),
});

/**
 * Generate a plain-English explanation for one transaction.
 * Uses templates for clear classifications to save OpenAI quota; chat uses the API instead.
 */
export async function explainTransaction(
  tx: NormalizedTransaction,
  classification: ClassificationResult,
): Promise<TransactionExplanation> {
  const openai = getOpenAIClient();
  if (!openai || classification.confidence >= 0.7) {
    return explainWithTemplate(tx, classification);
  }

  const movements = tx.movements
    .map((m) => `${m.direction === "in" ? "received" : "sent"} ${m.amount} ${m.symbol}`)
    .join("; ");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You explain crypto transactions to Kenyan users in plain English. " +
            "Be concise (1-2 sentences). Mention taxability under Kenyan rules when relevant. " +
            'Return JSON: {"summary": string, "taxable": boolean, "note": string optional}',
        },
        {
          role: "user",
          content: JSON.stringify({
            category: classification.category,
            movements,
            gasFeeEth: tx.gasFeeEth,
            fromHeuristic: classification.reasoning,
          }),
        },
      ],
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) return explainWithTemplate(tx, classification);

    const parsed = explanationSchema.parse(JSON.parse(raw));
    return { hash: tx.hash, ...parsed };
  } catch {
    return explainWithTemplate(tx, classification);
  }
}
