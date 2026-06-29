/**
 * Core domain types for CryptoTaxKE.
 *
 * The app ingests raw on-chain activity, normalizes it into
 * `NormalizedTransaction`s, classifies them, and runs a cost-basis
 * engine to produce tax estimates.
 */

export type Address = `0x${string}`;

/** EVM networks supported via Alchemy. Same 0x address, different activity per chain. */
export type ChainId = 1 | 10 | 56 | 137 | 8453 | 42161 | 43114 | 11155111;

export const CHAIN_NAMES: Record<ChainId, string> = {
  1: "Ethereum",
  10: "Optimism",
  56: "BNB Chain",
  137: "Polygon",
  8453: "Base",
  42161: "Arbitrum",
  43114: "Avalanche",
  11155111: "Sepolia",
};

/** Mainnet chains shown in the UI (order = priority). */
export const SUPPORTED_CHAINS: ChainId[] = [
  1, 8453, 137, 42161, 10, 56, 43114,
];

export type ChainScope = ChainId | "all";

/**
 * Semantic transaction categories. These drive both the plain-English
 * explanations and the tax treatment.
 */
export type TxCategory =
  | "trade"
  | "transfer_in"
  | "transfer_out"
  | "internal_transfer"
  | "staking_reward"
  | "airdrop"
  | "liquidity"
  | "nft"
  | "fee"
  | "contract_interaction"
  | "unknown";

/** A single asset movement within a transaction. */
export interface AssetMovement {
  symbol: string;
  contract: Address | null;
  amount: number;
  decimals: number;
  direction: "in" | "out";
}

/** A normalized, chain-agnostic representation of one on-chain transaction. */
export interface NormalizedTransaction {
  hash: string;
  chainId: ChainId;
  timestamp: number;
  blockNumber: number;
  from: Address;
  to: Address | null;
  movements: AssetMovement[];
  gasFeeEth: number;
  methodId?: string;
}

/** Output of the classification step. */
export interface ClassificationResult {
  category: TxCategory;
  confidence: number;
  source: "heuristic" | "ai" | "user";
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
  unitCostKES: number;
  acquiredAt: number;
}

/** A realized disposal matched against tax lots. */
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
  estimatedTaxKES: number;
  disposals: Disposal[];
  rulesetVersion: string;
}

