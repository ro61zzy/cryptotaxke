import OpenAI from "openai";
import { getOpenAIClient } from "@/lib/ai/client";
import { KENYA_TAX_KNOWLEDGE, type KnowledgeChunk } from "./knowledge";

interface ScoredChunk extends KnowledgeChunk {
  score: number;
}

let embeddingCache: Map<string, number[]> | null = null;

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

async function embedTexts(openai: OpenAI, texts: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

async function ensureEmbeddings(): Promise<Map<string, number[]>> {
  if (embeddingCache) return embeddingCache;

  const openai = getOpenAIClient();
  if (!openai) {
    embeddingCache = new Map();
    return embeddingCache;
  }

  const vectors = await embedTexts(
    openai,
    KENYA_TAX_KNOWLEDGE.map((c) => `${c.title}. ${c.text}`),
  );

  embeddingCache = new Map(
    KENYA_TAX_KNOWLEDGE.map((chunk, i) => [chunk.id, vectors[i]]),
  );
  return embeddingCache;
}

/** Keyword fallback when OpenAI embeddings are unavailable. */
function keywordSearch(query: string, limit = 3): KnowledgeChunk[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = KENYA_TAX_KNOWLEDGE.map((chunk) => {
    const hay = `${chunk.title} ${chunk.text} ${chunk.citation}`.toLowerCase();
    const score = terms.reduce((s, t) => (hay.includes(t) ? s + 1 : s), 0);
    return { chunk, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.chunk);
}

/** Retrieve the most relevant Kenyan tax knowledge chunks for a query. */
export async function retrieveKnowledge(
  query: string,
  limit = 3,
): Promise<KnowledgeChunk[]> {
  const openai = getOpenAIClient();
  if (!openai) return keywordSearch(query, limit);

  try {
    const cache = await ensureEmbeddings();
    const [queryVec] = await embedTexts(openai, [query]);

    const scored: ScoredChunk[] = KENYA_TAX_KNOWLEDGE.map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryVec, cache.get(chunk.id) ?? []),
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter((c) => c.score > 0.2);
  } catch {
    return keywordSearch(query, limit);
  }
}

export function formatCitations(chunks: KnowledgeChunk[]): string {
  return chunks.map((c) => `[${c.citation}] ${c.text}`).join("\n\n");
}
