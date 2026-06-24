import {
  Alchemy,
  Network,
  AssetTransfersCategory,
  SortingOrder,
  type AssetTransfersWithMetadataResult,
} from "alchemy-sdk";
import type {
  Address,
  ChainId,
  NormalizedTransaction,
} from "@/types";
import { env, features } from "@/lib/env";
import { sampleTransactions } from "./sample";

const NETWORK_BY_CHAIN: Record<ChainId, Network> = {
  1: Network.ETH_MAINNET,
  11155111: Network.ETH_SEPOLIA,
  8453: Network.BASE_MAINNET,
  42161: Network.ARB_MAINNET,
};

function client(chainId: ChainId) {
  return new Alchemy({
    apiKey: env.alchemyApiKey,
    network: NETWORK_BY_CHAIN[chainId],
  });
}

function lower(value?: string | null): string {
  return (value ?? "").toLowerCase();
}

/**
 * Fetch and normalize a wallet's transaction history.
 *
 * Falls back to sample data when no Alchemy key is configured, so the
 * app remains demoable and testable without external credentials.
 */
export async function getWalletTransactions(
  address: Address,
  chainId: ChainId = 1,
): Promise<NormalizedTransaction[]> {
  if (!features.onchain) {
    return sampleTransactions(address);
  }

  const alchemy = client(chainId);
  const category = [
    AssetTransfersCategory.EXTERNAL,
    AssetTransfersCategory.ERC20,
    AssetTransfersCategory.INTERNAL,
  ];
  const base = {
    category,
    withMetadata: true as const,
    maxCount: 100,
    order: SortingOrder.DESCENDING,
  };

  const [sent, received] = await Promise.all([
    alchemy.core.getAssetTransfers({ ...base, fromAddress: address }),
    alchemy.core.getAssetTransfers({ ...base, toAddress: address }),
  ]);

  return groupTransfers(
    [...sent.transfers, ...received.transfers],
    address,
    chainId,
  );
}

/** Group flat transfer rows into per-hash normalized transactions. */
function groupTransfers(
  transfers: AssetTransfersWithMetadataResult[],
  address: Address,
  chainId: ChainId,
): NormalizedTransaction[] {
  const byHash = new Map<string, NormalizedTransaction>();
  const seen = new Set<string>();
  const addr = lower(address);

  for (const t of transfers) {
    if (!t.hash || seen.has(t.uniqueId)) continue;
    seen.add(t.uniqueId);

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
