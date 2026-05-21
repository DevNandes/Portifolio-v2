"use client";

/**
 * "Interview me" section — an inline chat panel where recruiters can ask
 * questions answered in the first person via the `/api/chat` Groq stream.
 */

import { Section } from "@/components/section";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

export function AiDemo() {
  const { lang } = useLang();

  const t = {
    eyebrow: lang === "pt" ? "05 — Chat IA" : "05 — AI Chat",
    title:
      lang === "pt" ? (
        <>
          Recrutando? <span className="text-gradient">Me entreviste aqui</span>
        </>
      ) : (
        <>
          Recruiting? <span className="text-gradient">Interview me here</span>
        </>
      ),
    subtitle:
      lang === "pt"
        ? "Esta é a minha IA, treinada com o meu perfil. Um recrutador pode me entrevistar aqui mesmo — experiência, maiores desafios, stack e disponibilidade. Roda em Llama 3.3 70B via Groq."
        : "This is my AI, trained on my profile. A recruiter can interview me right here — experience, biggest challenges, stack and availability. Runs on Llama 3.3 70B via Groq.",
    welcome:
      lang === "pt"
        ? "Oi 👋 Sou a IA do Raphael, pronta pra uma entrevista. Pergunte sobre experiência, maiores desafios técnicos, stack, disponibilidade — ou qualquer coisa que um recrutador costuma perguntar."
        : "Hi 👋 I'm Raphael's AI, ready for an interview. Ask about experience, biggest technical challenges, stack, availability — or anything a recruiter usually asks.",
    suggestions:
      lang === "pt"
        ? [
            "Me fale sobre você",
            "Qual foi seu maior desafio técnico?",
            "Por que te contratar?",
            "Disponibilidade e formato de trabalho?",
            "Pontos fortes e a melhorar?",
            "Como está seu inglês?",
            "Conta um projeto de que você se orgulha",
          ]
        : [
            "Tell me about yourself",
            "Your biggest technical challenge?",
            "Why should we hire you?",
            "Availability and work format?",
            "Strengths and areas to improve?",
            "How's your English?",
            "A project you're proud of",
          ],
    placeholder:
      lang === "pt"
        ? "Pergunte sobre experiência, stack, projetos..."
        : "Ask about experience, stack, projects...",
    errPrefix: lang === "pt" ? "Ops, deu erro:" : "Oops, error:",
    errHint:
      lang === "pt"
        ? "Dica: verifique se a chave do Groq está em .env.local (GROQ_API_KEY). Pegue grátis em console.groq.com"
        : "Tip: make sure the Groq key is in .env.local (GROQ_API_KEY). Get one free at console.groq.com",
  };

  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: t.welcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const started = messages.length > 1;
  const [usedIdx, setUsedIdx] = useState<number[]>([]);

  useEffect(() => {
    if (!started) setMessages([{ role: "assistant", content: t.welcome }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setError(null);
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    const assistantIdx = next.length;
    setMessages([...next, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, lang }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.hint || err.error || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const copy = [...prev];
            copy[assistantIdx] = { role: "assistant", content: acc };
            return copy;
          });
        }
      }
    } catch (e: unknown) {
      const msg = getErrorMessage(e, "Error");
      setError(msg);
      setMessages((prev) => {
        const copy = [...prev];
        copy[assistantIdx] = {
          role: "assistant",
          content: `⚠ ${t.errPrefix} ${msg}\n\n${t.errHint}`,
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section id="ai-demo" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="glass-strong rounded-3xl border border-white/5 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-gradient-to-r from-cyan/5 to-violet/5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
              <Sparkles size={18} className="text-background" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald border-2 border-background" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">RaphaelGPT</div>
            <div className="font-mono text-[10px] text-muted flex items-center gap-2">
              <span>llama-3.3-70b · groq</span>
              <span className="w-1 h-1 rounded-full bg-muted" />
              <span className="text-emerald">streaming</span>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="h-[420px] overflow-auto px-5 py-4 space-y-4">
          {messages.map((m, i) => (
            <Message
              key={i}
              msg={m}
              isLoading={loading && i === messages.length - 1 && m.content === ""}
            />
          ))}
        </div>

        {!loading && t.suggestions.some((_, i) => !usedIdx.includes(i)) && (
          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {t.suggestions.map((s, i) =>
              usedIdx.includes(i) ? null : (
                <button
                  key={i}
                  onClick={() => {
                    setUsedIdx((u) => [...u, i]);
                    send(s);
                  }}
                  className="px-3 py-1.5 text-xs rounded-full glass hover:bg-white/5 hover:border-cyan/30 transition-colors"
                >
                  {s}
                </button>
              ),
            )}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="p-3 border-t border-white/5 bg-black/20"
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
              className="flex-1 resize-none px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:border-cyan/30 focus:outline-none text-sm placeholder:text-muted/60 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-br from-cyan to-violet text-background disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          {error && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-rose">
              <AlertCircle size={11} /> {error}
            </div>
          )}
        </form>
      </div>
    </Section>
  );
}

function Message({ msg, isLoading }: { msg: Msg; isLoading: boolean }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isUser
            ? "bg-violet/20 text-violet"
            : "bg-gradient-to-br from-cyan to-violet text-background"
        }`}
      >
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-violet/15 border border-violet/20 rounded-tr-sm"
            : "bg-white/5 border border-white/5 rounded-tl-sm"
        }`}
      >
        {msg.content || (isLoading ? <ThinkingDots /> : "")}
      </div>
    </motion.div>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-cyan/60"
          style={{ animation: `pulse 1.4s ${i * 0.2}s infinite ease-in-out` }}
        />
      ))}
    </span>
  );
}
