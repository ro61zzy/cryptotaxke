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
