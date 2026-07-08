import { z } from "zod";
import { isAddress } from "viem";
import { NextResponse } from "next/server";
import { analyzeWallet } from "@/lib/analysis";
import { parseChainScope } from "@/lib/chains";
import { getChatModel, getOpenAIClient, formatOpenAiError } from "@/lib/ai/client";
import { retrieveKnowledge, formatCitations } from "@/lib/rag/search";
import { formatKES } from "@/lib/utils";
import type { Address, ChainScope } from "@/types";

export const maxDuration = 60;

const bodySchema = z.object({
  address: z.string(),
  chain: z.string().optional(),
  question: z.string().min(1).max(500),
});

function buildWalletContext(
  analysis: Awaited<ReturnType<typeof analyzeWallet>>,
): string {
  const { taxSummary, portfolioValueKES, transactions } = analysis;
  const recent = transactions.slice(0, 8).map((tx) => ({
    date: new Date(tx.timestamp).toISOString().slice(0, 10),
    category: tx.classification.category,
    summary: tx.explanation.summary,
    taxable: tx.explanation.taxable,
  }));

  return JSON.stringify({
    portfolioValueKES: formatKES(portfolioValueKES),
    realizedGainsKES: formatKES(taxSummary.realizedGainsKES),
    stakingIncomeKES: formatKES(taxSummary.stakingIncomeKES),
    estimatedTaxKES: formatKES(taxSummary.estimatedTaxKES),
    transactionCount: transactions.length,
    recentTransactions: recent,
    ruleset: taxSummary.rulesetVersion,
  });
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { address, chain, question } = bodySchema.parse(json);

    if (!isAddress(address)) {
      return NextResponse.json({ error: "Invalid wallet address." }, { status: 400 });
    }

    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json(
        {
          error:
            "No AI provider configured. Add GROQ_API_KEY (free at console.groq.com) or OPENAI_API_KEY to .env and Vercel.",
        },
        { status: 503 },
      );
    }

    const chainScope: ChainScope = parseChainScope(chain);
    const analysis = await analyzeWallet(address as Address, chainScope, {
      lightweight: true,
    });

    if (analysis.transactions.length === 0) {
      return NextResponse.json({
        answer:
          analysis.emptyMessage ??
          "No transactions found for this wallet. Import on-chain activity or add exchange CSV data before asking tax questions.",
        citations: [],
      });
    }

    const knowledge = await retrieveKnowledge(question, 3);
    const citations = knowledge.map((k) => k.citation);
    const walletContext = buildWalletContext(analysis);

    const response = await openai.chat.completions.create({
      model: getChatModel(),
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are CryptoTaxKE, a Kenyan crypto tax assistant. Answer using ONLY the wallet data and cited tax knowledge provided. " +
            "Be concise, plain English, amounts in KES. If unsure, say so. Never invent transactions. " +
            "End with a short Sources line listing citations used.",
        },
        {
          role: "user",
          content: `Wallet data:\n${walletContext}\n\nTax knowledge:\n${formatCitations(knowledge)}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer =
      response.choices[0]?.message?.content ??
      "I could not generate an answer. Please try again.";

    return NextResponse.json({ answer, citations });
  } catch (error) {
    console.error("[CryptoTaxKE] chat error:", error);
    return NextResponse.json({ error: formatOpenAiError(error) }, { status: 500 });
  }
}
