import { describe, it, expect } from "vitest";
import { classifyHeuristic } from "./heuristics";
import type { Address, NormalizedTransaction } from "@/types";

const WALLET = "0x1111111111111111111111111111111111111111" as Address;
const OTHER = "0x2222222222222222222222222222222222222222" as Address;

function makeTx(
  overrides: Partial<NormalizedTransaction>,
): NormalizedTransaction {
  return {
    hash: "0xabc",
    chainId: 1,
    timestamp: Date.now(),
    blockNumber: 1,
    from: OTHER,
    to: WALLET,
    movements: [],
    gasFeeEth: 0,
    ...overrides,
  };
}

describe("classifyHeuristic", () => {
  it("labels a swap as a trade", () => {
    const tx = makeTx({
      from: WALLET,
      to: OTHER,
      movements: [
        { symbol: "ETH", contract: null, amount: 0.2, decimals: 18, direction: "out" },
        { symbol: "USDC", contract: OTHER, amount: 340, decimals: 6, direction: "in" },
      ],
    });
    const result = classifyHeuristic(tx, WALLET);
    expect(result.category).toBe("trade");
    expect(result.source).toBe("heuristic");
  });

  it("labels an inbound-only transfer as transfer_in", () => {
    const tx = makeTx({
      movements: [
        { symbol: "USDC", contract: OTHER, amount: 1500, decimals: 6, direction: "in" },
      ],
    });
    expect(classifyHeuristic(tx, WALLET).category).toBe("transfer_in");
  });

  it("labels an outbound-only transfer as transfer_out", () => {
    const tx = makeTx({
      from: WALLET,
      to: OTHER,
      movements: [
        { symbol: "USDC", contract: OTHER, amount: 500, decimals: 6, direction: "out" },
      ],
    });
    expect(classifyHeuristic(tx, WALLET).category).toBe("transfer_out");
  });

  it("labels self-sends as internal transfers", () => {
    const tx = makeTx({
      from: WALLET,
      to: WALLET,
      movements: [
        { symbol: "ETH", contract: null, amount: 1, decimals: 18, direction: "out" },
      ],
    });
    expect(classifyHeuristic(tx, WALLET).category).toBe("internal_transfer");
  });

  it("falls back to contract_interaction with no movements", () => {
    const tx = makeTx({ from: WALLET, to: OTHER, movements: [] });
    expect(classifyHeuristic(tx, WALLET).category).toBe("contract_interaction");
  });
});
