"use client";

/**
 * About section: short bio, animated stat cards and a tech-tag cloud.
 */

import { motion } from "framer-motion";
import { Section } from "@/components/section";
import { Code2, Zap, Brain, Boxes } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function About() {
  const { lang } = useLang();

  const stats = [
    { value: "3+", icon: Code2, pt: "Anos de experiência", en: "Years of experience" },
    {
      value: "15+",
      icon: Boxes,
      pt: "Repos privados em produção",
      en: "Private repos in production",
    },
    {
      value: "20+",
      icon: Zap,
      pt: "RPAs & integrações entregues",
      en: "RPAs & integrations shipped",
    },
    { value: "IA", icon: Brain, pt: "Pipelines de dados + LLMs", en: "Data pipelines + LLMs" },
  ];

  const t = {
    eyebrow: lang === "pt" ? "01 — Sobre mim" : "01 — About me",
    title:
      lang === "pt" ? "Engenheiro com cabeça de operações" : "Engineer with an operations mindset",
    subtitle:
      lang === "pt"
        ? "Do PCB ao banco de dados — passei pelas duas pontas do problema."
        : "From PCB to database — I've worked both ends of the problem.",
    p1:
      lang === "pt" ? (
        <>
          Comecei em chão de fábrica, na <span className="text-foreground">Circuibras</span> (maior
          fabricante de placas de circuito impresso do Brasil), desenvolvendo a aplicação interna de
          gestão e até montando um dispositivo IoT do zero — soldando componentes, modelando o
          gabinete e escrevendo o firmware em C++.
        </>
      ) : (
        <>
          I started on the factory floor at <span className="text-foreground">Circuibras</span>{" "}
          (Brazil's largest PCB manufacturer), building the internal management app and even
          assembling an IoT device from scratch — soldering components, modeling the enclosure and
          writing the C++ firmware.
        </>
      ),
    p2:
      lang === "pt" ? (
        <>
          Hoje, na <span className="text-cyan">Recall Precatórios</span>, atuo em tecnologia
          desenvolvendo automações em Python, pipelines de dados, dashboards de operação e
          integrações com CRMs e tribunais.{" "}
          <span className="text-foreground">
            Conecto sistemas para virar fluxos manuais em processos rastreáveis.
          </span>
        </>
      ) : (
        <>
          Today, at <span className="text-cyan">Recall Precatórios</span>, I work in tech building
          Python automations, data pipelines, ops dashboards and integrations with CRMs and court
          systems.{" "}
          <span className="text-foreground">
            I connect systems to turn manual flows into traceable processes.
          </span>
        </>
      ),
    p3:
      lang === "pt" ? (
        <>
          Gosto de problemas que precisam tanto de UI quanto de pipeline assíncrono, tanto de SQL
          otimizado quanto de prompt engineering bem-feito. É raro — e onde me sinto em casa.
        </>
      ) : (
        <>
          I enjoy problems that need both UI and async pipelines, both tuned SQL and solid prompt
          engineering. It's rare — and exactly where I feel at home.
        </>
      ),
  };

  return (
    <Section id="about" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-5 text-muted leading-relaxed">
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <p>{t.p3}</p>

          <div className="pt-4 flex flex-wrap gap-2">
            {["RPA", "Python", "TypeScript", "Docker", "PostgreSQL", "LLMs", "n8n", "Bitrix24"].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-mono rounded-full glass border border-white/5"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.value + i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass rounded-2xl p-5 hover:glow-cyan hover:border-cyan/20 transition-all group"
            >
              <s.icon
                className="text-cyan mb-3 group-hover:scale-110 transition-transform"
                size={22}
              />
              <div className="text-3xl font-bold text-gradient mb-1">{s.value}</div>
              <div className="text-xs text-muted">{lang === "pt" ? s.pt : s.en}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
