"use client";

import Link from "next/link";
import { useRef } from "react";
import ListingCard from "./ListingCard";

type Listing = {
  id: string;
  title: string;
  city: string;
  country: string | null;
  price: number;
  rooms: number | null;
  size_sqm: number | null;
  available_from: string;
  available_to: string;
  housing_type: string | null;
  image_url: string | null;
  equipment: {
    wifi?: boolean;
    washing_machine?: boolean;
    parking?: boolean;
  } | null;
};

function formatShortDate(iso?: string) {
  if (!iso) return "—";

  const d = new Date(iso + "T00:00:00");

  return d.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
  });
}

function housingTypeLabel(v: string | null) {
  if (v === "apartment") return "Wohnung";
  if (v === "room") return "WG";
  return null;
}

export default function FeaturedListingsCarouselClient({
  listings,
}: {
  listings: Listing[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "right" ? 360 : -360,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto w-full max-w-5xl pb-12">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
          Aktuelle Inserate
        </h2>

        <Link
          href="/results"
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          Alle anzeigen →
        </Link>
      </div>

      <div className="relative mt-5 px-0 md:px-12">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-50 md:flex"
          aria-label="Vorherige Inserate"
        >
          ←
        </button>

        <div
          ref={scrollRef}
          className="
            flex gap-5 overflow-x-auto
            snap-x snap-mandatory
            scroll-smooth
            no-scrollbar
          "
        >
          {listings.map((l) => (
            <div key={l.id} className="w-[calc(100vw-48px)] max-w-[320px] shrink-0 snap-start sm:w-[340px] sm:max-w-[340px]">
              <ListingCard
                id={l.id}
                title={l.title}
                city={l.city}
                country={l.country}
                price={l.price}
                rooms={l.rooms}
                sizeSqm={l.size_sqm}
                availableFrom={formatShortDate(l.available_from)}
                availableTo={formatShortDate(l.available_to)}
                href={`/listing/${encodeURIComponent(l.id)}`}
                housingType={housingTypeLabel(l.housing_type)}
                wifi={l.equipment?.wifi ?? false}
                parking={l.equipment?.parking ?? false}
                washingMachine={l.equipment?.washing_machine ?? false}
                imageUrl={l.image_url}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-50 md:flex"
          aria-label="Weitere Inserate"
        >
          →
        </button>
      </div>
    </section>
  );
}