import Link from "next/link";
import { notFound } from "next/navigation";
import { isAddress } from "viem";
import { Info } from "lucide-react";
import type { Address } from "@/types";
import { analyzeWallet } from "@/lib/analysis";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { shortAddress } from "@/lib/utils";

export default async function WalletResultsPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  if (!isAddress(address)) {
    notFound();
  }

  const analysis = await analyzeWallet(address as Address);

  return (
    <Container className="py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted">Wallet</p>
          <h1 className="font-mono text-xl font-semibold">
            {shortAddress(address, 8)}
          </h1>
        </div>
        <Link href="/dashboard" className="text-sm text-brand hover:underline">
          ← Analyze another wallet
        </Link>
      </div>

      {analysis.isSample && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-line bg-surface-2 p-4 text-sm text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p>
            Showing <span className="text-foreground">sample data</span>. Add an
            Alchemy API key to import this wallet&apos;s real on-chain history.
          </p>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-medium">Transactions</h2>
        <Badge tone="neutral">{analysis.transactions.length} total</Badge>
      </div>

      <div className="mt-4">
        <TransactionList transactions={analysis.transactions} />
      </div>
    </Container>
  );
}
