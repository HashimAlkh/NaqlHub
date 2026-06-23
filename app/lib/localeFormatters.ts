import type { Locale } from "@/app/i18n";

export function formatGregorianDate(
  value: string | null | undefined,
  locale: Locale,
  fallback: string
) {
  if (!value) return fallback;

  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(locale === "ar" ? "ar-SA-u-ca-gregory" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getRouteArrow(locale: Locale) {
  return locale === "ar" ? "←" : "→";
}
