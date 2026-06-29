import type {
  ClassificationResult,
  NormalizedTransaction,
  TransactionExplanation,
} from "@/types";
import { CATEGORY_META } from "@/lib/categories";
import { formatToken } from "@/lib/utils";

function describeMovements(tx: NormalizedTransaction): string {
  const ins = tx.movements.filter((m) => m.direction === "in");
  const outs = tx.movements.filter((m) => m.direction === "out");

  if (ins.length && outs.length) {
    const sent = outs.map((m) => formatToken(m.amount, m.symbol)).join(", ");
    const received = ins.map((m) => formatToken(m.amount, m.symbol)).join(", ");
    return `You swapped ${sent} for ${received}.`;
  }

  if (ins.length) {
    const received = ins.map((m) => formatToken(m.amount, m.symbol)).join(", ");
    return `You received ${received}.`;
  }

  if (outs.length) {
    const sent = outs.map((m) => formatToken(m.amount, m.symbol)).join(", ");
    return `You sent ${sent}.`;
  }

  return "You interacted with a smart contract.";
}

/** Deterministic explanation when AI is unavailable. */
export function explainWithTemplate(
  tx: NormalizedTransaction,
  classification: ClassificationResult,
): TransactionExplanation {
  const meta = CATEGORY_META[classification.category];
  const movement = describeMovements(tx);

  const categoryNotes: Partial<Record<string, string>> = {
    trade: "This is typically treated as a taxable disposal of the asset you sent.",
    transfer_in: "Incoming transfers are usually not taxable until you dispose of the asset.",
    transfer_out: "Sending assets to another wallet is generally not a taxable event by itself.",
    internal_transfer: "This looks like a move between your own wallets and is usually not taxable.",
    staking_reward: "Staking rewards are generally treated as taxable income in Kenya.",
    airdrop: "Airdrops are generally treated as taxable income when received.",
  };

  return {
    hash: tx.hash,
    summary: `${movement} ${categoryNotes[classification.category] ?? ""}`.trim(),
    taxable: meta.taxable,
    note: classification.reasoning,
  };
}
