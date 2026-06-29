"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import { Loader2, Search } from "lucide-react";
import type { ChainScope } from "@/types";
import { chainQueryParam } from "@/lib/chains";
import { Button } from "@/components/ui/Button";
import { ChainSelect } from "./ChainSelect";

const SAMPLE_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik.eth

export function WalletForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [chain, setChain] = useState<ChainScope>("all");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(address: string, chainScope: ChainScope = chain) {
    const trimmed = address.trim();
    if (!isAddress(trimmed)) {
      setError("That doesn't look like a valid Ethereum address.");
      return;
    }
    setError(null);
    startTransition(() => {
      router.push(
        `/dashboard/${trimmed}?chain=${chainQueryParam(chainScope)}`,
      );
    });
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0x..."
            spellCheck={false}
            disabled={isPending}
            className="h-12 flex-1 rounded-lg border border-line bg-surface px-4 font-mono text-sm text-foreground outline-none placeholder:text-muted focus:border-brand disabled:opacity-60"
          />
          <ChainSelect
            value={chain}
            onChange={setChain}
            disabled={isPending}
            className="sm:min-w-[11rem]"
          />
          <Button type="submit" size="lg" disabled={isPending} aria-busy={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </form>

      <p className="mt-2 text-xs text-muted">
        Supports Ethereum, Base, Polygon, Arbitrum, Optimism, BNB Chain, and Avalanche.
        Bitcoin and Binance exchange require separate import (see below).
      </p>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      {isPending && (
        <p className="mt-3 text-sm text-muted">
          Fetching transactions and running tax analysis — this can take a few
          seconds.
        </p>
      )}

      <button
        type="button"
        disabled={isPending}
        onClick={() => submit(SAMPLE_ADDRESS)}
        className="mt-4 text-sm text-muted underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
      >
        Or try a busy public wallet →
      </button>
    </div>
  );
}
