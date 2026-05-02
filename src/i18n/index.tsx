"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Lang, Translations } from "./types";
import { es } from "./es";
import { en } from "./en";

const dictionaries: Record<Lang, Translations> = { es, en };

interface LangContextType {
  lang: Lang;
  t: Translations;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const LangContext = createContext<LangContextType>({
  lang: "es",
  t: es,
  setLang: () => {},
  toggle: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  const t = dictionaries[lang];
  const toggle = () => setLang(lang === "es" ? "en" : "es");

  return (
    <LangContext.Provider value={{ lang, t, setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
