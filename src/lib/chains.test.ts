import { describe, it, expect } from "vitest";
import { chainQueryParam, chainScopeLabel, parseChainScope } from "./chains";

describe("parseChainScope", () => {
  it("returns all for empty or all", () => {
    expect(parseChainScope()).toBe("all");
    expect(parseChainScope("all")).toBe("all");
  });

  it("parses supported chain ids", () => {
    expect(parseChainScope("8453")).toBe(8453);
    expect(parseChainScope("137")).toBe(137);
  });

  it("falls back to Ethereum for unsupported ids", () => {
    expect(parseChainScope("42161")).toBe(1);
    expect(parseChainScope("not-a-number")).toBe(1);
  });
});

describe("chainScopeLabel", () => {
  it("labels all chains without listing every network", () => {
    expect(chainScopeLabel("all")).toBe("All chains");
  });

  it("labels a single chain by name", () => {
    expect(chainScopeLabel(8453)).toBe("Base");
  });
});

describe("chainQueryParam", () => {
  it("serializes scope for URL params", () => {
    expect(chainQueryParam("all")).toBe("all");
    expect(chainQueryParam(137)).toBe("137");
  });
});
