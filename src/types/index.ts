/**
 * Core domain types for CryptoTaxKE.
 *
 * The app ingests raw on-chain activity, normalizes it into
 * `NormalizedTransaction`s, classifies them, and runs a cost-basis
 * engine to produce tax estimates.
 */

export type Address = `0x${string}`;

/** Supported EVM networks (MVP focuses on Ethereum mainnet). */
export type ChainId = 1 | 11155111 | 8453 | 42161;

export const CHAIN_NAMES: Record<ChainId, string> = {
  1: "Ethereum",
  11155111: "Sepolia",
  8453: "Base",
  42161: "Arbitrum",
};

/**
 * Semantic transaction categories. These drive both the plain-English
 * explanations and the tax treatment.
 */
export type TxCategory =
  | "trade" // swap of one asset for another
  | "transfer_in" // received assets from an external party
  | "transfer_out" // sent assets to an external party
  | "internal_transfer" // moved between the user's own wallets (non-taxable)
  | "staking_reward" // income event
  | "airdrop" // income event
  | "liquidity" // LP deposit/withdraw
  | "nft" // NFT purchase/sale
  | "fee" // standalone gas/fee
  | "contract_interaction" // generic contract call
  | "unknown";

/** A single asset movement within a transaction. */
export interface AssetMovement {
  symbol: string;
  /** Contract address for ERC-20s; null for the native asset (ETH). */
  contract: Address | null;
  /** Human-readable amount (already adjusted for decimals). */
  amount: number;
  decimals: number;
  direction: "in" | "out";
}

/** A normalized, chain-agnostic representation of one on-chain transaction. */
export interface NormalizedTransaction {
  hash: string;
  chainId: ChainId;
  /** Unix epoch milliseconds. */
  timestamp: number;
  blockNumber: number;
  from: Address;
  to: Address | null;
  /** Net asset movements relative to the wallet being analyzed. */
  movements: AssetMovement[];
  /** Gas fee paid in the native asset, if the wallet was the sender. */
  gasFeeEth: number;
  /** Raw method selector (first 4 bytes of calldata), if any. */
  methodId?: string;
}

/** Output of the classification step. */
export interface ClassificationResult {
  category: TxCategory;
  /** 0–1 confidence from the classifier. */
  confidence: number;
  /** Where the label came from, for transparency in the UI. */
  source: "heuristic" | "ai" | "user";
  /** Short, human-readable rationale. */
  reasoning?: string;
}

/** A plain-English explanation of a transaction for the end user. */
export interface TransactionExplanation {
  hash: string;
  summary: string;
  taxable: boolean;
  note?: string;
}

/** A purchased lot tracked by the FIFO cost-basis engine. */
export interface TaxLot {
  symbol: string;
  amount: number;
  /** Cost basis in KES at acquisition time (per whole unit). */
  unitCostKES: number;
  acquiredAt: number;
}

/** A realized disposal (sale/swap-out) matched against tax lots. */
export interface Disposal {
  symbol: string;
  amount: number;
  proceedsKES: number;
  costBasisKES: number;
  gainKES: number;
  disposedAt: number;
  txHash: string;
}

/** Aggregated tax summary for a period. */
export interface TaxSummary {
  periodLabel: string;
  realizedGainsKES: number;
  stakingIncomeKES: number;
  airdropIncomeKES: number;
  /** Estimated tax owed under the configured rules. */
  estimatedTaxKES: number;
  disposals: Disposal[];
  /** The ruleset version used to compute this estimate. */
  rulesetVersion: string;
}
