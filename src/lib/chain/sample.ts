import type { Address, NormalizedTransaction } from "@/types";

/**
 * A realistic sample transaction history used when no Alchemy key is
 * configured. Covers the main categories the app must handle: a swap,
 * an inbound transfer, a staking reward, and an outbound transfer.
 */
export function sampleTransactions(address: Address): NormalizedTransaction[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return [
    {
      hash: "0xa1f0c3d4e5b6a7980011223344556677889900aabbccddeeff0011223344aa01",
      chainId: 1,
      timestamp: now - 90 * day,
      blockNumber: 19000000,
      from: address,
      to: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      movements: [
        { symbol: "ETH", contract: null, amount: 0.2, decimals: 18, direction: "out" },
        {
          symbol: "USDC",
          contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          amount: 340,
          decimals: 6,
          direction: "in",
        },
      ],
      gasFeeEth: 0.0021,
      methodId: "0x38ed1739",
    },
    {
      hash: "0xb2e1d4c5f6a7b8990022334455667788990011bbccddeeff00112233445bb02",
      chainId: 1,
      timestamp: now - 60 * day,
      blockNumber: 19200000,
      from: "0x28C6c06298d514Db089934071355E5743bf21d60",
      to: address,
      movements: [
        {
          symbol: "USDC",
          contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          amount: 1500,
          decimals: 6,
          direction: "in",
        },
      ],
      gasFeeEth: 0,
    },
    {
      hash: "0xc3d2e5f6a7b8c9aa0033445566778899001122ccddeeff0011223344556cc03",
      chainId: 1,
      timestamp: now - 30 * day,
      blockNumber: 19400000,
      from: "0x00000000219ab540356cBB839Cbe05303d7705Fa",
      to: address,
      movements: [
        { symbol: "ETH", contract: null, amount: 0.05, decimals: 18, direction: "in" },
      ],
      gasFeeEth: 0,
    },
    {
      hash: "0xd4e3f6a7b8c9aabb0044556677889900112233ddeeff00112233445566dd04",
      chainId: 1,
      timestamp: now - 10 * day,
      blockNumber: 19600000,
      from: address,
      to: "0x9bf1D7D63dD7a4ce167CF4866388226EEefa702E",
      movements: [
        {
          symbol: "USDC",
          contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          amount: 500,
          decimals: 6,
          direction: "out",
        },
      ],
      gasFeeEth: 0.0014,
    },
  ];
}
