/**
 * Environment variables. On-chain import requires ALCHEMY_API_KEY.
 */
export const env = {
  alchemyApiKey: process.env.ALCHEMY_API_KEY ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
};

export const features = {
  /** Real on-chain ingestion requires an Alchemy API key. */
  onchain: Boolean(env.alchemyApiKey),
  /** AI explanations/chat require an OpenAI key (templates used without it). */
  ai: Boolean(env.openaiApiKey),
};
