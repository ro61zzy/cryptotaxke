"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import { Loader2, Search, Wallet } from "lucide-react";
import type { ChainScope } from "@/types";
import { chainQueryParam } from "@/lib/chains";
import {
  connectBrowserWalletAddress,
  getBrowserWalletName,
  hasBrowserWallet,
} from "@/lib/wallet/metamask";
import { Button } from "@/components/ui/Button";
import { ChainSelect } from "./ChainSelect";

const SAMPLE_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik.eth

const WALLET_INSTALL_LINKS = [
  { name: "MetaMask", href: "https://metamask.io/download/" },
  { name: "Brave Wallet", href: "https://brave.com/wallet/" },
  { name: "Coinbase Wallet", href: "https://www.coinbase.com/wallet/downloads" },
] as const;

export function WalletForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [chain, setChain] = useState<ChainScope>("all");
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const walletAvailable = useSyncExternalStore(
    () => () => {},
    () => hasBrowserWallet(),
    () => false,
  );
  const walletName = useSyncExternalStore(
    () => () => {},
    () => getBrowserWalletName(),
    () => "browser wallet",
  );

  const busy = isPending || connecting;

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

  async function connectAndAnalyze() {
    setError(null);
    setConnecting(true);
    try {
      const address = await connectBrowserWalletAddress();
      setValue(address);
      submit(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect wallet.");
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div>
      {walletAvailable ? (
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={busy}
          onClick={connectAndAnalyze}
        >
          {connecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting…
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              Connect {walletName}
            </>
          )}
        </Button>
      ) : (
        <div className="rounded-lg border border-line bg-surface-2 p-4 text-sm">
          <p className="font-medium text-foreground">No browser wallet detected</p>
          <p className="mt-2 text-muted">
            You can still paste any <code className="text-foreground">0x…</code> address
            below. To connect with one click, install a browser wallet such as{" "}
            {WALLET_INSTALL_LINKS.map((wallet, index) => (
              <span key={wallet.name}>
                {index > 0 && (index === WALLET_INSTALL_LINKS.length - 1 ? ", or " : ", ")}
                <a
                  href={wallet.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  {wallet.name}
                </a>
              </span>
            ))}
            , then refresh this page.
          </p>
          <p className="mt-2 text-xs text-muted">
            Using Brave? Enable the built-in wallet under Settings → Web3.
          </p>
        </div>
      )}

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-line" />
        </div>
        <p className="relative mx-auto w-fit bg-background px-3 text-xs text-muted">
          {walletAvailable ? "or paste an address" : "paste an address"}
        </p>
      </div>

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
            disabled={busy}
            className="h-12 flex-1 rounded-lg border border-line bg-surface px-4 font-mono text-sm text-foreground outline-none placeholder:text-muted focus:border-brand disabled:opacity-60"
          />
          <ChainSelect
            value={chain}
            onChange={setChain}
            disabled={busy}
            className="sm:min-w-[11rem]"
          />
          <Button type="submit" size="lg" disabled={busy} aria-busy={isPending}>
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
        Read-only: we only fetch public on-chain data. No private keys, no
        signatures. Supports Ethereum, Base, Polygon, and BNB Chain.
      </p>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      {isPending && (
        <p className="mt-3 text-sm text-muted">
          Fetching transactions and running tax analysis. This can take a few
          seconds.
        </p>
      )}

      <button
        type="button"
        disabled={busy}
        onClick={() => submit(SAMPLE_ADDRESS)}
        className="mt-4 text-sm text-muted underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
      >
        Or try a busy public wallet →
      </button>
    </div>
  );
}
