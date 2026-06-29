import Link from "next/link";
import { notFound } from "next/navigation";
import { isAddress } from "viem";
import { Info } from "lucide-react";
import type { Address } from "@/types";
import { analyzeWallet } from "@/lib/analysis";
import { parseChainScope } from "@/lib/chains";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ChainSwitcher } from "@/components/dashboard/ChainSwitcher";
import { TaxSummaryCards } from "@/components/dashboard/TaxSummaryCards";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { shortAddress } from "@/lib/utils";

export default async function WalletResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ address: string }>;
  searchParams: Promise<{ chain?: string }>;
}) {
  const { address } = await params;
  const { chain: chainParam } = await searchParams;

  if (!isAddress(address)) {
    notFound();
  }

  const chainScope = parseChainScope(chainParam);
  const analysis = await analyzeWallet(address as Address, chainScope);
  const hasTransactions = analysis.transactions.length > 0;

  return (
    <Container className="py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted">Wallet</p>
          <h1 className="font-mono text-xl font-semibold">
            {shortAddress(address, 8)}
          </h1>
          <p className="mt-1 text-sm text-muted">{analysis.chainLabel}</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <ChainSwitcher address={address} current={chainScope} />
          <Link href="/dashboard" className="text-sm text-brand hover:underline">
            ← Analyze another wallet
          </Link>
        </div>
      </div>

      {analysis.fetchWarning && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p>{analysis.fetchWarning}</p>
        </div>
      )}

      {analysis.emptyMessage && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-line bg-surface-2 p-4 text-sm text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p>{analysis.emptyMessage}</p>
        </div>
      )}

      {hasTransactions && (
        <>
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-medium">Tax summary</h2>
            <TaxSummaryCards analysis={analysis} />
          </div>

          <div className="mt-10 flex items-center justify-between">
            <h2 className="text-lg font-medium">Transactions</h2>
            <Badge tone="neutral">{analysis.transactions.length} total</Badge>
          </div>

          <div className="mt-4">
            <TransactionList
              transactions={analysis.transactions}
              showChain={chainScope === "all"}
            />
          </div>
        </>
      )}
    </Container>
  );
}
