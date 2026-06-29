import { describe, it, expect } from "vitest";
import { estimateTaxKES, TAX_RULESET_VERSION } from "./rules";
import type { TaxSummary } from "@/types";

describe("estimateTaxKES", () => {
  it("applies effective rate to gains and income", () => {
    const summary: TaxSummary = {
      periodLabel: "2025",
      realizedGainsKES: 100_000,
      stakingIncomeKES: 20_000,
      airdropIncomeKES: 0,
      estimatedTaxKES: 0,
      disposals: [],
      rulesetVersion: TAX_RULESET_VERSION,
    };

    expect(estimateTaxKES(summary)).toBe(30_000);
  });

  it("ignores negative gains in the taxable base", () => {
    const summary: TaxSummary = {
      periodLabel: "2025",
      realizedGainsKES: -50_000,
      stakingIncomeKES: 10_000,
      airdropIncomeKES: 0,
      estimatedTaxKES: 0,
      disposals: [],
      rulesetVersion: TAX_RULESET_VERSION,
    };

    expect(estimateTaxKES(summary)).toBe(2_500);
  });
});
