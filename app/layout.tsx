import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: "Raphael Fernandes — Engenheiro de Software | RPA · IA · Full Stack",
  description:
    "Engenheiro de Software focado em automação (RPA), IA aplicada e desenvolvimento full stack. Construo sistemas que conectam CRMs, APIs e modelos de IA para transformar operações em processos digitais inteligentes.",
  metadataBase: new URL("https://portifolio-rapha.vercel.app"),
  applicationName: "R. Fernandes",
  authors: [{ name: "Raphael Fernandes", url: "https://github.com/devnandes" }],
  keywords: ["RPA", "IA", "Full Stack", "Next.js", "Python", "Playwright", "Raphael Fernandes"],
  appleWebApp: {
    capable: true,
    title: "R. Fernandes",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Raphael Fernandes — Engenheiro de Software",
    description: "RPA · IA · Full Stack — Veja demos interativos de automação e chatbot ao vivo.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#04060f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** Root layout: applies global styles, dark theme and PWA registration. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-background text-foreground antialiased">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
