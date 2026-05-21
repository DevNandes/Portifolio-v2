"use client";

/**
 * Projects section: a responsive grid of project cards (most private under
 * NDA), each with a localized description and tech tags.
 */

import { motion } from "framer-motion";
import { Section } from "@/components/section";
import { Github, Lock } from "lucide-react";
import { useLang } from "@/lib/i18n";

const PROJECTS = [
  {
    name: "RECHAT",
    company: "Recall Precatórios",
    color: "cyan",
    private: true,
    tech: ["TypeScript", "Python", "OCR", "Embeddings", "pgvector", "LLMs"],
    pt: "Chat com IA sobre processos jurídicos. Um pipeline de OCR + embeddings indexa os documentos em banco vetorial; perguntas em linguagem natural retornam respostas com citação dos trechos relevantes.",
    en: "AI chat over legal cases. An OCR + embeddings pipeline indexes the documents in a vector DB; natural-language questions return answers citing the relevant passages.",
  },
  {
    name: "REPOINT",
    company: "Recall Precatórios",
    color: "violet",
    private: true,
    tech: ["TypeScript", "React", "REST API", "Bitrix24"],
    pt: "Frontend interno de relatórios e consultas integrado a uma API. Conecta dashboards, dados operacionais e integrações com CRM em uma única interface.",
    en: "Internal reporting & query frontend integrated with an API. Connects dashboards, operational data and CRM integrations in a single interface.",
  },
  {
    name: "rpa-precatorios",
    company: "Recall Precatórios",
    color: "emerald",
    private: true,
    tech: ["Python", "Playwright", "Selenium", "PostgreSQL", "RPA"],
    pt: "Automação de navegador (Puppeteer/Playwright/Selenium) para extração de dados de precatórios em portais de tribunais. Seletores robustos, retry com backoff, persistência em PostgreSQL e logs estruturados.",
    en: "Browser automation (Puppeteer/Playwright/Selenium) extracting court-debt data from court portals. Robust selectors, retry with backoff, PostgreSQL persistence and structured logging.",
  },
  {
    name: "CirnetV2",
    company: "Circuibras",
    color: "amber",
    private: true,
    tech: ["React", "Express.js", "Docker", "Nginx", "PWA"],
    pt: "Aplicação interna de gestão da fábrica. PWA em React com back-end em Express.js, servida via Nginx e containerizada em Docker — em operação contínua na produção.",
    en: "Internal factory-management application. A React PWA with an Express.js back-end, served via Nginx and containerized with Docker — running continuously in production.",
  },
  {
    name: "RenaultRisk",
    company: "Renault",
    color: "rose",
    private: true,
    tech: ["React", "Flask", "MySQL", "Docker"],
    pt: "PWA para controle de riscos de projetos. React + Flask + MySQL + Nginx, totalmente containerizado com Docker. Foco em UX para gerentes cadastrarem e analisarem riscos.",
    en: "PWA for project risk control. React + Flask + MySQL + Nginx, fully containerized with Docker. UX-focused so managers can register and analyze risks.",
  },
  {
    name: "NoRow MoreFood",
    company: "Bosch",
    color: "cyan",
    private: false,
    tech: ["Arduino", "C++", "IoT", "Sensors"],
    pt: "Projeto IoT para reduzir filas no refeitório. Arduino + sensores ultrassônicos em rede; monitores no caminho exibem ocupação em tempo real para balancear o fluxo.",
    en: "IoT project to reduce cafeteria queues. Arduino + ultrasonic sensors over the network; monitors along the way show real-time occupancy to balance the flow.",
  },
];

const GLOW: Record<string, string> = {
  cyan: "from-cyan/20 to-cyan/0",
  violet: "from-violet/20 to-violet/0",
  emerald: "from-emerald/20 to-emerald/0",
  amber: "from-amber/20 to-amber/0",
  rose: "from-rose/20 to-rose/0",
};

export function Projects() {
  const { lang } = useLang();
  const t = {
    eyebrow: lang === "pt" ? "06 — Projetos" : "06 — Projects",
    title:
      lang === "pt"
        ? "O que construí (e tá em produção)"
        : "What I've built (and it's in production)",
    subtitle:
      lang === "pt"
        ? "A maioria é privada por NDA, mas dá pra ter uma boa ideia da escala."
        : "Most are private under NDA, but you can get a good sense of the scale.",
  };

  return (
    <Section id="projects" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative glass rounded-2xl p-5 overflow-hidden hover:border-white/20 transition-all"
          >
            <div
              className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${GLOW[p.color]} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`}
            />

            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-mono text-base font-bold text-foreground">{p.name}</div>
                  <div className="text-[11px] text-muted font-mono">{p.company}</div>
                </div>
                {p.private ? (
                  <span className="flex items-center gap-1 text-[10px] text-muted font-mono">
                    <Lock size={10} /> private
                  </span>
                ) : (
                  <Github size={14} className="text-muted" />
                )}
              </div>

              <p className="text-xs text-muted leading-relaxed mb-4 min-h-[72px]">
                {lang === "pt" ? p.pt : p.en}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {p.tech.map((tch) => (
                  <span
                    key={tch}
                    className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 text-foreground/70 border border-white/5"
                  >
                    {tch}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
