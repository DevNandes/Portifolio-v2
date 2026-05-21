"use client";

/**
 * Landing hero: animated role typing, availability badge, primary CTAs and
 * social links. Sits above the global aurora background with a readability
 * vignette.
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowDown, Github, Linkedin, MessageCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";

const ROLES = {
  pt: [
    "Engenheiro de Software",
    "Especialista em RPA & IA",
    "Desenvolvedor Full Stack",
    "Builder de sistemas inteligentes",
  ],
  en: [
    "Software Engineer",
    "RPA & AI Specialist",
    "Full Stack Developer",
    "Builder of intelligent systems",
  ],
};

export function Hero() {
  const { lang } = useLang();
  const roles = ROLES[lang];
  const [roleIdx, setRoleIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setRoleIdx(0);
    setTyped("");
    setDeleting(false);
  }, [lang]);

  useEffect(() => {
    const current = roles[roleIdx] ?? roles[0];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && typed.length < current.length) {
      timeout = setTimeout(() => setTyped(current.slice(0, typed.length + 1)), 60);
    } else if (!deleting && typed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && typed.length > 0) {
      timeout = setTimeout(() => setTyped(typed.slice(0, -1)), 30);
    } else if (deleting && typed.length === 0) {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [typed, deleting, roleIdx, roles]);

  const t = {
    available: lang === "pt" ? "Aberto a oportunidades" : "Open to opportunities",
    hello: lang === "pt" ? "Olá, eu sou" : "Hi, I'm",
    desc:
      lang === "pt" ? (
        <>
          Construo sistemas que conectam <span className="text-foreground">CRMs, APIs e IA</span>{" "}
          para transformar operações manuais em processos digitais{" "}
          <span className="text-foreground">rastreáveis e escaláveis</span>. Hoje atuo na{" "}
          <span className="text-cyan">Recall Precatórios</span>, criando RPAs, pipelines de dados e
          chat com LLMs.
        </>
      ) : (
        <>
          I build systems that connect <span className="text-foreground">CRMs, APIs and AI</span> to
          turn manual operations into <span className="text-foreground">traceable, scalable</span>{" "}
          digital processes. Currently at <span className="text-cyan">Recall Precatórios</span>,
          building RPAs, data pipelines and LLM chat.
        </>
      ),
    ctaRpa: lang === "pt" ? "▶ Ver demo de RPA ao vivo" : "▶ Watch live RPA demo",
    ctaAi: lang === "pt" ? "🤖 Conversar com a IA" : "🤖 Chat with the AI",
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24"
    >
      {/* Readability vignette over the global aurora background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at center, rgb(var(--bg) / 0.7) 0%, rgb(var(--bg) / 0.2) 50%, transparent 80%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass text-xs font-mono"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
          </span>
          <span className="text-muted">{t.available}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05]"
          style={{ textShadow: "0 2px 40px rgb(var(--bg))" }}
        >
          <span className="block text-foreground/90">{t.hello}</span>
          <span className="block text-gradient mt-2">Raphael Fernandes</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-mono text-lg sm:text-2xl text-muted h-9 mb-8"
        >
          <span className="text-cyan">&gt;</span>{" "}
          <span className="text-foreground/90">{typed}</span>
          <span className="text-cyan animate-blink">▋</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-base sm:text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t.desc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
        >
          <a
            href="#rpa-demo"
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan to-violet text-background font-semibold overflow-hidden hover:scale-[1.02] transition-transform"
          >
            <span className="relative z-10">{t.ctaRpa}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet to-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="#ai-demo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-strong hover:bg-white/5 transition-colors font-semibold"
          >
            {t.ctaAi}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex items-center justify-center gap-5"
        >
          {[
            { href: "https://github.com/devnandes", icon: Github, label: "GitHub" },
            {
              href: "https://linkedin.com/in/raphael-augusto-almeida-fernandes",
              icon: Linkedin,
              label: "LinkedIn",
            },
            { href: "https://wa.me/5541988135126", icon: MessageCircle, label: "WhatsApp" },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-3 rounded-lg glass hover:glow-cyan hover:border-cyan/30 transition-all"
            >
              <Icon size={18} className="text-muted hover:text-cyan transition-colors" />
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="text-muted animate-bounce" size={20} />
        </motion.div>
      </div>
    </section>
  );
}
