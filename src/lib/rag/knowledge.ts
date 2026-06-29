/**
 * Curated Kenyan crypto tax knowledge for RAG retrieval.
 * Sources: Finance Act 2025, KRA guidance, OECD CARF context (2026).
 * Each chunk includes a citation the model must reference.
 */
export interface KnowledgeChunk {
  id: string;
  title: string;
  citation: string;
  text: string;
}

export const KENYA_TAX_KNOWLEDGE: KnowledgeChunk[] = [
  {
    id: "dat-repeal",
    title: "Digital Asset Tax repeal",
    citation: "Finance Act 2025: repeal of 3% Digital Asset Tax",
    text:
      "Kenya repealed the 3% Digital Asset Tax (DAT) in July 2025. Crypto transactions are no longer taxed at 3% of gross transaction value under DAT.",
  },
  {
    id: "excise-vasp",
    title: "Excise duty on VASP fees",
    citation: "Finance Act 2025: 10% excise on VASP fees",
    text:
      "From July 2025, a 10% excise duty applies to fees and commissions charged by Virtual Asset Service Providers (VASPs) to users, not to the full trade amount.",
  },
  {
    id: "income-trading",
    title: "Trading income",
    citation: "KRA: income tax on crypto trading profits",
    text:
      "Profits from trading or disposing of crypto are generally subject to Kenyan income tax at progressive individual rates (approximately 10%–35%). Losses may offset gains depending on circumstances and record-keeping.",
  },
  {
    id: "income-staking",
    title: "Staking and mining income",
    citation: "KRA: staking/mining as income",
    text:
      "Staking rewards, mining income, and many airdrops are typically treated as taxable income at fair market value when received, taxed at progressive income tax rates.",
  },
  {
    id: "transfers",
    title: "Transfers vs trades",
    citation: "CryptoTaxKE classification guidance",
    text:
      "Moving crypto between your own wallets is usually not a taxable event. Swapping one token for another is typically a taxable disposal of the asset sent. Receiving unsolicited spam tokens with no value should not be treated as meaningful income.",
  },
  {
    id: "record-keeping",
    title: "Record keeping",
    citation: "Tax Procedures Act: taxpayer obligations",
    text:
      "Taxpayers should keep records of acquisition date, disposal date, amounts, and KES value at each event. FIFO is a common cost-basis method when specific lot identification is unavailable.",
  },
  {
    id: "carf-2026",
    title: "Exchange reporting (CARF)",
    citation: "Finance Bill 2026 / OECD CARF",
    text:
      "From 2026, Kenya aligns with global crypto reporting standards. VASPs may report customer activity to KRA. Individual self-assessment and accurate reporting remain the taxpayer's responsibility.",
  },
  {
    id: "p2p-binance",
    title: "Exchange and P2P trades",
    citation: "CryptoTaxKE: off-chain import",
    text:
      "Trades on Binance, P2P, or other centralised exchanges are off-chain until withdrawn on-chain. They should be imported from exchange CSV exports; wallet-only analysis will not capture them.",
  },
  {
    id: "disclaimer",
    title: "Estimates vs advice",
    citation: "CryptoTaxKE disclaimer",
    text:
      "Automated tax estimates are educational. Always confirm with a qualified tax professional or the Kenya Revenue Authority before filing.",
  },
];
