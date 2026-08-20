"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";

/* Observa quando a seção entra na viewport (dispara uma vez). */
function useInView(threshold = 0.25) {
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

const label = "font-press-start text-[9px] text-gray-500 dark:text-gray-400";

export default function About() {
  const { t } = useLanguage();
  const a = t.about;
  const [ref, inView] = useInView();

  // aparece em cascata depois da faixa LEVEL 2
  const reveal = (i) => ({
    className: `transition-all duration-700 ${
      inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`,
    style: { transitionDelay: `${900 + i * 150}ms` },
  });

  return (
    <section
      id="sobre"
      ref={ref}
      className="relative w-full border-t border-gray-200 bg-gray-50 px-[6vw] py-24 dark:border-gray-800 dark:bg-gray-950"
    >
      {/* transição de fase */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-1/2 z-30 -translate-y-1/2 bg-gray-900 py-6 text-center font-press-start text-lg text-white dark:bg-white dark:text-gray-900 sm:text-2xl ${
          inView ? "level-banner-run" : "opacity-0"
        }`}
      >
        {a.level}
      </div>

      <div className="mx-auto max-w-5xl">
        <p
          {...reveal(0)}
          className={`${reveal(0).className} mb-12 font-press-start text-[10px] tracking-[0.3em] text-red-600 dark:text-red-400`}
        >
          {a.level}
        </p>

        <div className="grid gap-12 md:grid-cols-[280px_1fr] md:gap-16">
          {/* coluna esquerda: foto + records */}
          <div className="flex flex-col gap-8">
            <div {...reveal(1)}>
              <div className="relative border-2 border-gray-900 bg-white p-2 dark:border-white dark:bg-gray-900">
                <Image
                  src="/me.png"
                  alt="Rafael Coelho"
                  width={1085}
                  height={1433}
                  priority={false}
                  className="h-auto w-full"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-600 px-2 py-1 font-press-start text-[8px] text-white dark:bg-red-400 dark:text-gray-900">
                  {a.classLabel}: {a.className}
                </span>
              </div>
              <p className="mt-6 font-sans text-sm text-gray-500 dark:text-gray-400">
                {a.location}
              </p>
            </div>

            <div {...reveal(3)}>
              <p className={`${label} mb-4`}>{a.records}</p>
              <ul className="flex flex-col divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-800 dark:border-gray-800">
                {a.achievements.map((r) => (
                  <li key={r.label} className="py-3">
                    <p className="font-press-start text-sm text-gray-900 dark:text-white">
                      {r.value}
                    </p>
                    <p className="mt-1 font-sans text-sm leading-snug text-gray-600 dark:text-gray-400">
                      {r.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* coluna direita */}
          <div className="flex flex-col gap-12">
            <div {...reveal(2)}>
              <h2 className="border-b-2 border-gray-900 pb-4 font-press-start text-base text-gray-900 dark:border-white dark:text-white sm:text-xl">
                RAFAEL COELHO
              </h2>
              <p className="mt-6 max-w-prose font-sans text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg">
                {a.bio}
              </p>
            </div>

            <div {...reveal(4)}>
              <p className={`${label} mb-4`}>{a.arsenal}</p>
              <div className="grid gap-px overflow-hidden border border-gray-200 bg-gray-200 dark:border-gray-800 dark:bg-gray-800 sm:grid-cols-2">
                {a.stacks.map((s) => (
                  <div
                    key={s.area}
                    className="bg-white p-5 dark:bg-gray-900"
                  >
                    <p className="font-press-start text-[9px] text-red-600 dark:text-red-400">
                      {s.area}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                      {s.items.map((item) => (
                        <li
                          key={item}
                          className="font-sans text-sm text-gray-800 dark:text-gray-200"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div {...reveal(5)}>
              <p className={`${label} mb-4`}>{a.languages}</p>
              <ul className="flex flex-wrap gap-x-10 gap-y-2">
                {a.langs.map((l) => (
                  <li key={l.name} className="font-sans text-sm">
                    <span className="text-gray-900 dark:text-white">
                      {l.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {" "}
                      — {l.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              {...reveal(6)}
              href="#projetos"
              className={`${reveal(6).className} self-start font-press-start text-[10px] text-gray-900 underline-offset-4 hover:underline dark:text-white`}
            >
              {a.continueLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
