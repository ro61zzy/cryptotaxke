import { Container } from "@/components/ui/Container";

const steps = [
  {
    step: "01",
    title: "Connect or paste",
    body: "Connect a browser wallet to fill your address automatically, or paste a 0x address. Read-only: no private keys, ever.",
  },
  {
    step: "02",
    title: "Import & explain",
    body: "We fetch your transaction history, decode each one, and translate it into a sentence you can understand.",
  },
  {
    step: "03",
    title: "Calculate",
    body: "A FIFO cost-basis engine values everything in KES and produces capital gains and staking income figures.",
  },
  {
    step: "04",
    title: "Estimate & ask",
    body: "Get a tax estimate under current KRA rules, then chat with your data to dig into the details.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-line/70 py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            From wallet to tax estimate in four steps
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <div key={item.step}>
              <span className="font-mono text-sm font-semibold text-brand">
                {item.step}
              </span>
              <h3 className="mt-3 text-lg font-medium">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
