import { Info } from "lucide-react";

/** Explains supported vs planned data sources (shown on dashboard). */
export function DataSourcesNote() {
  return (
    <div className="rounded-lg border border-line bg-surface-2 p-4 text-sm text-muted">
      <p className="font-medium text-foreground">What we import today</p>
      <p className="mt-2">
        <strong className="text-foreground">On-chain (EVM):</strong> paste a{" "}
        <code className="text-foreground">0x…</code> address — we pull real transfers from
        Ethereum, Base, Polygon, Arbitrum, Optimism, BNB Chain, and Avalanche via Alchemy.
      </p>
      <p className="mt-2 flex items-start gap-2">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <span>
          <strong className="text-foreground">Bitcoin</strong> uses different addresses (
          <code className="text-foreground">bc1…</code>, <code className="text-foreground">1…</code>
          ) — not compatible with MetaMask/Alchemy.{" "}
          <strong className="text-foreground">Binance exchange</strong> trades happen off-chain;
          import via CSV export (planned). We never show fake data.
        </span>
      </p>
    </div>
  );
}
