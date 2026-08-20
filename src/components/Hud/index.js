"use client";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageProvider";

const STACK = ["React", "Next.js", "Node", "Tailwind"];
const FLAGS = [
  { id: "pt", src: "/brasil.svg", label: "langPt" },
  { id: "en", src: "/usa.svg", label: "langEn" },
];

export default function Hud() {
  const { lang, setLang, t } = useLanguage();

  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 px-[3vw] pb-[3vh] font-press-start text-[9px] sm:text-[10px]">
      {/* power-ups: stack */}
      <ul className="pointer-events-auto flex flex-wrap gap-2">
        {STACK.map((s) => (
          <li
            key={s}
            className="border-2 border-gray-900 bg-white px-2 py-1 text-gray-900 shadow-[3px_3px_0_0_#dc2626] transition-transform hover:-translate-y-1 dark:border-white dark:bg-gray-900 dark:text-white dark:shadow-[3px_3px_0_0_#f87171]"
          >
            {s}
          </li>
        ))}
      </ul>

      {/* press start */}
      <a
        href="#sobre"
        className="press-start pointer-events-auto hidden text-gray-900 dark:text-white sm:block"
      >
        {t.pressStart}
      </a>

      {/* idioma */}
      <div className="pointer-events-auto flex gap-2">
        {FLAGS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLang(l.id)}
            aria-label={t[l.label]}
            aria-pressed={lang === l.id}
            className={`border-2 p-1 transition-all ${
              lang === l.id
                ? "border-red-600 dark:border-red-400"
                : "border-transparent opacity-50 hover:opacity-100"
            }`}
          >
            <Image src={l.src} alt="" width={28} height={20} />
          </button>
        ))}
      </div>
    </footer>
  );
}
