import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-line/70 py-8 text-sm text-muted">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p>© {new Date().getFullYear()} CryptoTaxKE</p>
        <p className="max-w-md text-center text-xs sm:text-right">
          Estimates are for educational purposes only and are not tax advice.
          Always confirm with a qualified tax professional or the KRA.
        </p>
      </Container>
    </footer>
  );
}
