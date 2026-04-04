import en from "./en.json";
import fr from "./fr.json";
import es from "./es.json";

export const translations = {
  en,
  fr,
  es,
} as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof en;

export function getTranslation(locale: Locale) {
  return translations[locale] || translations.en;
}

export const defaultLocale: Locale = "en";

export const supportedLocales: { code: Locale; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français", 
  es: "Español",
};