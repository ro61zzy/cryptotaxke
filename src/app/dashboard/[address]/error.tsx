"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[CryptoTaxKE] dashboard error:", error);
  }, [error]);

  return (
    <Container className="py-16 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
        We could not analyze this wallet. This is often caused by an invalid API
        key or a temporary network issue. Check your <code>.env</code> file and
        try again.
      </p>
      <p className="mx-auto mt-2 max-w-xl font-mono text-xs text-danger">
        {error.message}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/dashboard">
          <Button variant="outline">Back to dashboard</Button>
        </Link>
      </div>
    </Container>
  );
}
