"use client";

/**
 * Floating chat widget (FAB + collapsible panel) available on every section.
 * Streams answers from `/api/chat` and keeps unused suggestion chips visible.
 */

import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

export function FloatingChat() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);

  const t = {
    fab: lang === "pt" ? "Falar com a IA" : "Talk to the AI",
    header: lang === "pt" ? "Me entreviste" : "Interview me",
    welcome:
      lang === "pt"
        ? "Oi 👋 Sou a IA do Raphael. Pode me entrevistar por aqui — experiência, desafios, stack, disponibilidade."
        : "Hi 👋 I'm Raphael's AI. You can interview me here — experience, challenges, stack, availability.",
    placeholder: lang === "pt" ? "Escreva sua pergunta..." : "Type your question...",
    suggestions:
      lang === "pt"
        ? ["Me fale sobre você", "Maior desafio técnico?", "Por que te contratar?"]
        : ["Tell me about yourself", "Biggest technical challenge?", "Why hire you?"],
    errHint:
      lang === "pt"
        ? "Dica: configure a GROQ_API_KEY em .env.local (grátis em console.groq.com)."
        : "Tip: set GROQ_API_KEY in .env.local (free at console.groq.com).",
  };

  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: t.welcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usedIdx, setUsedIdx] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const started = messages.length > 1;

  // refresh welcome when language changes (only before conversation starts)
  useEffect(() => {
    if (!started) setMessages([{ role: "assistant", content: t.welcome }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next = [...messages, { role: "user", content: text } as Msg];
    setMessages(next);
    setInput("");
    setLoading(true);
    const idx = next.length;
    setMessages([...next, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, lang }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.hint || err.error || `HTTP ${res.status}`);
      }
      const reader = res.body?.getReader();
      const dec = new TextDecoder();
      let acc = "";
      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          setMessages((prev) => {
            const c = [...prev];
            c[idx] = { role: "assistant", content: acc };
            return c;
          });
        }
      }
    } catch (e: unknown) {
      setMessages((prev) => {
        const c = [...prev];
        c[idx] = { role: "assistant", content: `⚠ ${getErrorMessage(e, "Erro")}\n\n${t.errHint}` };
        return c;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating action button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t.fab}
        className="fixed bottom-5 right-5 z-[80] flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-gradient-to-r from-cyan to-violet text-background font-semibold shadow-2xl hover:scale-105 transition-transform"
      >
        <span className="relative flex items-center justify-center">
          {open ? <X size={18} /> : <MessageSquare size={18} />}
          {!open && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald" />
            </span>
          )}
        </span>
        {!open && <span className="hidden sm:inline text-sm">{t.fab}</span>}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-[80] w-[min(92vw,380px)] h-[min(72vh,540px)] flex flex-col glass-strong rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-cyan/10 to-violet/10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-background" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">RaphaelGPT — {t.header}</div>
              <div className="font-mono text-[10px] text-muted flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald" /> llama-3.3-70b · groq
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="p-1.5 rounded-lg hover:bg-white/10"
            >
              <X size={16} />
            </button>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const isLoadingMsg = loading && i === messages.length - 1 && m.content === "";
              return (
                <div key={i} className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                      isUser
                        ? "bg-violet/20 text-violet"
                        : "bg-gradient-to-br from-cyan to-violet text-background"
                    }`}
                  >
                    {isUser ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-violet/15 border border-violet/20 rounded-tr-sm"
                        : "bg-white/5 border border-white/5 rounded-tl-sm"
                    }`}
                  >
                    {m.content || (isLoadingMsg ? "…" : "")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* suggestions (persist unused) */}
          {!loading && t.suggestions.some((_, i) => !usedIdx.includes(i)) && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {t.suggestions.map((s, i) =>
                usedIdx.includes(i) ? null : (
                  <button
                    key={i}
                    onClick={() => {
                      setUsedIdx((u) => [...u, i]);
                      send(s);
                    }}
                    className="px-2.5 py-1 text-[11px] rounded-full glass hover:bg-white/5 hover:border-cyan/30 transition-colors"
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
          )}

          {/* input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-2.5 border-t border-white/10 bg-black/20"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder={t.placeholder}
                rows={1}
                className="flex-1 resize-none px-3 py-2 rounded-xl bg-white/5 border border-white/5 focus:border-cyan/30 focus:outline-none text-[13px] placeholder:text-muted/60 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 rounded-xl bg-gradient-to-br from-cyan to-violet text-background disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
