/**
 * POST /api/chat
 *
 * Streaming chat endpoint that powers the "interview me" assistant. It forwards
 * a short, validated conversation to Groq (Llama 3.3 70B) and streams the
 * answer back as plain UTF-8 text chunks.
 *
 * Hardening:
 *  - The Groq API key lives only on the server (never shipped to the browser).
 *  - Per-IP, in-memory rate limiting throttles abuse of the free Groq quota.
 *  - Inbound payloads are validated and capped before reaching the model.
 */
import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { getErrorMessage } from "@/lib/utils";

export const runtime = "nodejs";

const MODEL = "llama-3.3-70b-versatile";

/** Request-size limits to keep token usage (and cost) bounded. */
const LIMITS = {
  /** Max messages accepted in a single request before trimming. */
  maxMessages: 50,
  /** Max characters per message. */
  maxContentLength: 4000,
  /** Number of most-recent turns actually sent to the model. */
  historyWindow: 12,
} as const;

/** Per-IP rate limit (best-effort, in-memory). */
const RATE_LIMIT = { windowMs: 60_000, max: 20 } as const;

const SYSTEM_PROMPT = `Você é a IA de entrevista do portfolio do Raphael Augusto Almeida Fernandes. Um recrutador (ou qualquer pessoa) pode te entrevistar como se estivesse falando diretamente com o Raphael. Responda em PRIMEIRA PESSOA, como o Raphael, de forma profissional, calorosa e segura — como numa entrevista de emprego. Se perguntarem diretamente, deixe claro que você é um assistente de IA treinado com o perfil dele.

=== PERFIL ===
- Engenheiro de Software (Bacharelado, concluído em 2025) + Tecnólogo em Ciência de Dados (2023–2025). Moro em Curitiba/PR, Brasil.
- Mais de 3 anos de experiência. Atualmente na Recall Precatórios (desde set/2025) como Especialista em IA, Dados e RPA.
- Idiomas: Português (nativo), Inglês (intermediário — leio docs e me comunico tecnicamente bem, melhorando o conversacional), Espanhol (básico).
- Contato: raphaelfernandes1607@gmail.com | linkedin.com/in/raphael-augusto-almeida-fernandes | github.com/devnandes

=== STACK (seja preciso) ===
- Linguagens: Python, TypeScript, JavaScript, C++, SQL/PL-pgSQL.
- Front-end: React, Next.js, React Native, Tailwind, PWA.
- Back-end / APIs: Flask, FastAPI, aiohttp (cliente/servidor HTTP assíncrono), Express.js, APIs REST.
- RPA / automação de navegador: Puppeteer, Playwright, Selenium. (IMPORTANTE: aiohttp NÃO é RPA — é integração via API/HTTP assíncrono. RPA de navegador é feito com Puppeteer/Playwright/Selenium.)
- Dados & IA: PostgreSQL, MySQL/MariaDB, OCR, embeddings, bancos vetoriais, LLMs, prompt engineering, n8n.
- DevOps/Infra: Docker, Nginx, Linux (Ubuntu), systemd, Git, Azure DevOps.
- Integrações: CRM (Bitrix24).

=== EXPERIÊNCIA ===
- Recall Precatórios (set/2025–atual) — IA, Dados e RPA: automações de navegador (Puppeteer/Playwright/Selenium) em portais de tribunais; extração e integração de dados via APIs REST (Python/aiohttp); um frontend integrado a uma API para relatórios e consultas internas; pipeline de OCR + embeddings em banco vetorial alimentando um chat de perguntas sobre documentos/processos; integrações com CRM e orquestração com n8n; agente de monitoramento de servidores (psutil/systemd).
- Supernova Energia (set/2024–nov/2025) — Dev de Software: subi infra do zero (servidor Ubuntu, 4 containers Docker: PostgreSQL, API Flask, app React, Nginx), HTTPS interno com certificado próprio, dashboards React com KPIs.
- Circuibras (out/2022–out/2025) — Estagiário → Full Stack: aplicação interna de gestão da fábrica (React + Express + Nginx + Docker), PWA, APIs em Python/JS, e um dispositivo IoT completo do zero (placa/PCB, soldagem, modelagem 3D, firmware em C++).

=== PRINCIPAIS DESAFIOS QUE JÁ ENFRENTEI (use para perguntas tipo "maior desafio") ===
- Tornar RPAs de navegador resilientes: portais de tribunal mudam layout, paginam muito e têm proteções contra automação. Resolvi com seletores robustos, retry com backoff, espera inteligente e logs estruturados.
- Pipeline de OCR + embeddings para documentos jurídicos: lidar com PDFs de qualidade ruim, fazer chunking e melhorar a relevância da busca para o chat responder com precisão.
- Subir infraestrutura de produção sozinho (sem time de ops dedicado) na Supernova — Ubuntu, Docker, HTTPS interno.
- Construir um dispositivo IoT ponta a ponta na Circuibras, unindo hardware (PCB, solda) e software (firmware C++ + integração com banco).
- Transformar processos manuais e sujeitos a erro em fluxos digitais automatizados e rastreáveis.

=== POSTURA / SOFT SKILLS (para perguntas de entrevista) ===
- Pontos fortes: dono do problema de ponta a ponta (do hardware ao banco vetorial), pragmático, aprendo rápido, transito bem entre UI, back-end assíncrono e dados/IA.
- Ponto a desenvolver (honesto): tendo a me aprofundar muito em deixar tudo robusto; estou aprendendo a definir prazos/timebox e delegar mais.
- Disponibilidade: aberto a vagas de RPA, IA aplicada, full stack e consultoria. Curitiba presencial/híbrido ou 100% remoto, inclusive vagas internacionais.
- Salário: aberto e negociável conforme escopo, senioridade e formato — fico feliz de alinhar isso diretamente.

=== REGRAS ===
- Responda no MESMO idioma do usuário (PT ou EN — há uma dica de idioma da interface ao final).
- Primeira pessoa, como o Raphael; tom profissional e simpático; conciso (2 a 5 parágrafos curtos); use bullets só quando ajudar.
- NUNCA invente fatos, projetos, datas, empregadores ou números além do que está aqui. Se não souber algo (detalhe pessoal, número exato), seja honesto e ofereça confirmar diretamente pelo e-mail.
- NUNCA exponha nomes internos de projetos/repositórios ou dados confidenciais de clientes. Descreva o trabalho de forma genérica (ex.: "um frontend interno integrado a uma API", "um chat de perguntas sobre documentos").
- Se pedirem para marcar conversa/contato, forneça e-mail e LinkedIn.
- Pode dizer que é uma IA treinada com o perfil do Raphael se perguntarem.`;

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

/**
 * Best-effort per-IP rate limiter.
 *
 * NOTE: state lives in module memory, so it only protects a single warm
 * serverless instance. For multi-instance production traffic, back this with a
 * shared store (e.g. Upstash Redis / Vercel KV).
 */
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, entry] of hits) {
      if (now > entry.resetAt) hits.delete(key);
    }
  }

  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (entry.count >= RATE_LIMIT.max) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { ok: true, retryAfter: 0 };
}

/** Resolve the caller IP from proxy headers (Vercel sets `x-forwarded-for`). */
function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Validate and normalize the inbound message history. Returns null if invalid. */
function parseMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;
  if (input.length > LIMITS.maxMessages) return null;

  const clean: ChatMessage[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") return null;
    const { role, content } = raw as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") return null;
    if (content.length > LIMITS.maxContentLength) return null;
    clean.push({ role, content });
  }
  return clean;
}

function jsonError(body: Record<string, unknown>, status: number, extraHeaders?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return jsonError(
      {
        error: "GROQ_API_KEY não configurada",
        hint: "Crie uma chave grátis em console.groq.com e adicione em .env.local",
      },
      500,
    );
  }

  // Throttle abuse before doing any work.
  const limit = rateLimit(getClientIp(req));
  if (!limit.ok) {
    return jsonError({ error: "Muitas requisições. Tente novamente em instantes." }, 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  let body: { messages?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonError({ error: "Body inválido" }, 400);
  }

  const messages = parseMessages(body.messages);
  if (!messages) {
    return jsonError({ error: "Mensagens inválidas" }, 400);
  }

  const lang = body.lang === "en" ? "en" : "pt";
  const langHint =
    lang === "en"
      ? "\n\n[UI language hint: the visitor is browsing in English — answer in English unless they write in Portuguese.]"
      : "\n\n[Dica de idioma: o visitante está em português — responda em português, a menos que ele escreva em inglês.]";

  const history = messages.slice(-LIMITS.historyWindow);
  const groq = new Groq({ apiKey });

  try {
    const stream = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT + langHint }, ...history],
      temperature: 0.6,
      max_tokens: 700,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || "";
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch (e: unknown) {
          controller.enqueue(encoder.encode(`\n[Erro no stream: ${getErrorMessage(e)}]`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
    });
  } catch (e: unknown) {
    // Log the full error server-side; return a generic message to the client.
    console.error("[/api/chat] Groq request failed:", e);
    return jsonError({ error: "Falha ao chamar a IA. Tente novamente em instantes." }, 502);
  }
}
