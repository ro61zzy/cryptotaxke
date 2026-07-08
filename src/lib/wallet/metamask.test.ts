import { describe, it, expect, vi, afterEach } from "vitest";
import {
  connectBrowserWalletAddress,
  getBrowserWalletName,
  hasBrowserWallet,
} from "./metamask";

const VALID = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

describe("browser wallet helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reports no wallet when ethereum provider is missing", () => {
    vi.stubGlobal("window", { ethereum: undefined });
    expect(hasBrowserWallet()).toBe(false);
    expect(getBrowserWalletName()).toBe("browser wallet");
  });

  it("detects MetaMask by provider flags", () => {
    vi.stubGlobal("window", {
      ethereum: { isMetaMask: true, request: vi.fn() },
    });
    expect(hasBrowserWallet()).toBe(true);
    expect(getBrowserWalletName()).toBe("MetaMask");
  });

  it("detects Brave Wallet by provider flags", () => {
    vi.stubGlobal("window", {
      ethereum: { isBraveWallet: true, request: vi.fn() },
    });
    expect(getBrowserWalletName()).toBe("Brave Wallet");
  });

  it("connects and returns a validated address", async () => {
    const request = vi.fn().mockResolvedValue([VALID]);
    vi.stubGlobal("window", {
      ethereum: { isMetaMask: true, request },
    });

    await expect(connectBrowserWalletAddress()).resolves.toBe(VALID);
    expect(request).toHaveBeenCalledWith({ method: "eth_requestAccounts" });
  });

  it("throws when no provider is available", async () => {
    vi.stubGlobal("window", { ethereum: undefined });

    await expect(connectBrowserWalletAddress()).rejects.toThrow(
      /No browser wallet found/,
    );
  });
});
