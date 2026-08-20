"use client";
import Image from "next/image";
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

/* Arquivos em /public. Se faltar ou falhar, cai nas iniciais. */
const LOGOS = {
  birdly: "/birdly_logo.jpeg",
  "nova-infortel": "/icon.png",
  synergys: "/logo_synergys.png",
  silosys: "/silosys_logo.png",
  "dg-revestimentos": "/dg_logo.png",
};

function Logo({ slug, name, className = "" }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden border-2 border-gray-900 bg-white dark:border-white ${className}`}
    >
      {failed || !LOGOS[slug] ? (
        <span className="font-press-start text-xs text-red-600 dark:text-red-400">
          {initials}
        </span>
      ) : (
        <Image
          src={LOGOS[slug]}
          alt={`Logo ${name}`}
          width={160}
          height={160}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

const num = (i) => String(i + 1).padStart(2, "0");

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

/* Main quest: linha larga, duas colunas. */
function MainQuest({ p, t, index, inView }) {
  return (
    <Reveal
      as="article"
      inView={inView}
      delay={1000 + index * 150}
      className="grid gap-8 border-t-2 border-gray-900 py-12 dark:border-white md:grid-cols-[260px_1fr] md:gap-16"
    >
      {/* meta */}
      <div className="flex flex-row items-start gap-5 md:flex-col md:gap-6">
        <Logo
          slug={p.slug}
          name={p.name}
          className="h-20 w-20 md:h-28 md:w-28"
        />
        <dl className="grid gap-4 font-sans text-sm">
          <div>
            <dt className="font-press-start text-[8px] text-gray-500 dark:text-gray-400">
              {t.statusLabel}
            </dt>
            <dd className="mt-1 text-gray-900 dark:text-white">{p.status}</dd>
          </div>
          <div>
            <dt className="font-press-start text-[8px] text-gray-500 dark:text-gray-400">
              {t.stackLabel}
            </dt>
            <dd className="mt-1 leading-relaxed text-gray-600 dark:text-gray-400">
              {p.stack.join(" · ")}
            </dd>
          </div>
        </dl>
      </div>

      {/* conteúdo */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-4">
          <span className="font-press-start text-[10px] text-red-600 dark:text-red-400">
            {num(index)}
          </span>
          <h3 className="font-press-start text-xl text-gray-900 dark:text-white sm:text-2xl md:text-3xl">
            {p.name}
          </h3>
        </div>
        <p className="mt-2 font-sans text-sm text-gray-500 dark:text-gray-400">
          {p.type}
        </p>
        <p className="mt-6 max-w-[65ch] font-sans text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg">
          {p.desc}
        </p>
        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-fit items-center gap-3 border-2 border-gray-900 px-5 py-3 font-press-start text-[9px] text-gray-900 transition-colors hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900"
          >
            {t.reward}
          </a>
        )}
      </div>
    </Reveal>
  );
}

/* Side quest: linha compacta. */
function SideQuest({ p, t, index, inView }) {
  const Row = p.url ? "a" : "div";
  const props = p.url
    ? { href: p.url, target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Reveal as="li" inView={inView} delay={1000 + index * 150}>
      <Row
        {...props}
        className="group grid gap-4 border-t border-gray-200 py-6 dark:border-gray-800 sm:grid-cols-[auto_auto_1fr_auto] sm:items-center sm:gap-8"
      >
        <span className="hidden font-press-start text-[10px] text-red-600 dark:text-red-400 sm:block">
          {num(index)}
        </span>
        <div className="flex items-center gap-4 sm:w-56">
          <Logo slug={p.slug} name={p.name} className="h-12 w-12" />
          <div className="min-w-0">
            <h3 className="truncate font-press-start text-[11px] text-gray-900 dark:text-white">
              {p.name}
            </h3>
            <p className="mt-1 font-sans text-xs text-gray-500 dark:text-gray-400">
              {p.type}
            </p>
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-sans text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {p.desc}
          </p>
          <p className="mt-2 font-sans text-xs text-gray-500 dark:text-gray-400">
            {p.stack.join(" · ")}
            <span className="mx-2 text-gray-300 dark:text-gray-700">|</span>
            {p.status}
          </p>
        </div>
        <span className="font-press-start text-[9px] text-gray-900 underline-offset-4 group-hover:underline dark:text-white">
          {p.url ? "→" : ""}
        </span>
      </Row>
    </Reveal>
  );
}

export default function Projects() {
  const { t } = useLanguage();
  const pj = t.projects;
  const [ref, inView] = useInView();

  const featured = pj.items.filter((p) => p.featured);
  const side = pj.items.filter((p) => !p.featured);

  return (
    <section
      id="projetos"
      ref={ref}
      className="relative w-full border-t border-gray-200 bg-white px-[6vw] py-24 dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-1/2 z-30 -translate-y-1/2 bg-gray-900 py-6 text-center font-press-start text-lg text-white dark:bg-white dark:text-gray-900 sm:text-2xl ${
          inView ? "level-banner-run" : "opacity-0"
        }`}
      >
        {pj.level}
      </div>

      <div className="mx-auto max-w-5xl">
        <Reveal inView={inView} delay={900}>
          <p className="font-press-start text-[10px] tracking-[0.3em] text-red-600 dark:text-red-400">
            {pj.level}
          </p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-press-start text-2xl text-gray-900 dark:text-white sm:text-4xl">
              {pj.title}
            </h2>
            <p className="max-w-[40ch] font-sans text-base text-gray-600 dark:text-gray-400">
              {pj.intro}
            </p>
          </div>
        </Reveal>

        <div className="mt-16">
          <Reveal
            inView={inView}
            delay={950}
            as="p"
            className="mb-2 font-press-start text-[9px] text-gray-500 dark:text-gray-400"
          >
            {pj.featured}
          </Reveal>
          {featured.map((p, i) => (
            <MainQuest key={p.slug} p={p} t={pj} index={i} inView={inView} />
          ))}
        </div>

        <div className="mt-16">
          <Reveal
            inView={inView}
            delay={1300}
            as="p"
            className="mb-2 font-press-start text-[9px] text-gray-500 dark:text-gray-400"
          >
            {pj.side}
          </Reveal>
          <ul className="border-b border-gray-200 dark:border-gray-800">
            {side.map((p, i) => (
              <SideQuest
                key={p.slug}
                p={p}
                t={pj}
                index={featured.length + i}
                inView={inView}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
