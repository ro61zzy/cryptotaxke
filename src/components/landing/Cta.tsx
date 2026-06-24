import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Cta() {
  return (
    <section className="py-24">
      <Container>
        <div className="bg-grid rounded-2xl border border-line bg-surface p-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to make sense of your crypto taxes?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Analyze your first wallet in under a minute. No signup required to
            preview your transactions.
          </p>
          <Link href="/dashboard" className="mt-8 inline-block">
            <Button size="lg">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
