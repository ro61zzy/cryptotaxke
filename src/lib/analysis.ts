import type {
  Address,
  ChainId,
  ClassificationResult,
  NormalizedTransaction,
} from "@/types";
import { getWalletTransactions } from "@/lib/chain/alchemy";
import { classifyHeuristic } from "@/lib/classify/heuristics";

export interface AnalyzedTransaction extends NormalizedTransaction {
  classification: ClassificationResult;
}

export interface WalletAnalysis {
  address: Address;
  chainId: ChainId;
  transactions: AnalyzedTransaction[];
  /** True when results come from sample data rather than a live chain. */
  isSample: boolean;
}

/**
 * Top-level orchestration for Sprint 1: ingest a wallet's transactions
 * and attach a classification to each. Cost-basis and AI explanations
 * are layered on in later sprints.
 */
export async function analyzeWallet(
  address: Address,
  chainId: ChainId = 1,
): Promise<WalletAnalysis> {
  const { features } = await import("@/lib/env");
  const transactions = await getWalletTransactions(address, chainId);

  return {
    address,
    chainId,
    isSample: !features.onchain,
    transactions: transactions.map((tx) => ({
      ...tx,
      classification: classifyHeuristic(tx, address),
    })),
  };
}
