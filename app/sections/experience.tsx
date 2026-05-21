"use client";

/**
 * Experience section: a vertical timeline of roles, each with localized
 * highlights and a tech-tag list.
 */

import { motion } from "framer-motion";
import { Section } from "@/components/section";
import { Briefcase, MapPin } from "lucide-react";
import { useLang } from "@/lib/i18n";

const JOBS = [
  {
    color: "cyan",
    pt: {
      title: "Especialista em IA, Dados e RPA",
      company: "Recall Precatórios",
      type: "Autônomo · Atual",
      period: "set/2025 — presente",
      location: "Curitiba, BR · Presencial",
      highlights: [
        "RPAs de automação de navegador (Puppeteer, Playwright, Selenium) em portais de tribunais",
        "Extração e integração de dados via APIs REST (Python, aiohttp)",
        "Frontend integrado a uma API para relatórios e consultas internas",
        "Pipeline de OCR + embeddings em banco vetorial, alimentando um chat de perguntas sobre os documentos",
        "Integrações com CRM (Bitrix24) e orquestração de workflows com n8n",
        "Agente de monitoramento (psutil/systemd) expondo métricas dos servidores em produção",
      ],
    },
    en: {
      title: "AI, Data & RPA Specialist",
      company: "Recall Precatórios",
      type: "Contractor · Current",
      period: "Sep/2025 — present",
      location: "Curitiba, BR · On-site",
      highlights: [
        "Browser-automation RPAs (Puppeteer, Playwright, Selenium) for court portals",
        "Data extraction & integration via REST APIs (Python, aiohttp)",
        "A frontend integrated with an API for internal reporting and queries",
        "OCR + embeddings pipeline in a vector DB, powering a Q&A chat over the documents",
        "CRM integrations (Bitrix24) and workflow orchestration with n8n",
        "Monitoring agent (psutil/systemd) exposing production server metrics",
      ],
    },
    tech: ["Python", "TypeScript", "Playwright", "PostgreSQL", "Docker", "LLMs", "Bitrix24"],
  },
  {
    color: "violet",
    pt: {
      title: "Desenvolvedor de Software",
      company: "Supernova Energia",
      type: "Autônomo",
      period: "set/2024 — nov/2025",
      location: "Curitiba, BR · Remoto",
      highlights: [
        "Servidor Ubuntu do zero orquestrando 4 containers Docker (PostgreSQL, Flask, React, Nginx)",
        "HTTPS interno via certificado in-house para a intranet da empresa",
        "Dashboards web responsivos em React com KPIs em D-1",
        "Endpoints REST em Flask expondo dados de produção de forma segura",
      ],
    },
    en: {
      title: "Software Developer",
      company: "Supernova Energia",
      type: "Contractor",
      period: "Sep/2024 — Nov/2025",
      location: "Curitiba, BR · Remote",
      highlights: [
        "Ubuntu server from scratch orchestrating 4 Docker containers (PostgreSQL, Flask, React, Nginx)",
        "Internal HTTPS via in-house certificate for the company intranet",
        "Responsive React dashboards with day-minus-1 KPIs",
        "Flask REST endpoints securely exposing production data",
      ],
    },
    tech: ["Python", "Flask", "React", "PostgreSQL", "Docker", "Nginx", "Azure DevOps"],
  },
  {
    color: "emerald",
    pt: {
      title: "Desenvolvedor Full Stack",
      company: "Circuibras — Circuitos Impressos",
      type: "Tempo integral · Estagiário → Full Stack",
      period: "out/2022 — out/2025",
      location: "Araucária, BR · Presencial",
      highlights: [
        "Aplicação interna de gestão da fábrica em React + Express.js + Nginx + Docker",
        "PWA com foco em acessibilidade, iterado com os colaboradores da fábrica",
        "APIs RESTful em Python (Flask) e JavaScript para integração entre sistemas",
        "Gestão de bancos MariaDB/MySQL para a aplicação principal e PostgreSQL para IoT",
        "Dispositivo IoT completo: PCB próprio, soldagem, modelagem 3D, firmware em C++",
      ],
    },
    en: {
      title: "Full Stack Developer",
      company: "Circuibras — Printed Circuits",
      type: "Full-time · Intern → Full Stack",
      period: "Oct/2022 — Oct/2025",
      location: "Araucária, BR · On-site",
      highlights: [
        "Internal factory-management app in React + Express.js + Nginx + Docker",
        "Accessibility-focused PWA, iterated with factory workers",
        "RESTful APIs in Python (Flask) and JavaScript for system integration",
        "MariaDB/MySQL for the main app and PostgreSQL for IoT projects",
        "Full IoT device: custom PCB, soldering, 3D modeling, C++ firmware",
      ],
    },
    tech: ["React", "Express", "Flask", "MariaDB", "Docker", "Arduino", "C++"],
  },
];

const COLORS: Record<string, { dot: string; border: string; text: string; glow: string }> = {
  cyan: {
    dot: "bg-cyan",
    border: "border-cyan/30",
    text: "text-cyan",
    glow: "shadow-[0_0_20px_-5px_rgba(0,212,255,0.5)]",
  },
  violet: {
    dot: "bg-violet",
    border: "border-violet/30",
    text: "text-violet",
    glow: "shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)]",
  },
  emerald: {
    dot: "bg-emerald",
    border: "border-emerald/30",
    text: "text-emerald",
    glow: "shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]",
  },
};

export function Experience() {
  const { lang } = useLang();
  const t = {
    eyebrow: lang === "pt" ? "03 — Trajetória" : "03 — Journey",
    title: lang === "pt" ? "Da fábrica ao banco de dados" : "From the factory to the database",
    subtitle:
      lang === "pt"
        ? "Três anos cobrindo full stack, IoT, automação e IA aplicada."
        : "Three years across full stack, IoT, automation and applied AI.",
  };

  return (
    <Section id="experience" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="relative pl-8 sm:pl-10">
        <div className="absolute left-3 sm:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-cyan via-violet to-emerald opacity-30" />

        <div className="space-y-12">
          {JOBS.map((job, i) => {
            const c = COLORS[job.color];
            const j = lang === "pt" ? job.pt : job.en;
            return (
              <motion.div
                key={j.company + j.period}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div
                  className={`absolute -left-[26px] sm:-left-[34px] top-4 w-3 h-3 rounded-full ${c.dot} ${c.glow}`}
                />

                <div
                  className={`glass rounded-2xl p-6 border ${c.border} hover:bg-white/5 transition-colors`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">{j.title}</h3>
                      <div className={`text-sm font-mono ${c.text} mt-1 flex items-center gap-2`}>
                        <Briefcase size={14} />
                        {j.company}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted font-mono">
                      <div>{j.period}</div>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        <MapPin size={12} />
                        {j.location}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted mb-4">{j.type}</div>

                  <ul className="space-y-2 mb-4">
                    {j.highlights.map((h) => (
                      <li key={h} className="text-sm text-foreground/80 flex gap-2 leading-relaxed">
                        <span className={`mt-1.5 h-1 w-1 rounded-full ${c.dot} shrink-0`} />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5">
                    {job.tech.map((tch) => (
                      <span
                        key={tch}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 text-muted border border-white/5"
                      >
                        {tch}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
