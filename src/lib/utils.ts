import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shorten an EVM address for display, e.g. 0x1234…abcd. */
export function shortAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

/** Format a number as Kenyan Shillings. */
export function formatKES(value: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format a token amount with sensible precision. */
export function formatToken(value: number, symbol?: string): string {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value < 1 ? 6 : 4,
  }).format(value);
  return symbol ? `${formatted} ${symbol}` : formatted;
}
