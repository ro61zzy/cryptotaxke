import OpenAI from "openai";
import { env, features } from "@/lib/env";

export type AiProvider = "groq" | "deepseek" | "openai";

let client: OpenAI | null = null;

const PROVIDER_DEFAULTS: Record<AiProvider, { baseURL?: string; model: string }> = {
  groq: {
    baseURL: "https://api.groq.com/openai/v1",
    model: "llama-3.3-70b-versatile",
  },
  deepseek: {
    baseURL: "https://api.deepseek.com",
    model: "deepseek-chat",
  },
  openai: {
    model: "gpt-4o-mini",
  },
};

/** Which AI backend is configured (Groq is checked first as the free default). */
export function getAiProvider(): AiProvider | null {
  if (env.groqApiKey) return "groq";
  if (env.deepseekApiKey) return "deepseek";
  if (env.openaiApiKey) return "openai";
  return null;
}

/** Chat model for the active provider. Override with AI_MODEL in .env. */
export function getChatModel(): string {
  const provider = getAiProvider();
  if (env.aiModel) return env.aiModel;
  return provider ? PROVIDER_DEFAULTS[provider].model : "gpt-4o-mini";
}

/**
 * OpenAI-compatible client for chat completions.
 * Works with OpenAI, Groq (free tier), or DeepSeek via the same SDK.
 */
export function getOpenAIClient(): OpenAI | null {
  if (!features.ai) return null;

  const provider = getAiProvider();
  if (!provider) return null;

  if (!client) {
    const defaults = PROVIDER_DEFAULTS[provider];
    const apiKey =
      provider === "groq"
        ? env.groqApiKey
        : provider === "deepseek"
          ? env.deepseekApiKey
          : env.openaiApiKey;

    client = new OpenAI({
      apiKey,
      ...(defaults.baseURL ? { baseURL: defaults.baseURL } : {}),
    });
  }

  return client;
}

/** Reset client between tests or provider changes. */
export function resetAiClient(): void {
  client = null;
}

/** Turn AI SDK errors into short, user-facing messages. */
export function formatOpenAiError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("429") || message.toLowerCase().includes("quota")) {
    return (
      "AI quota exceeded for your provider. Try Groq (free at console.groq.com) " +
      "or add billing credits to your current provider, then try again."
    );
  }

  if (message.includes("401") || message.toLowerCase().includes("invalid api key")) {
    return "Invalid AI API key. Check GROQ_API_KEY, DEEPSEEK_API_KEY, or OPENAI_API_KEY in .env and Vercel.";
  }

  return message || "Failed to process your question.";
}
