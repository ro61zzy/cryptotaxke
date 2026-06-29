import { describe, it, expect, beforeEach } from "vitest";
import type { Address } from "@/types";
import type { AnalyzedTransaction } from "@/lib/analysis";
import { clearPricingCache } from "@/lib/pricing";
import { computeTaxSummary } from "./fifo";

const WALLET = "0x0000000000000000000000000000000000000001" as Address;

function tx(
  partial: Partial<AnalyzedTransaction> & Pick<AnalyzedTransaction, "hash" | "timestamp" | "movements">,
): AnalyzedTransaction {
  return {
    chainId: 1,
    blockNumber: 1,
    from: WALLET,
    to: null,
    gasFeeEth: 0,
    classification: {
      category: "transfer_in",
      confidence: 0.9,
      source: "heuristic",
    },
    explanation: {
      hash: partial.hash,
      summary: "Test transaction",
      taxable: false,
    },
    ...partial,
  };
}

describe("computeTaxSummary", () => {
  beforeEach(() => {
    clearPricingCache();
  });

  it("matches FIFO lots on a trade disposal", async () => {
    const buy = tx({
      hash: "0xbuy",
      timestamp: Date.UTC(2024, 0, 1),
      movements: [{ symbol: "ETH", contract: null, amount: 1, decimals: 18, direction: "in" }],
      classification: {
        category: "transfer_in",
        confidence: 0.9,
        source: "heuristic",
      },
    });

    const sell = tx({
      hash: "0xsell",
      timestamp: Date.UTC(2024, 5, 1),
      movements: [{ symbol: "ETH", contract: null, amount: 0.5, decimals: 18, direction: "out" }],
      classification: {
        category: "trade",
        confidence: 0.9,
        source: "heuristic",
      },
    });

    const summary = await computeTaxSummary([sell, buy]);

    expect(summary.disposals).toHaveLength(1);
    expect(summary.disposals[0].amount).toBe(0.5);
    expect(summary.disposals[0].costBasisKES).toBeGreaterThan(0);
    expect(summary.disposals[0].proceedsKES).toBeGreaterThan(0);
    expect(summary.disposals[0].gainKES).toBe(
      summary.disposals[0].proceedsKES - summary.disposals[0].costBasisKES,
    );
    expect(summary.realizedGainsKES).toBe(summary.disposals[0].gainKES);
  });

  it("counts staking rewards as income", async () => {
    const reward = tx({
      hash: "0xstake",
      timestamp: Date.UTC(2024, 2, 1),
      movements: [{ symbol: "ETH", contract: null, amount: 0.1, decimals: 18, direction: "in" }],
      classification: {
        category: "staking_reward",
        confidence: 0.9,
        source: "heuristic",
      },
    });

    const summary = await computeTaxSummary([reward]);

    expect(summary.stakingIncomeKES).toBeGreaterThan(0);
    expect(summary.disposals).toHaveLength(0);
  });
});
