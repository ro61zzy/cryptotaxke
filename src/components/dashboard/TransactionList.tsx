import type { AnalyzedTransaction } from "@/lib/analysis";
import { CHAIN_NAMES } from "@/types";
import { TransactionRow } from "./TransactionRow";

export function TransactionList({
  transactions,
  showChain = false,
}: {
  transactions: AnalyzedTransaction[];
  showChain?: boolean;
}) {
  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      {transactions.map((tx) => (
        <TransactionRow key={`${tx.chainId}-${tx.hash}`} tx={tx} showChain={showChain} />
      ))}
    </div>
  );
}
