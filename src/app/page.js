import Menu from "@/components/Menu";
import NameCenter from "@/components/NameCenter";
import ThemeToggle from "@/components/ThemeToggle";
import PixelGrid from "@/components/PixelGrid";
import Hud from "@/components/Hud";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import { LanguageProvider } from "@/i18n/LanguageProvider";

export default function Home() {
  return (
    <LanguageProvider>
      <main className="bg-white transition-colors duration-300 dark:bg-gray-900">
        <ThemeToggle />

        {/* HERO: tela-título arcade (Pong, scanlines, HUD) */}
        <section className="relative h-screen overflow-hidden">
          <PixelGrid />
          <div
            className="scanlines pointer-events-none absolute inset-0 z-[5]"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <Menu />
            <NameCenter />
          </div>
          <Hud />
        </section>

        {/* SOBRE: tom sóbrio */}
        <About />

        {/* PROJETOS */}
        <Projects />

        {/* EXPERIÊNCIA */}
        <Experience />

        {/* CONTATO */}
        <Contact />
      </main>
    </LanguageProvider>
  );
}
