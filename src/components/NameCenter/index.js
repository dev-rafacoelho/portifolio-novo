"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";

const NOME = "RAFAEL COELHO";

function useTypewriter(words) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setText("");
    setDeleting(false);
    setIndex(0);
  }, [words]);

  useEffect(() => {
    const word = words[index];
    let delay = deleting ? 45 : 110;

    if (!deleting && text === word) delay = 1600; // pausa no fim da palavra
    else if (deleting && text === "") delay = 350; // pausa antes da proxima

    const timer = setTimeout(() => {
      if (!deleting && text === word) return setDeleting(true);
      if (deleting && text === "") {
        setDeleting(false);
        return setIndex((i) => (i + 1) % words.length);
      }
      setText(
        deleting
          ? word.slice(0, text.length - 1)
          : word.slice(0, text.length + 1)
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, words]);

  return text;
}

export default function NameCenter() {
  const { t } = useLanguage();
  const item = useTypewriter(t.words);

  return (
    <section className="relative z-10 flex h-[calc(100vh-12vh)] w-full flex-col items-center justify-center px-4 text-center">
      <p className="mb-6 font-press-start text-[10px] uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400 sm:text-xs">
        {t.ready}
      </p>

      <h1
        aria-label={NOME}
        className="font-press-start text-[7vw] leading-none text-gray-900 dark:text-white sm:text-[5vw]"
      >
        {NOME.split("").map((ch, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="letter-appear inline-block"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </h1>

      <p className="mt-6 font-press-start text-[3.2vw] text-gray-700 dark:text-gray-300 sm:text-[2.2vw]">
        {t.role}{" "}
        <span className="text-red-600 dark:text-red-400">{item}</span>
        <span
          aria-hidden="true"
          className="cursor-blink ml-[0.15em] inline-block h-[1.25em] w-[0.12em] translate-y-[0.22em] bg-red-600 dark:bg-red-400"
        />
      </p>
    </section>
  );
}
