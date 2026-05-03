import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "kz" | "en";

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (kz: string, en: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "aiubt.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("kz");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as Lang | null;
    if (stored === "kz" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (kz: string, en: string) => (lang === "kz" ? kz : en);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLanguage must be inside I18nProvider");
  return ctx;
}

/** Pick KZ/EN field from a record by suffix. */
export function pick<T extends Record<string, any>>(row: T | null | undefined, base: string, lang: Lang): string {
  if (!row) return "";
  return (row[`${base}_${lang}`] ?? row[`${base}_en`] ?? row[`${base}_kz`] ?? "") as string;
}
