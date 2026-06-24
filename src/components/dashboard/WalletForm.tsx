"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

const SAMPLE_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik.eth

export function WalletForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(address: string) {
    const trimmed = address.trim();
    if (!isAddress(trimmed)) {
      setError("That doesn't look like a valid Ethereum address.");
      return;
    }
    setError(null);
    router.push(`/dashboard/${trimmed}`);
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0x..."
          spellCheck={false}
          className="h-12 flex-1 rounded-lg border border-line bg-surface px-4 font-mono text-sm text-foreground outline-none placeholder:text-muted focus:border-brand"
        />
        <Button type="submit" size="lg">
          <Search className="h-4 w-4" />
          Analyze
        </Button>
      </form>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      <button
        type="button"
        onClick={() => submit(SAMPLE_ADDRESS)}
        className="mt-4 text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
      >
        Or try a sample wallet →
      </button>
    </div>
  );
}
