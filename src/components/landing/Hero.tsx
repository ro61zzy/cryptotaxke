import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="bg-grid">
      <Container className="flex flex-col items-center py-24 text-center sm:py-32">
        <Badge tone="brand" className="mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          Built for Kenyan crypto users
        </Badge>

        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Understand your crypto taxes,{" "}
          <span className="text-brand">in plain English.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted">
          Connect a browser wallet or paste a wallet address, and CryptoTaxKE imports your
          transactions, explains each one, calculates your gains in KES, and
          estimates your tax under current KRA rules, with answers you can actually
          understand.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard">
            <Button size="lg">
              Analyze a wallet
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/#how-it-works">
            <Button size="lg" variant="outline">
              See how it works
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
