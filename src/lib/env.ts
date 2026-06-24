/**
 * Centralized, typed access to environment variables.
 *
 * Keys are optional so the app runs in a "demo mode" (sample data, no AI)
 * when they are absent — useful for local development, CI, and grading.
 */
export const env = {
  alchemyApiKey: process.env.ALCHEMY_API_KEY ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
};

export const features = {
  /** Real on-chain ingestion is available only with an Alchemy key. */
  onchain: Boolean(env.alchemyApiKey),
  /** AI explanations/chat are available only with an OpenAI key. */
  ai: Boolean(env.openaiApiKey),
};
