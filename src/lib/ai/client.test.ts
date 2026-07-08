import { describe, it, expect } from "vitest";
import { formatOpenAiError } from "./client";

describe("formatOpenAiError", () => {
  it("maps quota errors to a user-friendly message", () => {
    const message = formatOpenAiError(new Error("429 You exceeded your current quota"));
    expect(message).toContain("quota exceeded");
    expect(message).toContain("Groq");
  });

  it("maps invalid API key errors", () => {
    const message = formatOpenAiError(new Error("401 Invalid API key"));
    expect(message).toContain("GROQ_API_KEY");
  });

  it("returns the original message for unknown errors", () => {
    expect(formatOpenAiError(new Error("Something else"))).toBe("Something else");
  });
});
