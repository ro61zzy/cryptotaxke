import { isAddress } from "viem";
import type { Address } from "@/types";

export function hasMetaMask(): boolean {
  return typeof window !== "undefined" && Boolean(window.ethereum);
}

/**
 * Read-only: request the user's public address from MetaMask.
 * Does not request transaction signatures.
 */
export async function connectMetaMaskAddress(): Promise<Address> {
  if (!hasMetaMask() || !window.ethereum) {
    throw new Error(
      "MetaMask is not installed. Paste your 0x address manually, or install MetaMask at metamask.io.",
    );
  }

  const accounts = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];

  const address = accounts[0]?.trim();
  if (!address || !isAddress(address)) {
    throw new Error("MetaMask did not return a valid wallet address.");
  }

  return address as Address;
}
