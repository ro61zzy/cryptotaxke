/**
 * Environment variables. On-chain import requires ALCHEMY_API_KEY.
 */
export const env = {
  alchemyApiKey: process.env.ALCHEMY_API_KEY ?? "",
  groqApiKey: process.env.GROQ_API_KEY ?? "",
  deepseekApiKey: process.env.DEEPSEEK_API_KEY ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  aiModel: process.env.AI_MODEL ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
};

export const features = {
  /** Real on-chain ingestion requires an Alchemy API key. */
  onchain: Boolean(env.alchemyApiKey),
  /** AI chat/classify uses Groq, DeepSeek, or OpenAI when a key is set. */
  ai: Boolean(env.groqApiKey || env.deepseekApiKey || env.openaiApiKey),
};
