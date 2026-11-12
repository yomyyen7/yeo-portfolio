"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getContent, type Content, type Lang } from "@/lib/data";

type I18n = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Contenu du portfolio dans la langue active. */
  c: Content;
  /** Choisit la chaîne correspondant à la langue active. */
  tr: (fr: string, en: string) => string;
  locale: string;
};

const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    let initial: Lang = navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
    try {
      const saved = localStorage.getItem("yeoos-lang");
      if (saved === "fr" || saved === "en") initial = saved;
    } catch {
      /* stockage indisponible : on garde la langue du navigateur */
    }
    setLangState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem("yeoos-lang", next);
    } catch {
      /* le choix ne sera simplement pas mémorisé */
    }
  }, []);

  const value = useMemo<I18n>(
    () => ({
      lang,
      setLang,
      c: getContent(lang),
      tr: (fr, en) => (lang === "fr" ? fr : en),
      locale: lang === "fr" ? "fr-FR" : "en-GB",
    }),
    [lang, setLang]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n doit être utilisé dans <I18nProvider>");
  return v;
}
