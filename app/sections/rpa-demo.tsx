"use client";

/**
 * Live RPA demo: an animated, illustrative reenactment of a browser-automation
 * job (Playwright). A fake browser, terminal log and Postgres table animate in
 * sync as the "bot" logs in, searches, scrapes case rows and persists them.
 * The data is illustrative; nothing real is fetched.
 */

import { Section } from "@/components/section";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Database,
  Terminal,
  Globe,
  CheckCircle2,
  FileCheck2,
  MousePointer2,
} from "lucide-react";
import { useLang } from "@/lib/i18n";

type BState = "idle" | "open" | "login" | "search" | "results" | "extract";

type Step = {
  id: number;
  pt: string;
  en: string;
  duration: number;
  b?: BState;
  payload?: string;
};

const STEPS: Step[] = [
  {
    id: 0,
    pt: "🤖 RPA-Precatorios · Playwright inicializado",
    en: "🤖 RPA-Precatorios · Playwright initialized",
    duration: 600,
    b: "idle",
  },
  {
    id: 1,
    pt: "🌐 Abrindo Chromium headless (Playwright)",
    en: "🌐 Opening headless Chromium (Playwright)",
    duration: 800,
    b: "open",
  },
  {
    id: 2,
    pt: "➡️ Navegando até o portal do tribunal",
    en: "➡️ Navigating to the court portal",
    duration: 900,
    b: "open",
    payload: "tribunal.jus.br/precatorios/login",
  },
  {
    id: 3,
    pt: '⌨️ Preenchendo usuário e senha e clicando em "Entrar"',
    en: '⌨️ Filling username & password, clicking "Sign in"',
    duration: 1200,
    b: "login",
  },
  {
    id: 4,
    pt: '🔎 Digitando o filtro e clicando em "Buscar"',
    en: '🔎 Typing the filter and clicking "Search"',
    duration: 1100,
    b: "search",
  },
  {
    id: 5,
    pt: "📋 Tabela carregada — 247 processos",
    en: "📋 Table loaded — 247 cases",
    duration: 1000,
    b: "results",
  },
  {
    id: 6,
    pt: "🤖 Lendo a tabela e abrindo cada processo",
    en: "🤖 Reading the table and opening each case",
    duration: 700,
    b: "extract",
  },
  {
    id: 7,
    pt: "→ 0142578-39.2024 — campos extraídos (nº, valor, vara)",
    en: "→ 0142578-39.2024 — fields scraped (id, amount, court)",
    duration: 400,
    b: "extract",
  },
  {
    id: 8,
    pt: "→ 0207413-02.2024 — campos extraídos",
    en: "→ 0207413-02.2024 — fields scraped",
    duration: 400,
    b: "extract",
  },
  {
    id: 9,
    pt: "→ 0311892-78.2024 — campos extraídos",
    en: "→ 0311892-78.2024 — fields scraped",
    duration: 400,
    b: "extract",
  },
  {
    id: 10,
    pt: '⏭️ Clicando em "Próxima página" e repetindo',
    en: '⏭️ Clicking "Next page" and repeating',
    duration: 900,
    b: "extract",
  },
  {
    id: 11,
    pt: "💾 Salvando registros no PostgreSQL",
    en: "💾 Saving records to PostgreSQL",
    duration: 1000,
  },
  {
    id: 12,
    pt: "✅ Concluído — 247 processos extraídos por automação de navegador",
    en: "✅ Done — 247 cases scraped by browser automation",
    duration: 1500,
  },
];

const PROCESSES = [
  { num: "0142578-39.2024.8.06.0001", valor: "R$ 87.420,15", vara: "1ª Vara Faz." },
  { num: "0207413-02.2024.8.06.0001", valor: "R$ 142.890,00", vara: "3ª Vara Faz." },
  { num: "0311892-78.2024.8.06.0001", valor: "R$ 53.220,77", vara: "2ª Vara Faz." },
];

export function RpaDemo() {
  const { lang } = useLang();
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const [bstate, setBstate] = useState<BState>("idle");
  const [typedUrl, setTypedUrl] = useState("");
  const [dbRows, setDbRows] = useState<typeof PROCESSES>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = terminalRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  const reset = () => {
    setRunning(false);
    setCurrentStep(-1);
    setLogs([]);
    setBstate("idle");
    setTypedUrl("");
    setDbRows([]);
  };

  useEffect(() => {
    if (!running || currentStep < 0 || currentStep >= STEPS.length) {
      if (currentStep >= STEPS.length) setRunning(false);
      return;
    }
    const step = STEPS[currentStep];
    setLogs((l) => [...l, lang === "pt" ? step.pt : step.en]);
    if (step.b) setBstate(step.b);

    if (step.payload) {
      const url = step.payload;
      setTypedUrl("");
      let i = 0;
      const itv = setInterval(() => {
        i += 1;
        setTypedUrl(url.slice(0, i));
        if (i >= url.length) clearInterval(itv);
      }, 28);
    }

    if (step.id === 7) setDbRows([PROCESSES[0]]);
    if (step.id === 8) setDbRows([PROCESSES[0], PROCESSES[1]]);
    if (step.id === 9) setDbRows(PROCESSES);

    const tm = setTimeout(() => setCurrentStep((s) => s + 1), step.duration);
    return () => clearTimeout(tm);
  }, [running, currentStep, lang]);

  const toggle = () => {
    if (currentStep >= STEPS.length) reset();
    if (currentStep < 0) setCurrentStep(0);
    setRunning((r) => !r);
  };

  const progress = currentStep < 0 ? 0 : Math.min(((currentStep + 1) / STEPS.length) * 100, 100);
  const done = currentStep >= STEPS.length;

  const t = {
    eyebrow: lang === "pt" ? "04 — Demo ao vivo" : "04 — Live demo",
    title:
      lang === "pt" ? (
        <>
          RPA extraindo dados de processos <span className="text-gradient">em tempo real</span>
        </>
      ) : (
        <>
          RPA scraping case data <span className="text-gradient">in real time</span>
        </>
      ),
    subtitle:
      lang === "pt"
        ? "Aperte play e veja um RPA de verdade: o robô abre o navegador (Chromium via Playwright), faz login preenchendo o formulário, clica, digita o filtro, lê a tabela e extrai os dados de cada processo (número, valor, vara) — depois salva no banco. É automação de navegador, igual ao meu fluxo real na Recall."
        : "Hit play and watch real RPA: the bot opens the browser (Chromium via Playwright), logs in by filling the form, clicks, types the filter, reads the table and scrapes each case's data (id, amount, court) — then saves it. It's browser automation, just like my real workflow at Recall.",
    btnRun: lang === "pt" ? "Iniciar RPA" : "Start RPA",
    btnPause: lang === "pt" ? "Pausar" : "Pause",
    btnAgain: lang === "pt" ? "Rodar de novo" : "Run again",
    note:
      lang === "pt"
        ? "Automação de navegador (RPA) — o robô interage com a página como um humano: digita, clica e navega. Não é chamada de API. Dados ilustrativos."
        : "Browser automation (RPA) — the bot interacts with the page like a human: types, clicks and navigates. It's not an API call. Illustrative data.",
    doneMsg:
      lang === "pt"
        ? "Concluído. 247 processos extraídos por automação de navegador (Playwright) e salvos no PostgreSQL."
        : "Done. 247 cases scraped by browser automation (Playwright) and saved to PostgreSQL.",
  };

  return (
    <Section id="rpa-demo" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="glass-strong rounded-3xl p-4 sm:p-6 border border-white/5 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 mb-5 pb-5 border-b border-white/5">
          <button
            onClick={toggle}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan to-violet text-background font-semibold hover:scale-[1.02] transition-transform"
          >
            {running ? (
              <>
                <Pause size={16} /> {t.btnPause}
              </>
            ) : done ? (
              <>
                <RotateCcw size={16} /> {t.btnAgain}
              </>
            ) : (
              <>
                <Play size={16} /> {t.btnRun}
              </>
            )}
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass hover:bg-white/5 transition-colors text-sm"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <div className="flex-1 min-w-[180px] h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-cyan to-violet"
            />
          </div>
          <div className="font-mono text-xs text-muted">{Math.round(progress)}%</div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <BrowserPanel state={bstate} typedUrl={typedUrl} lang={lang} />
          <TerminalPanel logs={logs} terminalRef={terminalRef} />
          <DatabasePanel rows={dbRows} done={done} lang={lang} className="lg:col-span-2" />
        </div>

        <div className="mt-4 flex items-start gap-2 text-[11px] text-muted">
          <FileCheck2 size={13} className="text-cyan shrink-0 mt-0.5" />
          <span>{t.note}</span>
        </div>

        {done && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald/10 border border-emerald/20 text-sm"
          >
            <CheckCircle2 className="text-emerald shrink-0" size={18} />
            <span>{t.doneMsg}</span>
          </motion.div>
        )}
      </div>
    </Section>
  );
}

/* ============== Browser (the RPA actor) ============== */

function RobotCursor({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, left: x, top: y }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="absolute z-20 pointer-events-none"
      style={{ left: x, top: y }}
    >
      <MousePointer2
        size={18}
        className="text-cyan drop-shadow-[0_0_6px_rgba(0,212,255,0.8)]"
        fill="#00d4ff"
      />
      <span className="ml-3 -mt-1 inline-block px-1.5 py-0.5 rounded bg-cyan text-background text-[9px] font-mono font-bold">
        bot
      </span>
    </motion.div>
  );
}

function BrowserPanel({
  state,
  typedUrl,
  lang,
}: {
  state: BState;
  typedUrl: string;
  lang: "pt" | "en";
}) {
  const t = {
    waiting: lang === "pt" ? "Aguardando..." : "Waiting...",
    loginTitle: lang === "pt" ? "Portal do Tribunal — Acesso" : "Court Portal — Sign in",
    user: lang === "pt" ? "Usuário" : "Username",
    pass: lang === "pt" ? "Senha" : "Password",
    enter: lang === "pt" ? "Entrar" : "Sign in",
    listTitle: lang === "pt" ? "Lista de Precatórios" : "Precatórios list",
    search: lang === "pt" ? "Buscar" : "Search",
    more: lang === "pt" ? "+ 244 processos" : "+ 244 cases",
    next: lang === "pt" ? "Próxima ›" : "Next ›",
  };

  return (
    <div className="bg-[#0a0a15] rounded-2xl border border-white/5 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald/80" />
        </div>
        <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-white/5 font-mono text-[11px] text-muted truncate flex items-center gap-2">
          <Globe size={11} className="text-cyan" />
          {typedUrl || "about:blank"}
          {state === "open" && <span className="text-cyan animate-blink">▋</span>}
        </div>
        <div className="font-mono text-[10px] text-cyan">Playwright</div>
      </div>

      <div className="p-4 h-[300px] overflow-hidden relative">
        {state === "idle" && (
          <div className="h-full flex items-center justify-center text-muted text-sm">
            {t.waiting}
          </div>
        )}

        {state === "open" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="h-2 w-3/4 rounded bg-white/10 animate-pulse" />
            <div className="h-2 w-1/2 rounded bg-white/10 animate-pulse" />
            <div className="h-2 w-2/3 rounded bg-white/10 animate-pulse" />
            <div className="h-2 w-1/3 rounded bg-white/10 animate-pulse" />
          </motion.div>
        )}

        {state === "login" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[260px] mx-auto mt-4 space-y-3"
          >
            <div className="text-xs font-mono text-cyan mb-1">🔒 {t.loginTitle}</div>
            <div>
              <div className="text-[10px] text-muted mb-1">{t.user}</div>
              <div className="px-2 py-1.5 text-xs bg-white/5 rounded border border-cyan/40 font-mono">
                rpa.bot<span className="text-cyan animate-blink">▋</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted mb-1">{t.pass}</div>
              <div className="px-2 py-1.5 text-xs bg-white/5 rounded border border-white/10 font-mono">
                ••••••••••
              </div>
            </div>
            <button className="w-full py-1.5 text-xs rounded bg-cyan text-background font-semibold relative">
              {t.enter}
            </button>
            <RobotCursor x={170} y={232} />
          </motion.div>
        )}

        {(state === "search" || state === "results" || state === "extract") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="text-xs font-mono text-cyan mb-1">📋 {t.listTitle}</div>
            <div className="flex gap-2">
              <input
                className="flex-1 px-2 py-1 text-xs bg-white/5 rounded border border-white/10 font-mono"
                value="status: AGUARDANDO_DOC"
                readOnly
              />
              <button
                className={`px-3 py-1 text-xs rounded transition-colors ${state === "search" ? "bg-cyan text-background" : "bg-white/10"}`}
              >
                {t.search}
              </button>
            </div>

            <AnimatePresence>
              {(state === "results" || state === "extract") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-1.5"
                >
                  {PROCESSES.map((p, i) => (
                    <motion.div
                      key={p.num}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center justify-between px-2 py-1.5 rounded text-[11px] font-mono border ${
                        state === "extract"
                          ? "bg-cyan/5 border-cyan/20"
                          : "bg-white/5 border-transparent"
                      }`}
                    >
                      <span className="text-foreground/80 truncate">{p.num}</span>
                      <span className="text-emerald shrink-0 ml-2">{p.valor}</span>
                    </motion.div>
                  ))}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-muted">{t.more}</span>
                    {state === "extract" && (
                      <span className="px-2 py-0.5 text-[10px] rounded bg-cyan text-background font-mono">
                        {t.next}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {state === "search" && <RobotCursor x={250} y={70} />}

            {state === "extract" && (
              <motion.div
                className="absolute inset-x-4 h-px bg-gradient-to-r from-transparent via-cyan to-transparent"
                animate={{ top: ["28%", "78%"] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ============== Terminal ============== */

function TerminalPanel({
  logs,
  terminalRef,
}: {
  logs: string[];
  terminalRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="bg-[#05050d] rounded-2xl border border-white/5 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border-b border-white/5">
        <Terminal size={12} className="text-emerald" />
        <span className="font-mono text-[11px] text-muted">
          terminal — rpa_precatorios.py · Playwright
        </span>
        {logs.length > 0 && (
          <span className="ml-auto font-mono text-[10px] text-emerald flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            running
          </span>
        )}
      </div>

      <div
        ref={terminalRef}
        className="p-3 h-[300px] overflow-auto font-mono text-[11px] space-y-1"
      >
        <div className="text-muted">$ python rpa_precatorios.py --headless --portal tjes</div>
        {logs.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={
              line.includes("✅")
                ? "text-emerald"
                : line.includes("❌")
                  ? "text-rose"
                  : line.includes("→")
                    ? "text-cyan pl-3"
                    : line.includes("🤖")
                      ? "text-violet"
                      : "text-foreground/80"
            }
          >
            <span className="text-muted mr-2">{String(i + 1).padStart(2, "0")}</span>
            {line}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============== Database ============== */

function DatabasePanel({
  rows,
  done,
  lang,
  className = "",
}: {
  rows: typeof PROCESSES;
  done: boolean;
  lang: "pt" | "en";
  className?: string;
}) {
  const cols =
    lang === "pt"
      ? { num: "processo", valor: "valor", vara: "vara", status: "status" }
      : { num: "case", valor: "amount", vara: "court", status: "status" };
  const empty = lang === "pt" ? "— vazio —" : "— empty —";
  const saved = lang === "pt" ? "salvo" : "saved";
  const truncated =
    lang === "pt"
      ? "+ 244 linhas (truncado pra visualização)"
      : "+ 244 rows (truncated for display)";

  return (
    <div className={`bg-[#0a0a15] rounded-2xl border border-white/5 overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border-b border-white/5">
        <Database size={12} className="text-violet" />
        <span className="font-mono text-[11px] text-muted">postgres — precatorios.processos</span>
        <span className="ml-auto font-mono text-[10px] text-muted">{rows.length} rows</span>
      </div>

      <div className="p-3 font-mono text-[11px] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-muted text-left">
              <th className="font-normal py-1.5 pr-3">id</th>
              <th className="font-normal py-1.5 pr-3">{cols.num}</th>
              <th className="font-normal py-1.5 pr-3">{cols.valor}</th>
              <th className="font-normal py-1.5 pr-3">{cols.vara}</th>
              <th className="font-normal py-1.5">{cols.status}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-muted">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <motion.tr
                  key={r.num}
                  initial={{ opacity: 0, backgroundColor: "rgba(0,212,255,0.15)" }}
                  animate={{ opacity: 1, backgroundColor: "rgba(255,255,255,0)" }}
                  transition={{ duration: 1.2 }}
                  className="border-t border-white/5"
                >
                  <td className="py-1.5 pr-3 text-muted">{i + 1}</td>
                  <td className="py-1.5 pr-3 text-foreground/90 truncate max-w-[200px]">{r.num}</td>
                  <td className="py-1.5 pr-3 text-emerald">{r.valor}</td>
                  <td className="py-1.5 pr-3 text-foreground/70">{r.vara}</td>
                  <td className="py-1.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald/10 text-emerald text-[10px]">
                      <CheckCircle2 size={9} />
                      {saved}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
            {done && (
              <tr className="border-t border-white/5">
                <td colSpan={5} className="py-2 text-center text-muted text-[10px]">
                  {truncated}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
