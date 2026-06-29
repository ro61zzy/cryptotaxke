import type { ChainId, ChainScope } from "@/types";
import { CHAIN_NAMES, SUPPORTED_CHAINS } from "@/types";

export function parseChainScope(value?: string): ChainScope {
  if (!value || value === "all") return "all";
  const id = Number(value);
  if (SUPPORTED_CHAINS.includes(id as ChainId)) return id as ChainId;
  return 1;
}

export function chainScopeLabel(scope: ChainScope): string {
  if (scope === "all") return "All chains";
  return CHAIN_NAMES[scope];
}

export function chainQueryParam(scope: ChainScope): string {
  return scope === "all" ? "all" : String(scope);
}
