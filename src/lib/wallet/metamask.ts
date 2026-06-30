import { isAddress } from "viem";
import type { Address } from "@/types";

type EthereumProvider = NonNullable<Window["ethereum"]> & {
  isMetaMask?: boolean;
  isBraveWallet?: boolean;
  isCoinbaseWallet?: boolean;
};

function getProvider(): EthereumProvider | null {
  if (typeof window === "undefined" || !window.ethereum) return null;
  return window.ethereum as EthereumProvider;
}

/** True when a browser wallet injects the standard Ethereum provider (EIP-1193). */
export function hasBrowserWallet(): boolean {
  return Boolean(getProvider());
}

/** Human-readable wallet name when we can detect it. */
export function getBrowserWalletName(): string {
  const provider = getProvider();
  if (!provider) return "browser wallet";
  if (provider.isBraveWallet) return "Brave Wallet";
  if (provider.isCoinbaseWallet) return "Coinbase Wallet";
  if (provider.isMetaMask) return "MetaMask";
  return "browser wallet";
}

/**
 * Read-only: request the user's public address from their browser wallet.
 * Works with MetaMask, Brave Wallet, Coinbase Wallet, and other EIP-1193 wallets.
 */
export async function connectBrowserWalletAddress(): Promise<Address> {
  const provider = getProvider();
  if (!provider) {
    throw new Error(
      "No browser wallet found. Paste your 0x address below, or install MetaMask, Brave Wallet, or Coinbase Wallet.",
    );
  }

  const accounts = (await provider.request({
    method: "eth_requestAccounts",
  })) as string[];

  const address = accounts[0]?.trim();
  if (!address || !isAddress(address)) {
    throw new Error(`${getBrowserWalletName()} did not return a valid wallet address.`);
  }

  return address as Address;
}

/** @deprecated Use hasBrowserWallet */
export const hasMetaMask = hasBrowserWallet;

/** @deprecated Use connectBrowserWalletAddress */
export const connectMetaMaskAddress = connectBrowserWalletAddress;
