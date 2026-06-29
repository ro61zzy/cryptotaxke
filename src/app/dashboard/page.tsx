import { Container } from "@/components/ui/Container";
import { DataSourcesNote } from "@/components/dashboard/DataSourcesNote";
import { WalletForm } from "@/components/dashboard/WalletForm";

export default function DashboardPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Analyze a wallet</h1>
        <p className="mt-3 text-muted">
          Paste a <code className="text-foreground">0x…</code> address to import real
          on-chain transactions across popular EVM chains. We only read public data.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-8">
        <WalletForm />
        <DataSourcesNote />
      </div>
    </Container>
  );
}
