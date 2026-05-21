"use client";

/**
 * Fixed top navigation: anchor links to each section, PT/EN language toggle
 * and a responsive mobile menu. Gains a glass background once the page scrolls.
 */

import { useEffect, useState } from "react";
import { Menu, X, Languages } from "lucide-react";
import { useLang } from "@/lib/i18n";

const LINKS = [
  { href: "#hero", pt: "Início", en: "Home" },
  { href: "#about", pt: "Sobre", en: "About" },
  { href: "#stack", pt: "Stack", en: "Stack" },
  { href: "#experience", pt: "Experiência", en: "Experience" },
  { href: "#rpa-demo", pt: "Demo RPA", en: "RPA Demo" },
  { href: "#ai-demo", pt: "Chat IA", en: "AI Chat" },
  { href: "#projects", pt: "Projetos", en: "Projects" },
  { href: "#contact", pt: "Contato", en: "Contact" },
];

function MarkLogo() {
  return (
    <svg viewBox="0 0 140 80" className="h-7 w-auto" aria-label="Raphael Fernandes">
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
      <circle cx="132" cy="65" r="5" fill="#00d4ff" />
    </svg>
  );
}

export function Nav() {
  const { lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <nav
          className={`flex items-center justify-between px-5 py-3 rounded-2xl transition-all ${
            scrolled ? "glass-strong shadow-2xl" : "bg-transparent"
          }`}
        >
          <a
            href="#hero"
            className="text-foreground hover:text-cyan transition-colors"
            aria-label="Raphael Fernandes — início"
          >
            <MarkLogo />
          </a>

          <ul className="hidden lg:flex items-center gap-1 text-sm">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="px-3 py-2 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  {lang === "pt" ? l.pt : l.en}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {/* Language switch */}
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-lg glass hover:bg-white/5 transition-colors"
              aria-label="Toggle language"
            >
              <Languages size={14} className="text-cyan" />
              <span className={lang === "pt" ? "text-foreground" : "text-muted"}>PT</span>
              <span className="text-muted">/</span>
              <span className={lang === "en" ? "text-foreground" : "text-muted"}>EN</span>
            </button>

            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5"
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {open && (
          <ul className="lg:hidden mt-2 glass-strong rounded-2xl p-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  {lang === "pt" ? l.pt : l.en}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
