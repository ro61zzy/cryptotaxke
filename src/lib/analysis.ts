import type {
  Address,
  ChainScope,
  ClassificationResult,
  NormalizedTransaction,
  TaxSummary,
  TransactionExplanation,
} from "@/types";
import { CHAIN_NAMES, SUPPORTED_CHAINS } from "@/types";
import { getWalletTransactions } from "@/lib/chain/alchemy";
import { chainScopeLabel } from "@/lib/chains";
import { features } from "@/lib/env";
import { classifyHeuristic } from "@/lib/classify/heuristics";
import { classifyWithAi } from "@/lib/classify/ai";
import { explainTransaction } from "@/lib/ai/explain";
import { explainWithTemplate } from "@/lib/explain/templates";
import { computePortfolioValueKES, computeTaxSummary } from "@/lib/tax/fifo";

export interface AnalyzedTransaction extends NormalizedTransaction {
  classification: ClassificationResult;
  explanation: TransactionExplanation;
}

export interface WalletAnalysis {
  address: Address;
  chainScope: ChainScope;
  chainLabel: string;
  transactions: AnalyzedTransaction[];
  taxSummary: TaxSummary;
  portfolioValueKES: number;
  /** Partial failures when loading multiple chains. */
  fetchWarning?: string;
  /** Shown when no transactions could be displayed. */
  emptyMessage?: string;
}

interface ScopeFetchResult {
  transactions: NormalizedTransaction[];
  chainErrors: string[];
}

async function fetchForScope(
  address: Address,
  scope: ChainScope,
): Promise<ScopeFetchResult> {
  const chains = scope === "all" ? SUPPORTED_CHAINS : [scope];
  const results = await Promise.all(
    chains.map(async (chainId) => ({
      chainId,
      ...(await getWalletTransactions(address, chainId)),
    })),
  );

  const chainErrors = results
    .filter((r) => r.error)
    .map((r) => `${CHAIN_NAMES[r.chainId]}: ${r.error}`);

  const transactions = results
    .flatMap((r) => r.transactions)
    .sort((a, b) => b.timestamp - a.timestamp);

  return { transactions, chainErrors };
}

export interface AnalyzeOptions {
  /** Skip per-tx OpenAI calls; heuristics + templates only (e.g. chat context). */
  lightweight?: boolean;
}

async function analyzeTransaction(
  tx: NormalizedTransaction,
  address: Address,
  options?: AnalyzeOptions,
): Promise<AnalyzedTransaction> {
  const heuristic = classifyHeuristic(tx, address);
  const classification = options?.lightweight
    ? heuristic
    : await classifyWithAi(tx, address, heuristic);
  const explanation = options?.lightweight
    ? explainWithTemplate(tx, classification)
    : await explainTransaction(tx, classification);
  return { ...tx, classification, explanation };
}

function buildEmptyMessage(
  scope: ChainScope,
  transactionCount: number,
  chainErrors: string[],
): string | undefined {
  if (transactionCount > 0) return undefined;

  if (!features.onchain) {
    return "Set ALCHEMY_API_KEY in your .env file to import on-chain transactions.";
  }

  if (chainErrors.length > 0) {
    const scopeLabel = scope === "all" ? "all selected chains" : CHAIN_NAMES[scope as keyof typeof CHAIN_NAMES];
    return `Could not load transactions on ${scopeLabel}. ${chainErrors.join(" · ")}`;
  }

  return "No transactions found for this wallet on the selected chain(s). This address may have no visible transfer history, or activity may be on a network we do not support yet (e.g. Bitcoin, Solana, or Binance exchange trades).";
}

export async function analyzeWallet(
  address: Address,
  chainScope: ChainScope = "all",
  options?: AnalyzeOptions,
): Promise<WalletAnalysis> {
  const fetch = await fetchForScope(address, chainScope);

  const transactions = await Promise.all(
    fetch.transactions.map((tx) => analyzeTransaction(tx, address, options)),
  );

  const sorted = transactions.sort((a, b) => b.timestamp - a.timestamp);

  const [taxSummary, portfolioValueKES] = await Promise.all([
    computeTaxSummary(sorted),
    computePortfolioValueKES(sorted),
  ]);

  const partialErrors =
    fetch.chainErrors.length > 0 && sorted.length > 0
      ? `Some chains could not be loaded: ${fetch.chainErrors.join(" · ")}`
      : undefined;

  return {
    address,
    chainScope,
    chainLabel: chainScopeLabel(chainScope),
    transactions: sorted,
    taxSummary,
    portfolioValueKES,
    fetchWarning: partialErrors,
    emptyMessage: buildEmptyMessage(chainScope, sorted.length, fetch.chainErrors),
  };
}
