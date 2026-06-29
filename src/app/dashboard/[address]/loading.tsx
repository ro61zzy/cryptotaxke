import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface-2 ${className ?? ""}`}
      aria-hidden
    />
  );
}

export default function WalletAnalysisLoading() {
  return (
    <Container className="py-12">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-7 w-48" />
      </div>

      <p className="mt-6 text-sm text-muted">
        Analyzing wallet: importing transactions, classifying, and calculating
        tax estimates…
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </Card>
        ))}
      </div>

      <Skeleton className="mt-10 h-6 w-32" />
      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-b border-line/60 px-4 py-4 last:border-0">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
        ))}
      </div>
    </Container>
  );
}
