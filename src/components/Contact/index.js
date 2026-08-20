"use client";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";

const LINKS = {
  email: "coelho180305@gmail.com",
  whatsapp: "https://wa.me/5566999562005",
  whatsappLabel: "+55 66 99956-2005",
  linkedin: "https://www.linkedin.com/in/dev-rafacoelho",
  github: "https://github.com/dev-rafacoelho",
};

function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* Contagem regressiva de arcade: 9 → 0, reinicia. Para com reduced-motion. */
function Countdown({ run }) {
  const [n, setN] = useState(9);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setN((v) => (v === 0 ? 9 : v - 1)), 1000);
    return () => clearInterval(id);
  }, [run]);
  return (
    <span
      className="inline-block w-[1.2em] text-center tabular-nums text-red-600 dark:text-red-400"
      aria-hidden="true"
    >
      {n}
    </span>
  );
}

function Channel({ label, value, href, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group grid gap-1 border-t border-gray-200 py-5 transition-colors hover:border-gray-900 dark:border-gray-800 dark:hover:border-white sm:grid-cols-[140px_1fr_auto] sm:items-baseline sm:gap-6"
    >
      <span className="font-press-start text-[9px] text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="font-sans text-base text-gray-900 dark:text-white sm:text-lg">
        {value}
      </span>
      <span className="hidden font-press-start text-[9px] text-gray-900 transition-transform group-hover:translate-x-1 dark:text-white sm:block">
        →
      </span>
    </a>
  );
}

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;
  const [ref, inView] = useInView();

  return (
    <section
      id="contato"
      ref={ref}
      className="relative w-full border-t border-gray-200 bg-white px-[6vw] pt-24 dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-1/2 z-30 -translate-y-1/2 bg-gray-900 py-6 text-center font-press-start text-lg text-white dark:bg-white dark:text-gray-900 sm:text-2xl ${
          inView ? "level-banner-run" : "opacity-0"
        }`}
      >
        {c.level}
      </div>

      <div
        className={`mx-auto max-w-5xl transition-all duration-700 ease-out ${
          inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "900ms" }}
      >
        <p className="font-press-start text-[10px] tracking-[0.3em] text-red-600 dark:text-red-400">
          {c.level}
        </p>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* tela de game over */}
          <div>
            <h2 className="font-press-start text-3xl leading-tight text-gray-900 dark:text-white sm:text-5xl">
              {c.gameOver}
            </h2>
            <p className="mt-6 font-press-start text-base text-gray-900 dark:text-white sm:text-xl">
              {c.question} <Countdown run={inView} />
            </p>
            <p className="mt-8 max-w-[40ch] font-sans text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {c.intro}
            </p>
            <a
              href={c.resumeFile}
              download
              className="mt-10 inline-flex items-center gap-3 border-2 border-gray-900 bg-gray-900 px-6 py-4 font-press-start text-[10px] text-white transition-colors hover:bg-white hover:text-gray-900 dark:border-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-white"
            >
              {c.resume} ↓
            </a>
          </div>

          {/* canais */}
          <div>
            <p className="mb-2 font-press-start text-[9px] text-gray-500 dark:text-gray-400">
              {c.channels}
            </p>
            <div className="border-b border-gray-200 dark:border-gray-800">
              <Channel
                label={c.email}
                value={LINKS.email}
                href={`mailto:${LINKS.email}`}
              />
              <Channel
                label={c.whatsapp}
                value={LINKS.whatsappLabel}
                href={LINKS.whatsapp}
                external
              />
              <Channel
                label={c.linkedin}
                value="/in/dev-rafacoelho"
                href={LINKS.linkedin}
                external
              />
              <Channel
                label={c.github}
                value="@dev-rafacoelho"
                href={LINKS.github}
                external
              />
            </div>
          </div>
        </div>

        {/* rodapé */}
        <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 py-8 font-sans text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} Rafael Coelho · {c.footer}
          </p>
          <a
            href="#"
            className="font-press-start text-[8px] text-gray-900 underline-offset-4 hover:underline dark:text-white"
          >
            {c.backToTop}
          </a>
        </footer>
      </div>
    </section>
  );
}
