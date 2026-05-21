"use client";

/**
 * Tiny bilingual (PT/EN) layer.
 *
 * A React context holds the active language; the preference is persisted to
 * `localStorage` and guessed from the browser on the first visit. Each section
 * carries its own PT/EN strings and reads the active language via `useLang`.
 */
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "pt" | "en";

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const Ctx = createContext<LangCtx>({
  lang: "pt",
  setLang: () => {},
  toggle: () => {},
});

/** Provides the active language to the tree. Wrap the app once near the root. */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  // Load the saved preference (and guess from the browser the first time).
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "pt" || saved === "en") {
      setLangState(saved);
    } else if (typeof navigator !== "undefined") {
      setLangState(navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en");
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
    if (typeof document !== "undefined")
      document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
  };

  const toggle = () => setLang(lang === "pt" ? "en" : "pt");

  return <Ctx.Provider value={{ lang, setLang, toggle }}>{children}</Ctx.Provider>;
}

/** Read the active language and the setters from context. */
export function useLang() {
  return useContext(Ctx);
}
