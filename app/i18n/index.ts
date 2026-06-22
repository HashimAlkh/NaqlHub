import { ar } from "./ar";
import { en } from "./en";

export const LOCALE_COOKIE = "naqlhub-locale";
export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

const translations = { en, ar };

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "ar";
}

export function getTranslations(locale: Locale) {
  return translations[locale];
}
