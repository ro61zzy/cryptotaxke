import { describe, it, expect, vi } from "vitest";
import { formatCitations, retrieveKnowledge } from "./search";

vi.mock("@/lib/ai/client", () => ({
  getOpenAIClient: vi.fn(() => null),
}));

describe("retrieveKnowledge", () => {
  it("finds Kenyan tax chunks by keyword when embeddings are unavailable", async () => {
    const chunks = await retrieveKnowledge("realized gains income tax Kenya", 2);

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.some((c) => c.text.toLowerCase().includes("income"))).toBe(true);
  });

  it("returns staking guidance for staking queries", async () => {
    const chunks = await retrieveKnowledge("staking rewards taxable", 2);

    expect(chunks.some((c) => c.id === "income-staking")).toBe(true);
  });
});

describe("formatCitations", () => {
  it("formats chunks for the chat prompt", async () => {
    const chunks = await retrieveKnowledge("FIFO record keeping", 1);
    const formatted = formatCitations(chunks);

    expect(formatted).toContain("[");
    expect(formatted).toContain(chunks[0].text);
  });
});
