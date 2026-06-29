"use client";

import { Download } from "lucide-react";
import type { AnalyzedTransaction } from "@/lib/analysis";
import { CHAIN_NAMES } from "@/types";
import { Button } from "@/components/ui/Button";

function toCsvRow(values: string[]): string {
  return values
    .map((v) => `"${v.replace(/"/g, '""')}"`)
    .join(",");
}

function buildCsv(transactions: AnalyzedTransaction[]): string {
  const header = toCsvRow([
    "Date",
    "Chain",
    "Category",
    "Summary",
    "Taxable",
    "Hash",
  ]);

  const rows = transactions.map((tx) =>
    toCsvRow([
      new Date(tx.timestamp).toISOString().slice(0, 10),
      CHAIN_NAMES[tx.chainId],
      tx.classification.category,
      tx.explanation.summary,
      tx.explanation.taxable ? "yes" : "no",
      tx.hash,
    ]),
  );

  return [header, ...rows].join("\n");
}

export function ExportCsvButton({
  transactions,
}: {
  transactions: AnalyzedTransaction[];
}) {
  function download() {
    const csv = buildCsv(transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cryptotaxke-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button type="button" variant="secondary" size="sm" onClick={download}>
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
