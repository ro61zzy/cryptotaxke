import type {
  Address,
  ChainId,
  ClassificationResult,
  NormalizedTransaction,
  TaxSummary,
  TransactionExplanation,
} from "@/types";
import { getWalletTransactions } from "@/lib/chain/alchemy";
import { classifyHeuristic } from "@/lib/classify/heuristics";
import { classifyWithAi } from "@/lib/classify/ai";
import { explainTransaction } from "@/lib/ai/explain";
import { computePortfolioValueKES, computeTaxSummary } from "@/lib/tax/fifo";

export interface AnalyzedTransaction extends NormalizedTransaction {
  classification: ClassificationResult;
  explanation: TransactionExplanation;
}

export interface WalletAnalysis {
  address: Address;
  chainId: ChainId;
  transactions: AnalyzedTransaction[];
  taxSummary: TaxSummary;
  portfolioValueKES: number;
  /** True when results come from sample data rather than a live chain. */
  isSample: boolean;
}

async function analyzeTransaction(
  tx: NormalizedTransaction,
  address: Address,
): Promise<AnalyzedTransaction> {
  const heuristic = classifyHeuristic(tx, address);
  const classification = await classifyWithAi(tx, address, heuristic);
  const explanation = await explainTransaction(tx, classification);

  return { ...tx, classification, explanation };
}

/**
 * Full wallet analysis: ingest → classify → explain → tax summary.
 */
export async function analyzeWallet(
  address: Address,
  chainId: ChainId = 1,
): Promise<WalletAnalysis> {
  const { features } = await import("@/lib/env");
  const raw = await getWalletTransactions(address, chainId);

  const transactions = await Promise.all(
    raw.map((tx) => analyzeTransaction(tx, address)),
  );

  const [taxSummary, portfolioValueKES] = await Promise.all([
    computeTaxSummary(transactions),
    computePortfolioValueKES(transactions),
  ]);

  return {
    address,
    chainId,
    isSample: !features.onchain,
    transactions: transactions.sort((a, b) => b.timestamp - a.timestamp),
    taxSummary,
    portfolioValueKES,
  };
}
