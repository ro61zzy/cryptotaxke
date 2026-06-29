"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ChainScope } from "@/types";
import { chainQueryParam } from "@/lib/chains";
import { ChainSelect } from "./ChainSelect";

export function ChainSwitcher({
  address,
  current,
}: {
  address: string;
  current: ChainScope;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted">Chain:</span>
      <ChainSelect
        value={current}
        disabled={isPending}
        onChange={(chain) => {
          startTransition(() => {
            router.push(
              `/dashboard/${address}?chain=${chainQueryParam(chain)}`,
            );
          });
        }}
        className="h-9 sm:w-48"
      />
    </div>
  );
}
