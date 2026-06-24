import type { TxCategory } from "@/types";

type BadgeTone = "neutral" | "brand" | "danger" | "warning" | "positive";

interface CategoryMeta {
  label: string;
  tone: BadgeTone;
  /** Whether this category is generally a taxable event in Kenya. */
  taxable: boolean;
}

export const CATEGORY_META: Record<TxCategory, CategoryMeta> = {
  trade: { label: "Trade", tone: "brand", taxable: true },
  transfer_in: { label: "Transfer in", tone: "neutral", taxable: false },
  transfer_out: { label: "Transfer out", tone: "neutral", taxable: false },
  internal_transfer: { label: "Internal", tone: "neutral", taxable: false },
  staking_reward: { label: "Staking reward", tone: "positive", taxable: true },
  airdrop: { label: "Airdrop", tone: "positive", taxable: true },
  liquidity: { label: "Liquidity", tone: "warning", taxable: true },
  nft: { label: "NFT", tone: "warning", taxable: true },
  fee: { label: "Fee", tone: "neutral", taxable: false },
  contract_interaction: { label: "Contract", tone: "neutral", taxable: false },
  unknown: { label: "Unknown", tone: "neutral", taxable: false },
};
