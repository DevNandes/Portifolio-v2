import type { Config } from "tailwindcss";

/**
 * Tailwind theme.
 *
 * Brand colors (`cyan`/`violet`) and the background are driven by CSS custom
 * properties defined in `app/globals.css` (Aurora palette), exposed here with
 * `<alpha-value>` so opacity modifiers like `text-cyan/30` keep working.
 */
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--bg) / <alpha-value>)",
        foreground: "#e8e8f0",
        muted: "#9095a8",
        border: "rgba(255,255,255,0.08)",
        card: "rgba(255,255,255,0.03)",
        cyan: { DEFAULT: "rgb(var(--brand-1) / <alpha-value>)", glow: "rgb(var(--brand-1) / 0.2)" },
        violet: {
          DEFAULT: "rgb(var(--brand-2) / <alpha-value>)",
          glow: "rgb(var(--brand-2) / 0.2)",
        },
        emerald: { DEFAULT: "#10b981", glow: "#10b98133" },
        amber: { DEFAULT: "#f59e0b", glow: "#f59e0b33" },
        rose: { DEFAULT: "#f43f5e", glow: "#f43f5e33" },
      },
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      // Only the animations actually referenced by the UI are kept here.
      animation: {
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        blink: { "50%": { opacity: "0" } },
      },
    },
  },
  plugins: [],
};

export default config;
