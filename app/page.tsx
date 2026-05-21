import { LangProvider } from "@/lib/i18n";
import { AuroraBg } from "@/components/aurora-bg";
import { FloatingChat } from "@/components/floating-chat";
import { Nav } from "@/components/nav";
import { Hero } from "@/app/sections/hero";
import { About } from "@/app/sections/about";
import { Stack } from "@/app/sections/stack";
import { Experience } from "@/app/sections/experience";
import { RpaDemo } from "@/app/sections/rpa-demo";
import { AiDemo } from "@/app/sections/ai-demo";
import { Projects } from "@/app/sections/projects";
import { Contact, Footer } from "@/app/sections/contact";

export default function Home() {
  return (
    <LangProvider>
      {/* Aurora background sits at z-0; content is lifted above it */}
      <AuroraBg />
      <div className="relative z-10">
        <Nav />
        <main className="relative">
          <Hero />
          <About />
          <Stack />
          <Experience />
          <RpaDemo />
          <AiDemo />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
      <FloatingChat />
    </LangProvider>
  );
}
