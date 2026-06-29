import { describe, it, expect } from "vitest";
import { explainWithTemplate } from "./templates";
import type { Address, NormalizedTransaction } from "@/types";

const WALLET = "0x1111111111111111111111111111111111111111" as Address;

describe("explainWithTemplate", () => {
  it("describes a swap in plain English", () => {
    const tx: NormalizedTransaction = {
      hash: "0xabc",
      chainId: 1,
      timestamp: Date.now(),
      blockNumber: 1,
      from: WALLET,
      to: "0x2222222222222222222222222222222222222222" as Address,
      movements: [
        { symbol: "ETH", contract: null, amount: 0.2, decimals: 18, direction: "out" },
        { symbol: "USDC", contract: null, amount: 340, decimals: 6, direction: "in" },
      ],
      gasFeeEth: 0.001,
    };

    const result = explainWithTemplate(tx, {
      category: "trade",
      confidence: 0.85,
      source: "heuristic",
    });

    expect(result.summary).toContain("0.2 ETH");
    expect(result.summary).toContain("340 USDC");
    expect(result.taxable).toBe(true);
  });
});
