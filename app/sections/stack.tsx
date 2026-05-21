"use client";

/**
 * Stack section: technology groups (languages, front-end, back-end, data/AI,
 * devops, automation) rendered as color-coded glass cards.
 */

import { motion } from "framer-motion";
import { Section } from "@/components/section";
import { useLang } from "@/lib/i18n";

const GROUPS = [
  {
    pt: "Linguagens",
    en: "Languages",
    color: "cyan",
    items: ["Python", "TypeScript", "JavaScript", "C++", "SQL", "PL/pgSQL"],
  },
  {
    pt: "Front-end",
    en: "Front-end",
    color: "violet",
    items: ["React", "Next.js", "React Native", "Tailwind", "Three.js", "PWA"],
  },
  {
    pt: "Back-end",
    en: "Back-end",
    color: "emerald",
    items: ["Flask", "FastAPI", "aiohttp", "Express.js", "REST API", "WebSockets"],
  },
  {
    pt: "Dados & IA",
    en: "Data & AI",
    color: "amber",
    items: ["PostgreSQL", "MySQL", "Vector DB", "OCR", "Embeddings", "LLMs"],
  },
  {
    pt: "DevOps & Infra",
    en: "DevOps & Infra",
    color: "rose",
    items: ["Docker", "Nginx", "Linux", "systemd", "Azure DevOps", "Git"],
  },
  {
    pt: "Automação / RPA",
    en: "Automation / RPA",
    color: "cyan",
    items: ["Puppeteer", "Playwright", "Selenium", "n8n", "Bitrix24", "Arduino/IoT"],
  },
];

const colorMap: Record<string, { glow: string; text: string; border: string }> = {
  cyan: {
    glow: "hover:shadow-[0_0_30px_-10px_rgba(0,212,255,0.5)]",
    text: "text-cyan",
    border: "hover:border-cyan/30",
  },
  violet: {
    glow: "hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.5)]",
    text: "text-violet",
    border: "hover:border-violet/30",
  },
  emerald: {
    glow: "hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.5)]",
    text: "text-emerald",
    border: "hover:border-emerald/30",
  },
  amber: {
    glow: "hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.5)]",
    text: "text-amber",
    border: "hover:border-amber/30",
  },
  rose: {
    glow: "hover:shadow-[0_0_30px_-10px_rgba(244,63,94,0.5)]",
    text: "text-rose",
    border: "hover:border-rose/30",
  },
};

export function Stack() {
  const { lang } = useLang();
  const t = {
    eyebrow: lang === "pt" ? "02 — Stack" : "02 — Stack",
    title: lang === "pt" ? "Ferramentas que uso no dia a dia" : "Tools I use day to day",
    subtitle:
      lang === "pt"
        ? "Pragmático: a tecnologia certa pro problema certo."
        : "Pragmatic: the right tool for the right problem.",
  };

  return (
    <Section id="stack" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GROUPS.map((g, i) => {
          const c = colorMap[g.color];
          return (
            <motion.div
              key={g.en}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`glass rounded-2xl p-6 transition-all ${c.border} ${c.glow}`}
            >
              <div className={`text-xs font-mono uppercase tracking-wider mb-4 ${c.text}`}>
                {lang === "pt" ? g.pt : g.en}
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 text-xs font-mono rounded-md bg-white/5 border border-white/5 text-foreground/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
