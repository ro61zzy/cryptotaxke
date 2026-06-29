"use client";

import { useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import type { ChainScope } from "@/types";
import { chainQueryParam } from "@/lib/chains";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

export function ChatPanel({
  address,
  chainScope,
  sidebar = false,
  className,
}: {
  address: string;
  chainScope: ChainScope;
  /** Sticky right-column layout on large screens. */
  sidebar?: boolean;
  className?: string;
}) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setError(null);
    setLoading(true);
    setQuestion("");
    setMessages((m) => [...m, { role: "user", content: q }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          chain: chainQueryParam(chainScope),
          question: q,
        }),
      });

      const data = (await res.json()) as {
        answer?: string;
        citations?: string[];
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
      }

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.answer ?? "No answer returned.",
          citations: data.citations,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      className={cn(
        sidebar &&
          "flex max-h-[calc(100vh-7rem)] flex-col lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)]",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 shrink-0 text-brand" />
        <h2 className="text-lg font-medium">Ask about your taxes</h2>
      </div>
      <p className="mt-2 text-sm text-muted">
        Grounded in your wallet data and Kenyan tax guidance. Try: &quot;How much
        profit did I make?&quot; or &quot;Which transactions are taxable?&quot;
      </p>

      {(messages.length > 0 || loading) && (
        <div
          className={cn(
            "mt-4 space-y-3 overflow-y-auto rounded-lg border border-line bg-surface-2 p-4",
            sidebar ? "min-h-48 flex-1" : "max-h-80",
          )}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.role === "user"
                  ? "ml-8 rounded-lg bg-brand/10 p-3 text-sm"
                  : "mr-8 rounded-lg bg-surface p-3 text-sm"
              }
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.citations && msg.citations.length > 0 && (
                <p className="mt-2 text-xs text-muted">
                  Sources: {msg.citations.join(" · ")}
                </p>
              )}
            </div>
          ))}
          {loading && (
            <p className="flex items-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking…
            </p>
          )}
        </div>
      )}

      <form
        onSubmit={ask}
        className={cn("mt-4 flex shrink-0 gap-2", sidebar && "flex-col sm:flex-row")}
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question…"
          disabled={loading}
          className="h-11 flex-1 rounded-lg border border-line bg-background px-4 text-sm outline-none focus:border-brand disabled:opacity-60"
        />
        <Button type="submit" disabled={loading || !question.trim()}>
          Ask
        </Button>
      </form>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </Card>
  );
}
