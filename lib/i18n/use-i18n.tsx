"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { translations, Locale, TranslationKey, defaultLocale, supportedLocales } from "./index";

type TranslationData = typeof translations.en;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
  supportedLocales: typeof supportedLocales;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const saved = localStorage.getItem("skinminder-locale") as Locale;
    if (saved && translations[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("skinminder-locale", newLocale);
  };

  const t = (key: TranslationKey, params?: Record<string, string>): string => {
    const translation = translations[locale]?.[key] || translations[defaultLocale]?.[key] || key;
    let text: string = typeof translation === 'string' ? translation : key;
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, v);
      });
    }
    
    return text;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, supportedLocales }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}