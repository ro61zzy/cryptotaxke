import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { AnalyzedTransaction } from "@/lib/analysis";
import { CATEGORY_META } from "@/lib/categories";
import { Badge } from "@/components/ui/Badge";
import { formatToken, shortAddress } from "@/lib/utils";

function MovementLine({
  direction,
  amount,
  symbol,
}: {
  direction: "in" | "out";
  amount: number;
  symbol: string;
}) {
  const isIn = direction === "in";
  return (
    <span
      className={isIn ? "text-positive" : "text-foreground"}
      title={`${isIn ? "Received" : "Sent"} ${amount} ${symbol}`}
    >
      {isIn ? "+" : "−"}
      {formatToken(amount, symbol)}
    </span>
  );
}

export function TransactionRow({ tx }: { tx: AnalyzedTransaction }) {
  const meta = CATEGORY_META[tx.classification.category];
  const date = new Date(tx.timestamp).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-4 border-b border-line/60 px-4 py-4 last:border-0 hover:bg-surface-2/50">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2">
        {tx.movements.some((m) => m.direction === "in") ? (
          <ArrowDownLeft className="h-4 w-4 text-positive" />
        ) : (
          <ArrowUpRight className="h-4 w-4 text-muted" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Badge tone={meta.tone}>{meta.label}</Badge>
          {meta.taxable && <Badge tone="warning">Taxable</Badge>}
        </div>
        <p className="mt-1 truncate text-xs text-muted">
          {date} · {shortAddress(tx.hash, 6)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-0.5 text-sm font-medium">
        {tx.movements.length > 0 ? (
          tx.movements.map((m, i) => (
            <MovementLine
              key={i}
              direction={m.direction}
              amount={m.amount}
              symbol={m.symbol}
            />
          ))
        ) : (
          <span className="text-muted">—</span>
        )}
      </div>
    </div>
  );
}
