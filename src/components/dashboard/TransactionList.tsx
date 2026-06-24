import type { AnalyzedTransaction } from "@/lib/analysis";
import { TransactionRow } from "./TransactionRow";

export function TransactionList({
  transactions,
}: {
  transactions: AnalyzedTransaction[];
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface p-10 text-center text-muted">
        No transactions found for this wallet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      {transactions.map((tx) => (
        <TransactionRow key={tx.hash} tx={tx} />
      ))}
    </div>
  );
}
