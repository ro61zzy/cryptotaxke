import type {
  Address,
  ChainId,
  NormalizedTransaction,
} from "@/types";
import { CHAIN_NAMES } from "@/types";
import { env, features } from "@/lib/env";

const ALCHEMY_BASE: Record<ChainId, string> = {
  1: "https://eth-mainnet.g.alchemy.com/v2",
  10: "https://opt-mainnet.g.alchemy.com/v2",
  56: "https://bnb-mainnet.g.alchemy.com/v2",
  137: "https://polygon-mainnet.g.alchemy.com/v2",
  8453: "https://base-mainnet.g.alchemy.com/v2",
  42161: "https://arb-mainnet.g.alchemy.com/v2",
  43114: "https://avax-mainnet.g.alchemy.com/v2",
  11155111: "https://eth-sepolia.g.alchemy.com/v2",
};

export interface WalletFetchResult {
  transactions: NormalizedTransaction[];
  /** Set when this chain failed to load (empty transactions). */
  error?: string;
}

interface AlchemyTransfer {
  hash?: string;
  uniqueId?: string;
  from?: string;
  to?: string | null;
  value?: number | null;
  asset?: string | null;
  blockNum?: string;
  metadata?: { blockTimestamp?: string };
  rawContract?: { address?: string; decimal?: string };
}

interface AssetTransfersResponse {
  transfers: AlchemyTransfer[];
}

async function alchemyRpc<T>(
  chainId: ChainId,
  method: string,
  params: unknown[],
): Promise<T> {
  const url = `${ALCHEMY_BASE[chainId]}/${env.alchemyApiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const json = (await res.json()) as { result?: T; error?: { message: string } };
  if (json.error) {
    throw new Error(json.error.message);
  }
  if (json.result === undefined) {
    throw new Error("Alchemy returned an empty response.");
  }
  return json.result;
}

async function fetchTransfers(
  chainId: ChainId,
  filter: { fromAddress?: Address; toAddress?: Address },
): Promise<AlchemyTransfer[]> {
  const result = await alchemyRpc<AssetTransfersResponse>(
    chainId,
    "alchemy_getAssetTransfers",
    [
      {
        ...filter,
        category: ["external", "erc20", "internal"],
        withMetadata: true,
        maxCount: "0x64",
        order: "desc",
      },
    ],
  );
  return result.transfers ?? [];
}

function lower(value?: string | null): string {
  return (value ?? "").toLowerCase();
}

function fetchErrorMessage(error: unknown): string {
  const raw =
    error instanceof Error ? error.message : "Unknown error while contacting Alchemy.";
  return raw.replace(/\/v2\/[^\s"'\\]+/g, "/v2/***");
}

/**
 * Fetch and normalize a wallet's transaction history via Alchemy.
 * Returns only real on-chain data — never synthetic fallbacks.
 */
export async function getWalletTransactions(
  address: Address,
  chainId: ChainId = 1,
): Promise<WalletFetchResult> {
  if (!features.onchain) {
    return {
      transactions: [],
      error: "ALCHEMY_API_KEY is not configured.",
    };
  }

  try {
    const [sent, received] = await Promise.all([
      fetchTransfers(chainId, { fromAddress: address }),
      fetchTransfers(chainId, { toAddress: address }),
    ]);

    return {
      transactions: groupTransfers([...sent, ...received], address, chainId),
    };
  } catch (error) {
    console.error(`[CryptoTaxKE] Alchemy fetch failed (${CHAIN_NAMES[chainId]}):`, error);
    return {
      transactions: [],
      error: fetchErrorMessage(error),
    };
  }
}

function groupTransfers(
  transfers: AlchemyTransfer[],
  address: Address,
  chainId: ChainId,
): NormalizedTransaction[] {
  const byHash = new Map<string, NormalizedTransaction>();
  const seen = new Set<string>();
  const addr = lower(address);

  for (const t of transfers) {
    const uid = t.uniqueId ?? t.hash;
    if (!t.hash || !uid || seen.has(uid)) continue;
    seen.add(uid);

    const timestamp = t.metadata?.blockTimestamp
      ? Date.parse(t.metadata.blockTimestamp)
      : Date.now();

    let tx = byHash.get(t.hash);
    if (!tx) {
      tx = {
        hash: t.hash,
        chainId,
        timestamp,
        blockNumber: t.blockNum ? parseInt(t.blockNum, 16) : 0,
        from: (t.from as Address) ?? address,
        to: (t.to as Address) ?? null,
        movements: [],
        gasFeeEth: 0,
      };
      byHash.set(t.hash, tx);
    }

    const amount = t.value ?? 0;
    if (!amount) continue;

    tx.movements.push({
      symbol: t.asset ?? "?",
      contract: (t.rawContract?.address as Address) ?? null,
      amount,
      decimals: t.rawContract?.decimal ? parseInt(t.rawContract.decimal, 16) : 18,
      direction: lower(t.to) === addr ? "in" : "out",
    });
  }

  return [...byHash.values()].sort((a, b) => b.timestamp - a.timestamp);
}
