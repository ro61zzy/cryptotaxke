import { Container } from "@/components/ui/Container";
import { WalletForm } from "@/components/dashboard/WalletForm";

export default function DashboardPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Analyze a wallet</h1>
        <p className="mt-3 text-muted">
          Connect a browser wallet or paste a <code className="text-foreground">0x…</code>{" "}
          address to import real on-chain transactions. Read-only: we never ask for
          private keys or signatures.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <WalletForm />
      </div>
    </Container>
  );
}
