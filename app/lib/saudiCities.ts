import type { Locale } from "@/app/i18n";

export type SaudiCity = {
  en: string;
  ar: string;
};

export const SAUDI_CITIES: readonly SaudiCity[] = [
  { en: "Riyadh", ar: "الرياض" },
  { en: "Jeddah", ar: "جدة" },
  { en: "Dammam", ar: "الدمام" },
  { en: "Khobar", ar: "الخبر" },
  { en: "Dhahran", ar: "الظهران" },
  { en: "Makkah", ar: "مكة" },
  { en: "Madinah", ar: "المدينة المنورة" },
  { en: "Taif", ar: "الطائف" },
  { en: "Tabuk", ar: "تبوك" },
  { en: "Abha", ar: "أبها" },
  { en: "Khamis Mushait", ar: "خميس مشيط" },
  { en: "Jazan", ar: "جازان" },
  { en: "Najran", ar: "نجران" },
  { en: "Hail", ar: "حائل" },
  { en: "Buraydah", ar: "بريدة" },
  { en: "Unaizah", ar: "عنيزة" },
  { en: "Jubail", ar: "الجبيل" },
  { en: "Yanbu", ar: "ينبع" },
  { en: "Al Ahsa", ar: "الأحساء" },
  { en: "Al Qassim", ar: "القصيم" },
  { en: "AlUla", ar: "العلا" },
  { en: "Neom", ar: "نيوم" },
  { en: "Ras Al Khair", ar: "رأس الخير" },
  { en: "King Abdullah Economic City", ar: "مدينة الملك عبدالله الاقتصادية" },
  { en: "Rabigh", ar: "رابغ" },
  { en: "Qatif", ar: "القطيف" },
];

function findSaudiCity(value: string) {
  const normalizedValue = value.trim().toLocaleLowerCase();
  return SAUDI_CITIES.find(
    (city) =>
      city.en.toLocaleLowerCase() === normalizedValue || city.ar === value.trim()
  );
}

export function normalizeSaudiCity(value: string) {
  const trimmedValue = value.trim();
  return findSaudiCity(trimmedValue)?.en || trimmedValue;
}

export function getSaudiCityName(value: string | null | undefined, locale: Locale) {
  if (!value) return value || "";

  const city = findSaudiCity(value);
  return city ? city[locale] : value;
}

export function findSaudiCities(query: string, locale: Locale) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [];

  return SAUDI_CITIES.filter((city) =>
    city[locale].toLocaleLowerCase().includes(normalizedQuery) ||
    city.en.toLocaleLowerCase().includes(normalizedQuery)
  ).slice(0, 5);
}
