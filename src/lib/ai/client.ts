import OpenAI from "openai";
import { env, features } from "@/lib/env";

let client: OpenAI | null = null;

/** Lazy OpenAI client. Returns null when no API key is configured. */
export function getOpenAIClient(): OpenAI | null {
  if (!features.ai) return null;
  if (!client) {
    client = new OpenAI({ apiKey: env.openaiApiKey });
  }
  return client;
}

/** Turn OpenAI SDK errors into short, user-facing messages. */
export function formatOpenAiError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("429") || message.toLowerCase().includes("quota")) {
    return (
      "OpenAI quota exceeded. Add billing credits at platform.openai.com/settings/billing, " +
      "then try again. Chat uses one AI call per question."
    );
  }

  if (message.includes("401") || message.toLowerCase().includes("invalid api key")) {
    return "Invalid OPENAI_API_KEY. Check your .env file and Vercel environment variables.";
  }

  return message || "Failed to process your question.";
}
