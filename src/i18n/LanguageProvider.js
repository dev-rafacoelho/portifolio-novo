"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { dictionary, LANGS } from "./dictionary";

const LanguageContext = createContext({
  lang: "pt",
  setLang: () => {},
  t: dictionary.pt,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("pt");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (LANGS.includes(saved)) {
      setLangState(saved);
    } else if (navigator.language && !navigator.language.startsWith("pt")) {
      setLangState("en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = (l) => {
    if (!LANGS.includes(l)) return;
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dictionary[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
