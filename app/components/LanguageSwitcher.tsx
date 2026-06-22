"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/app/i18n";

function localeHref(pathname: string, searchParams: URLSearchParams, locale: Locale) {
  const params = new URLSearchParams(searchParams);
  params.set("lang", locale);
  return `${pathname}?${params.toString()}`;
}

export default function LanguageSwitcher({
  locale,
  variant = "default",
}: {
  locale: Locale;
  variant?: "default" | "hero";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams.toString());

  function switchLocale(nextLocale: Locale) {
    window.location.href = localeHref(pathname, currentParams, nextLocale);
  }

  return (
    <div
      className={`inline-flex items-center rounded-lg p-0.5 text-[11px] font-extrabold ${
        variant === "hero"
          ? "border border-white/20 bg-slate-950/45 text-white/70 shadow-sm backdrop-blur"
          : "border border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={`rounded-md px-1.5 py-1 transition ${
          locale === "en"
            ? "bg-amber-400 text-slate-950 shadow-sm"
            : variant === "hero"
              ? "hover:text-white"
              : "hover:text-slate-900"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchLocale("ar")}
        className={`rounded-md px-1.5 py-1 transition ${
          locale === "ar"
            ? "bg-amber-400 text-slate-950 shadow-sm"
            : variant === "hero"
              ? "hover:text-white"
              : "hover:text-slate-900"
        }`}
        aria-label="التبديل إلى العربية"
      >
        AR
      </button>
    </div>
  );
}
