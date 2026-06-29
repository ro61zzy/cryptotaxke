import type { TaxSummary } from "@/types";

/** Versioned ruleset — update when KRA guidance changes. */
export const TAX_RULESET_VERSION = "kenya-2025-v1";

/**
 * Simplified Kenyan tax estimate (not tax advice).
 *
 * Under current guidance (post–July 2025 repeal of the 3% DAT):
 * - Trading profits and crypto income (staking, airdrops) are generally
 *   subject to income tax at progressive rates (10–35%).
 * - We use a configurable effective rate for estimation purposes.
 */
const EFFECTIVE_INCOME_TAX_RATE = 0.25;

export function estimateTaxKES(summary: TaxSummary): number {
  const taxableBase =
    Math.max(0, summary.realizedGainsKES) +
    summary.stakingIncomeKES +
    summary.airdropIncomeKES;

  return Math.round(taxableBase * EFFECTIVE_INCOME_TAX_RATE);
}

export const TAX_DISCLAIMER =
  "Estimates use a simplified 25% effective rate under ruleset kenya-2025-v1. " +
  "This is not tax advice. Confirm with a qualified professional or the KRA.";
