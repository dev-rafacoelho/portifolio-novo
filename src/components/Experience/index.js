"use client";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";

function useInView(threshold = 0.15) {
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

function Reveal({ inView, delay, as: Tag = "div", className = "", children }) {
  return (
    <Tag
      className={`transition-all duration-700 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* Troféu em pixel art (SVG 12x12). */
function Trophy({ active }) {
  const c = active ? "#dc2626" : "currentColor";
  const rows = [
    "..XXXXXXXX..",
    ".X.XXXXXX.X.",
    ".X.XXXXXX.X.",
    "..XXXXXXXX..",
    "...XXXXXX...",
    "....XXXX....",
    ".....XX.....",
    ".....XX.....",
    "....XXXX....",
    "...XXXXXX...",
    "...XXXXXX...",
    "............",
  ];
  return (
    <svg
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      className="h-8 w-8 text-gray-900 dark:text-white"
      aria-hidden="true"
    >
      {rows.flatMap((row, y) =>
        row.split("").map((ch, x) =>
          ch === "X" ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={c} />
          ) : null
        )
      )}
    </svg>
  );
}

function Job({ job, t, index, inView, last }) {
  return (
    <Reveal
      as="li"
      inView={inView}
      delay={1000 + index * 200}
      className="relative grid gap-6 pb-14 pl-14 md:grid-cols-[200px_1fr] md:gap-10"
    >
      {/* linha do tempo */}
      {!last && (
        <span
          aria-hidden="true"
          className="absolute left-4 top-10 bottom-0 w-px bg-gray-300 dark:bg-gray-700"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center bg-white dark:bg-gray-950"
      >
        <Trophy active={job.current} />
      </span>

      {/* coluna esquerda: período */}
      <div className="font-sans text-sm">
        <p className="font-press-start text-[8px] text-gray-500 dark:text-gray-400">
          {job.current ? t.current : t.unlocked}
        </p>
        <p className="mt-2 text-gray-900 dark:text-white">{job.period}</p>
      </div>

      {/* coluna direita */}
      <div>
        <h3 className="font-press-start text-sm text-gray-900 dark:text-white sm:text-base">
          {job.company}
        </h3>
        <p className="mt-2 font-sans text-base text-red-600 dark:text-red-400">
          {job.role}
        </p>
        <p className="mt-4 max-w-[60ch] font-sans text-base leading-relaxed text-gray-700 dark:text-gray-300">
          {job.summary}
        </p>
        <ul className="mt-4 max-w-[60ch] space-y-2 font-sans text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {job.highlights.map((h) => (
            <li key={h} className="flex gap-3">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 bg-gray-900 dark:bg-white" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-2">
          {job.badges.map((b) => (
            <li
              key={b}
              className="border border-gray-900 px-2 py-1 font-press-start text-[7px] text-gray-900 dark:border-white dark:text-white"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function Progress({ value, label }) {
  const blocks = 10;
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-[3px]" role="img" aria-label={`${label} ${value}%`}>
        {Array.from({ length: blocks }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-3 ${
              i < value / 10
                ? "bg-gray-900 dark:bg-white"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          />
        ))}
      </div>
      <span className="font-press-start text-[8px] text-gray-500 dark:text-gray-400">
        {value}%
      </span>
    </div>
  );
}

export default function Experience() {
  const { t } = useLanguage();
  const ex = t.experience;
  const [ref, inView] = useInView();

  return (
    <section
      id="experiencia"
      ref={ref}
      className="relative w-full border-t border-gray-200 bg-gray-50 px-[6vw] py-24 dark:border-gray-800 dark:bg-gray-950"
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-1/2 z-30 -translate-y-1/2 bg-gray-900 py-6 text-center font-press-start text-lg text-white dark:bg-white dark:text-gray-900 sm:text-2xl ${
          inView ? "level-banner-run" : "opacity-0"
        }`}
      >
        {ex.level}
      </div>

      <div className="mx-auto max-w-5xl">
        <Reveal inView={inView} delay={900}>
          <p className="font-press-start text-[10px] tracking-[0.3em] text-red-600 dark:text-red-400">
            {ex.level}
          </p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-press-start text-2xl text-gray-900 dark:text-white sm:text-4xl">
              {ex.title}
            </h2>
            <p className="max-w-[40ch] font-sans text-base text-gray-600 dark:text-gray-400">
              {ex.intro}
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_280px] lg:gap-24">
          {/* timeline */}
          <ol>
            {ex.jobs.map((job, i) => (
              <Job
                key={job.company}
                job={job}
                t={ex}
                index={i}
                inView={inView}
                last={i === ex.jobs.length - 1}
              />
            ))}
          </ol>

          {/* skill tree */}
          <Reveal inView={inView} delay={1400} as="aside">
            <p className="font-press-start text-[9px] text-gray-500 dark:text-gray-400">
              {ex.skillTree}
            </p>
            <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              {ex.education.map((e) => (
                <li key={e.school} className="py-5">
                  <p className="font-press-start text-[10px] text-gray-900 dark:text-white">
                    {e.course}
                  </p>
                  <p className="mt-2 font-sans text-sm text-gray-700 dark:text-gray-300">
                    {e.school}
                  </p>
                  <p className="mt-1 font-sans text-xs text-gray-500 dark:text-gray-400">
                    {e.detail}
                  </p>
                  <div className="mt-3">
                    <Progress value={e.progress} label={ex.progressLabel} />
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal inView={inView} delay={1600} className="mt-12">
          <a
            href="#contato"
            className="font-press-start text-[10px] text-gray-900 underline-offset-4 hover:underline dark:text-white"
          >
            {ex.continueLabel}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
