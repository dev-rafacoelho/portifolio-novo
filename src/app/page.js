import Menu from "@/components/Menu";
import NameCenter from "@/components/NameCenter";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <section className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <ThemeToggle />
      <Menu />
      <NameCenter />
    </section>
  );
}
