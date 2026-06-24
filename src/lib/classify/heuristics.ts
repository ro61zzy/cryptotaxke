import type {
  Address,
  ClassificationResult,
  NormalizedTransaction,
} from "@/types";

/**
 * Deterministic, rules-based classification. This runs first; the AI
 * classifier is only consulted for low-confidence cases (see analysis.ts).
 * Keeping obvious cases here makes the system cheaper, faster, and auditable.
 */
export function classifyHeuristic(
  tx: NormalizedTransaction,
  wallet: Address,
): ClassificationResult {
  const w = wallet.toLowerCase();
  const ins = tx.movements.filter((m) => m.direction === "in");
  const outs = tx.movements.filter((m) => m.direction === "out");

  if (tx.from?.toLowerCase() === w && tx.to?.toLowerCase() === w) {
    return {
      category: "internal_transfer",
      confidence: 0.9,
      source: "heuristic",
      reasoning: "Sender and recipient are the same wallet.",
    };
  }

  if (ins.length > 0 && outs.length > 0) {
    const assets = new Set([...ins, ...outs].map((m) => m.symbol));
    if (assets.size > 1) {
      return {
        category: "trade",
        confidence: 0.85,
        source: "heuristic",
        reasoning:
          "One asset was sent and a different asset received in the same transaction.",
      };
    }
  }

  if (ins.length > 0 && outs.length === 0) {
    return {
      category: "transfer_in",
      confidence: 0.55,
      source: "heuristic",
      reasoning: "Assets were received with nothing sent in return.",
    };
  }

  if (outs.length > 0 && ins.length === 0) {
    return {
      category: "transfer_out",
      confidence: 0.55,
      source: "heuristic",
      reasoning: "Assets were sent with nothing received in return.",
    };
  }

  return {
    category: "contract_interaction",
    confidence: 0.4,
    source: "heuristic",
    reasoning: "No clear asset movement was detected.",
  };
}
