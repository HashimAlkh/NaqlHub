"use client";

import {
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useFormStatus } from "react-dom";
import { Bell, ChevronDown, MapPin, X } from "lucide-react";
import { createJobAlert } from "@/app/lib/jobAlerts";
import { SAUDI_CITIES } from "@/app/lib/saudiCities";

type AlertFilters = {
  origin_city: string;
  destination_city: string;
  cargo_type: string;
  vehicle_type: string;
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100";

export default function JobAlertDialog({
  initialFilters,
  returnTo,
  triggerLabel = "Create Job Alert",
}: {
  initialFilters: AlertFilters;
  returnTo: string;
  triggerLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 text-sm font-extrabold text-slate-950 shadow-sm transition hover:bg-amber-300 sm:w-auto"
      >
        <Bell className="h-4 w-4" />
        {triggerLabel}
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/55 px-4 pt-16 pb-6 backdrop-blur-sm md:items-center md:py-8"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsOpen(false);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="job-alert-title"
              className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                    <Bell className="h-3.5 w-3.5" />
                    Job Alert
                  </div>
                  <h2
                    id="job-alert-title"
                    className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950"
                  >
                    Save this search
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Adjust the criteria before saving your job alert.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                  aria-label="Close job alert form"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form action={createJobAlert} className="mt-6 grid gap-4">
                <input type="hidden" name="return_to" value={returnTo} />
                <CityAutocomplete
                  name="origin_city"
                  label="Origin city"
                  initialValue={initialFilters.origin_city}
                  placeholder="Riyadh"
                />
                <CityAutocomplete
                  name="destination_city"
                  label="Destination city"
                  initialValue={initialFilters.destination_city}
                  placeholder="Jeddah"
                />
                <AlertSelect
                  name="cargo_type"
                  label="Cargo type"
                  defaultValue={initialFilters.cargo_type}
                >
                  <option value="">Any cargo type</option>
                  <option value="heavy_equipment">Heavy equipment</option>
                  <option value="industrial_cargo">Industrial cargo</option>
                  <option value="oversized_load">Oversized load</option>
                  <option value="construction_materials">Construction materials</option>
                  <option value="containers">Containers</option>
                  <option value="other">Other</option>
                </AlertSelect>
                <AlertSelect
                  name="vehicle_type"
                  label="Vehicle type"
                  defaultValue={initialFilters.vehicle_type}
                >
                  <option value="">Any vehicle type</option>
                  <option value="lowbed_trailer">Lowbed trailer</option>
                  <option value="flatbed_trailer">Flatbed trailer</option>
                  <option value="extendable_trailer">Extendable trailer</option>
                  <option value="crane_truck">Crane truck</option>
                  <option value="container_truck">Container truck</option>
                  <option value="not_sure">Not sure</option>
                </AlertSelect>

                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <SaveAlertButton />
                </div>
              </form>
            </section>
          </div>,
          document.body
        )}
    </>
  );
}

function AlertSelect({
  children,
  defaultValue,
  label,
  name,
}: {
  children: ReactNode;
  defaultValue: string;
  label: string;
  name: string;
}) {
  return (
    <label className="block">
      <span className="ms-label">{label}</span>
      <span className="relative mt-1 block">
        <select name={name} defaultValue={defaultValue} className={`${inputClassName} appearance-none pr-11`}>
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
        />
      </span>
    </label>
  );
}

function CityAutocomplete({
  initialValue,
  label,
  name,
  placeholder,
}: {
  initialValue: string;
  label: string;
  name: string;
  placeholder: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestions = useMemo(() => {
    const query = value.trim().toLocaleLowerCase();
    if (!query) return [];

    return SAUDI_CITIES.filter((city) =>
      city.toLocaleLowerCase().includes(query)
    ).slice(0, 5);
  }, [value]);

  function selectCity(city: string) {
    setValue(city);
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
    <label className="block">
      <span className="ms-label">{label}</span>
      <span className="relative mt-1 block">
        <MapPin
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400"
        />
        <input
          name={name}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
          aria-controls={`${name}-alert-suggestions`}
          aria-expanded={isOpen && suggestions.length > 0}
          aria-activedescendant={
            activeIndex >= 0 ? `${name}-alert-suggestion-${activeIndex}` : undefined
          }
          className={`${inputClassName} pl-11`}
        />

        {isOpen && suggestions.length > 0 && (
          <ul
            id={`${name}-alert-suggestions`}
            role="listbox"
            className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg"
          >
            {suggestions.map((city, index) => (
              <li
                key={city}
                id={`${name}-alert-suggestion-${index}`}
                role="option"
                aria-selected={index === activeIndex}
              >
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectCity(city);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-amber-50 ${
                    index === activeIndex ? "bg-amber-50" : ""
                  }`}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-amber-500" />
                  {city}
                </button>
              </li>
            ))}
          </ul>
        )}
      </span>
    </label>
  );
}

function SaveAlertButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <Bell className="h-4 w-4" />
      {pending ? "Saving alert..." : "Save Job Alert"}
    </button>
  );
}
