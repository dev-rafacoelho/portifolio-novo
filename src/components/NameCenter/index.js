"use client";
import { useState, useEffect, useMemo } from "react";

export default function NameCenter() {
  const palavras = useMemo(() => ["Criativo", "Frontend", "Backend"], []);
  const [indexPalavra, setIndexPalavra] = useState(0);
  const [Item, setItem] = useState(palavras[0]);
  const [adicionando, setAdicionando] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setItem((prevItem) => {
        if (!adicionando) {
          if (prevItem.length > 0) {
            return prevItem.slice(0, -1);
          } else {
            setAdicionando(true);
            return prevItem;
          }
        } else {
          const palavraAtual = palavras[indexPalavra];
          if (prevItem.length < palavraAtual.length) {
            return palavraAtual.slice(0, prevItem.length + 1);
          } else {
            setAdicionando(false);
            setIndexPalavra((prevIndex) => (prevIndex + 1) % palavras.length);
            return prevItem;
          }
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, [adicionando, indexPalavra, palavras]);

  return (
    <section className="h-[75vh] w-full flex flex-col justify-center items-center">
      <p className="text-[5vw] font-press-start text-gray-900 dark:text-white">
        RAFAEL COELHO
      </p>
      <p className="text-[3vw] font-press-start text-gray-700 dark:text-gray-300">
        Desenvolvedor{" "}
        <span className="text-red-600 dark:text-red-400">{Item}</span>
      </p>
    </section>
  );
}
