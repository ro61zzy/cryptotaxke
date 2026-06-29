import type { Disposal, TaxLot, TaxSummary, TxCategory } from "@/types";
import type { AnalyzedTransaction } from "@/lib/analysis";
import { valueInKES } from "@/lib/pricing";
import { estimateTaxKES, TAX_RULESET_VERSION } from "./rules";

const INCOME_CATEGORIES: TxCategory[] = ["staking_reward", "airdrop"];

interface LotQueue {
  lots: TaxLot[];
}

/**
 * FIFO cost-basis engine. Processes transactions chronologically,
 * tracking lots on acquisition and matching disposals on trades/outs.
 */
export async function computeTaxSummary(
  transactions: AnalyzedTransaction[],
  periodLabel = "All time",
): Promise<TaxSummary> {
  const sorted = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
  const queues = new Map<string, LotQueue>();
  const disposals: Disposal[] = [];
  let stakingIncomeKES = 0;
  let airdropIncomeKES = 0;

  for (const tx of sorted) {
    const { category } = tx.classification;

    for (const movement of tx.movements) {
      const symbol = movement.symbol.toUpperCase();
      if (!queues.has(symbol)) queues.set(symbol, { lots: [] });
      const queue = queues.get(symbol)!;

      if (movement.direction === "in") {
        const unitCostKES =
          (await valueInKES(symbol, movement.amount, tx.timestamp)) / movement.amount;

        if (INCOME_CATEGORIES.includes(category)) {
          const income = unitCostKES * movement.amount;
          if (category === "staking_reward") stakingIncomeKES += income;
          if (category === "airdrop") airdropIncomeKES += income;
        }

        queue.lots.push({
          symbol,
          amount: movement.amount,
          unitCostKES,
          acquiredAt: tx.timestamp,
        });
        continue;
      }

      // Disposal: trade or transfer_out (transfers out still reduce holdings;
      // for MVP we treat trade outs as taxable disposals only on "trade" category)
      if (category !== "trade" && category !== "transfer_out") continue;

      let remaining = movement.amount;
      const proceedsKES = await valueInKES(symbol, movement.amount, tx.timestamp);
      let costBasisKES = 0;

      while (remaining > 0 && queue.lots.length > 0) {
        const lot = queue.lots[0];
        const take = Math.min(remaining, lot.amount);
        costBasisKES += take * lot.unitCostKES;
        lot.amount -= take;
        remaining -= take;
        if (lot.amount <= 1e-12) queue.lots.shift();
      }

      if (category === "trade") {
        disposals.push({
          symbol,
          amount: movement.amount,
          proceedsKES,
          costBasisKES,
          gainKES: proceedsKES - costBasisKES,
          disposedAt: tx.timestamp,
          txHash: tx.hash,
        });
      }
    }
  }

  const realizedGainsKES = disposals.reduce((sum, d) => sum + d.gainKES, 0);

  const summary: TaxSummary = {
    periodLabel,
    realizedGainsKES,
    stakingIncomeKES,
    airdropIncomeKES,
    estimatedTaxKES: 0,
    disposals,
    rulesetVersion: TAX_RULESET_VERSION,
  };

  summary.estimatedTaxKES = estimateTaxKES(summary);
  return summary;
}

/** Sum current holdings valued at latest transaction timestamps. */
export async function computePortfolioValueKES(
  transactions: AnalyzedTransaction[],
): Promise<number> {
  const holdings = new Map<string, number>();
  let latestTs = Date.now();

  for (const tx of transactions) {
    latestTs = Math.max(latestTs, tx.timestamp);
    for (const m of tx.movements) {
      const sym = m.symbol.toUpperCase();
      const current = holdings.get(sym) ?? 0;
      holdings.set(sym, current + (m.direction === "in" ? m.amount : -m.amount));
    }
  }

  let total = 0;
  for (const [symbol, amount] of holdings) {
    if (amount > 0) {
      total += await valueInKES(symbol, amount, latestTs);
    }
  }
  return total;
}
