import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Address, ClassificationResult, NormalizedTransaction } from "@/types";
import { classifyWithAi, needsAiClassification } from "./ai";

vi.mock("@/lib/ai/client", () => ({
  getOpenAIClient: vi.fn(() => null),
}));

const WALLET = "0x1111111111111111111111111111111111111111" as Address;

const tx: NormalizedTransaction = {
  hash: "0xabc",
  chainId: 1,
  timestamp: Date.now(),
  blockNumber: 1,
  from: WALLET,
  to: null,
  movements: [],
  gasFeeEth: 0,
};

describe("needsAiClassification", () => {
  it("skips AI when heuristic confidence is high", () => {
    const result: ClassificationResult = {
      category: "transfer_in",
      confidence: 0.75,
      source: "heuristic",
    };
    expect(needsAiClassification(result)).toBe(false);
  });

  it("escalates low-confidence heuristics", () => {
    const result: ClassificationResult = {
      category: "contract_interaction",
      confidence: 0.4,
      source: "heuristic",
    };
    expect(needsAiClassification(result)).toBe(true);
  });
});

describe("classifyWithAi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns heuristic unchanged when confidence is high", async () => {
    const heuristic: ClassificationResult = {
      category: "trade",
      confidence: 0.85,
      source: "heuristic",
      reasoning: "Swap detected",
    };

    const result = await classifyWithAi(tx, WALLET, heuristic);
    expect(result).toEqual(heuristic);
  });

  it("returns heuristic when OpenAI is not configured", async () => {
    const heuristic: ClassificationResult = {
      category: "contract_interaction",
      confidence: 0.4,
      source: "heuristic",
    };

    const result = await classifyWithAi(tx, WALLET, heuristic);
    expect(result).toEqual(heuristic);
  });
});
