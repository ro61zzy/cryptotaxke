import type { WalletAnalysis } from "@/lib/analysis";
import { TAX_DISCLAIMER } from "@/lib/tax/rules";
import { Card, CardTitle, CardValue } from "@/components/ui/Card";
import { formatKES } from "@/lib/utils";

export function TaxSummaryCards({ analysis }: { analysis: WalletAnalysis }) {
  const { taxSummary, portfolioValueKES } = analysis;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardTitle>Portfolio value</CardTitle>
          <CardValue>{formatKES(portfolioValueKES)}</CardValue>
        </Card>
        <Card>
          <CardTitle>Realized gains</CardTitle>
          <CardValue
            className={taxSummary.realizedGainsKES >= 0 ? "text-positive" : "text-danger"}
          >
            {formatKES(taxSummary.realizedGainsKES)}
          </CardValue>
        </Card>
        <Card>
          <CardTitle>Staking income</CardTitle>
          <CardValue>{formatKES(taxSummary.stakingIncomeKES)}</CardValue>
        </Card>
        <Card>
          <CardTitle>Est. tax owed</CardTitle>
          <CardValue className="text-brand">
            {formatKES(taxSummary.estimatedTaxKES)}
          </CardValue>
        </Card>
      </div>
      <p className="text-xs text-muted">{TAX_DISCLAIMER}</p>
    </div>
  );
}
