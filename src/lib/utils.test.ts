import { describe, it, expect } from "vitest";
import { formatKES, formatToken, shortAddress } from "./utils";

describe("shortAddress", () => {
  it("shortens long addresses for display", () => {
    const addr = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    expect(shortAddress(addr)).toBe("0xd8dA…6045");
  });

  it("returns short addresses unchanged", () => {
    expect(shortAddress("0x1234")).toBe("0x1234");
  });
});

describe("formatKES", () => {
  it("formats Kenyan Shillings without decimals", () => {
    expect(formatKES(12500)).toMatch(/12,?500/);
    expect(formatKES(12500)).toContain("Ksh");
  });
});

describe("formatToken", () => {
  it("includes the token symbol when provided", () => {
    expect(formatToken(0.5, "ETH")).toBe("0.5 ETH");
  });

  it("uses higher precision for small amounts", () => {
    expect(formatToken(0.000981, "ETH")).toContain("0.000981");
  });
});
