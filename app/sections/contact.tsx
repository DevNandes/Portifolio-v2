"use client";

/**
 * Contact section (cards for email, LinkedIn, GitHub, WhatsApp) and the site
 * Footer with the full RF lockup logo.
 */

import { Section } from "@/components/section";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

const LINKS = [
  {
    icon: Mail,
    label: "Email",
    value: "raphaelfernandes1607@gmail.com",
    href: "mailto:raphaelfernandes1607@gmail.com",
    color: "cyan",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "raphael-augusto-almeida-fernandes",
    href: "https://linkedin.com/in/raphael-augusto-almeida-fernandes",
    color: "violet",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "devnandes",
    href: "https://github.com/devnandes",
    color: "emerald",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+55 (41) 98813-5126",
    href: "https://wa.me/5541988135126",
    color: "amber",
  },
];

const COLORS: Record<string, { text: string; border: string; glow: string }> = {
  cyan: {
    text: "text-cyan",
    border: "hover:border-cyan/40",
    glow: "hover:shadow-[0_0_30px_-10px_rgba(0,212,255,0.6)]",
  },
  violet: {
    text: "text-violet",
    border: "hover:border-violet/40",
    glow: "hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.6)]",
  },
  emerald: {
    text: "text-emerald",
    border: "hover:border-emerald/40",
    glow: "hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.6)]",
  },
  amber: {
    text: "text-amber",
    border: "hover:border-amber/40",
    glow: "hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.6)]",
  },
};

export function Contact() {
  const { lang } = useLang();
  const t = {
    eyebrow: lang === "pt" ? "07 — Vamos conversar?" : "07 — Let's talk",
    title:
      lang === "pt" ? (
        <>
          Bora construir algo <span className="text-gradient">interessante</span>
        </>
      ) : (
        <>
          Let's build something <span className="text-gradient">interesting</span>
        </>
      ),
    subtitle:
      lang === "pt"
        ? "Tô aberto a projetos de RPA, IA aplicada, full stack e consultoria. Curitiba (presencial/híbrido) ou remoto — inclusive para vagas internacionais."
        : "Open to RPA, applied AI, full stack and consulting work. Curitiba (on-site/hybrid) or fully remote — including international roles.",
  };

  return (
    <Section id="contact" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {LINKS.map((l, i) => {
          const c = COLORS[l.color];
          return (
            <motion.a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`glass rounded-2xl p-5 border border-white/5 transition-all ${c.border} ${c.glow} flex items-center gap-4`}
            >
              <div
                className={`w-12 h-12 rounded-xl glass flex items-center justify-center ${c.text}`}
              >
                <l.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted font-mono uppercase tracking-wider">
                  {l.label}
                </div>
                <div className="font-semibold text-sm truncate">{l.value}</div>
              </div>
            </motion.a>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted">
        <MapPin size={14} className="text-cyan" />
        Curitiba, BR · Brazil
      </div>
    </Section>
  );
}

function LockupLogo() {
  // Full lockup: RF mark + name + SOFTWARE. Strokes/text use currentColor; dot stays cyan.
  return (
    <svg viewBox="0 0 420 80" className="h-12 w-auto" aria-label="Raphael Fernandes — Software">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      >
        <path d="M 12 68 L 12 12 L 44 12 Q 60 12 60 28 Q 60 44 44 44 L 12 44" />
        <path d="M 44 44 L 62 68" />
        <path d="M 82 68 L 82 12 L 122 12" />
        <path d="M 82 40 L 114 40" />
      </g>
      <circle cx="132" cy="65" r="4.5" fill="#00d4ff" />
      <line x1="155" y1="18" x2="155" y2="62" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <text
        x="170"
        y="46"
        fontFamily="'Inter', ui-sans-serif, system-ui, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        Raphael Fernandes
      </text>
      <text
        x="170"
        y="65"
        fontFamily="ui-monospace, 'JetBrains Mono', monospace"
        fontSize="11"
        fontWeight="400"
        fill="currentColor"
        opacity="0.7"
        letterSpacing="2"
      >
        SOFTWARE
      </text>
    </svg>
  );
}

export function Footer() {
  const { lang } = useLang();
  const made = lang === "pt" ? "Feito com" : "Made with";
  const live = lang === "pt" ? "Site funcionando em tempo real" : "Site running in real time";
  return (
    <footer className="border-t border-white/5 mt-12 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        <div className="text-foreground">
          <LockupLogo />
        </div>
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="font-mono">
            © {new Date().getFullYear()} Raphael Fernandes — {made}{" "}
            <span className="text-cyan">Next.js</span> ·{" "}
            <span className="text-violet">Tailwind</span> ·{" "}
            <span className="text-emerald">Groq</span>
          </div>
          <div className="font-mono">
            <span className="text-emerald">●</span> {live}
          </div>
        </div>
      </div>
    </footer>
  );
}
