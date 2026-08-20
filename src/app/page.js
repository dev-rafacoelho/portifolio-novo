import Menu from "@/components/Menu";
import NameCenter from "@/components/NameCenter";
import ThemeToggle from "@/components/ThemeToggle";
import PixelGrid from "@/components/PixelGrid";
import Hud from "@/components/Hud";
import { LanguageProvider } from "@/i18n/LanguageProvider";

export default function Home() {
  return (
    <LanguageProvider>
      <main className="relative min-h-screen overflow-hidden bg-white transition-colors duration-300 dark:bg-gray-900">
        <PixelGrid />
        <div
          className="scanlines pointer-events-none fixed inset-0 z-[5]"
          aria-hidden="true"
        />
        <ThemeToggle />
        <div className="relative z-10">
          <Menu />
          <NameCenter />
        </div>
        <Hud />
      </main>
    </LanguageProvider>
  );
}
