"use client";

import { type KeyboardEvent, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import type { Locale } from "@/app/i18n";
import {
  findSaudiCities,
  normalizeSaudiCity,
  type SaudiCity,
} from "@/app/lib/saudiCities";

export default function HomeCityAutocomplete({
  locale,
  name,
  placeholder,
  variant,
}: {
  locale: Locale;
  name: "origin" | "destination";
  placeholder: string;
  variant: "mobile" | "desktop";
}) {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const isArabic = locale === "ar";
  const suggestions = useMemo(
    () => (value.trim().length >= 2 ? findSaudiCities(value, locale) : []),
    [locale, value]
  );

  function selectCity(city: SaudiCity) {
    setValue(city[locale]);
    setActiveIndex(-1);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (!suggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1
      );
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectCity(suggestions[activeIndex]);
    }
  }

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`relative flex items-center rounded-xl border border-white/10 bg-[#07152b] ${
        variant === "mobile" ? "h-10 gap-3 px-4" : "h-[42px] gap-2 px-3"
      }`}
    >
      <MapPin
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-amber-400/80"
      />
      <input type="hidden" name={name} value={normalizeSaudiCity(value)} />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        onChange={(event) => {
          setValue(event.target.value);
          setActiveIndex(-1);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-controls={`${name}-home-suggestions`}
        aria-expanded={isOpen && suggestions.length > 0}
        aria-activedescendant={
          activeIndex >= 0 ? `${name}-home-suggestion-${activeIndex}` : undefined
        }
        className={`w-full bg-transparent text-sm outline-none ${
          variant === "desktop" ? "font-medium" : ""
        } ${
          isArabic
            ? "text-right text-white placeholder:text-slate-400"
            : "text-white placeholder:text-slate-400"
        }`}
      />

      {isOpen && suggestions.length > 0 && (
        <ul
          id={`${name}-home-suggestions`}
          role="listbox"
          className={`absolute left-0 right-0 top-full z-50 mt-2 w-full max-h-52 overflow-y-auto rounded-xl border border-slate-700 bg-[#0c1d35] p-1 shadow-xl ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {suggestions.map((city, index) => (
            <li
              key={city.en}
              id={`${name}-home-suggestion-${index}`}
              role="option"
              aria-selected={index === activeIndex}
            >
              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectCity(city);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 text-sm font-semibold text-white transition hover:bg-white/10 ${
                  variant === "mobile" ? "min-h-11 py-2.5" : "min-h-9 py-2"
                } ${
                  isArabic ? "justify-end" : ""
                } ${index === activeIndex ? "bg-white/10" : ""}`}
              >
                <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
                {city[locale]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
