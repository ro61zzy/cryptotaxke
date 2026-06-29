import {
  Wallet,
  MessagesSquare,
  Calculator,
  Tags,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

const features = [
  {
    icon: Wallet,
    title: "Automatic import",
    body: "Connect MetaMask or paste a 0x address to pull in swaps, transfers, staking rewards and more.",
  },
  {
    icon: MessagesSquare,
    title: "Plain-English explanations",
    body: "Instead of 0xAF12 → 0xE9D4, see 'You swapped 0.2 ETH for 340 USDC.'",
  },
  {
    icon: Tags,
    title: "Smart classification",
    body: "Transactions are labeled (trade, transfer, staking, airdrop) using rules plus AI.",
  },
  {
    icon: Calculator,
    title: "Gains & tax estimates",
    body: "FIFO cost-basis accounting in KES, with a tax estimate under current KRA rules.",
  },
  {
    icon: MessagesSquare,
    title: "Ask anything",
    body: "Chat with your data: 'How much profit did I make this year? Which transactions are taxable?'",
  },
  {
    icon: ShieldCheck,
    title: "Grounded answers",
    body: "Tax answers cite Kenyan regulations and KRA guidance, so you know where they come from.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to file with confidence
          </h2>
          <p className="mt-4 text-muted">
            Existing tools are built for the US and EU, are expensive, and never
            explain anything. CryptoTaxKE is different.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft">
                <feature.icon className="h-5 w-5 text-brand" />
              </span>
              <h3 className="mt-4 text-lg font-medium">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted">{feature.body}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
