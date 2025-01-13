"use client";
import { useState, useEffect, useMemo } from "react";

export default function NameCenter() {
  const palavras = useMemo(() => ["Criativo", "Frontend", "Backend"], []);
  const [indexPalavra, setIndexPalavra] = useState(0);
  const [Item, setItem] = useState(palavras[0]);
  const [adicionando, setAdicionando] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });


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

  useEffect(() => {
    const handleMouseMove = (event) => {
      const position = { x: event.clientX, y: event.clientY };
      setMousePos(position);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="h-[75vh] w-full flex flex-col justify-center items-center relative">
      <p className="text-[7vw] font-bold">RAFAEL COELHO</p>
      <p className="text-[5vw] font-extralight -mt-[3vh]">
        Desenvolvedor <span className="text-red-600">{Item}</span>
      </p>

      {/* Bola que segue o mouse */}
      <div
        className="w-10 h-10 bg-blue-500 rounded-full fixed pointer-events-none -z-10 left-0 top-0 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePos.x - 15}px, ${mousePos.y - 10}px)`,
        }}
      ></div>
    </section>
  );
}
