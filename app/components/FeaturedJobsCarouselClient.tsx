"use client";

import Link from "next/link";
import { useRef } from "react";
import JobCard from "./JobCard";
import { getTranslations, type Locale } from "@/app/i18n";

type TransportJob = {
  id: string;
  title: string;
  cargo_type: string | null;
  vehicle_type: string | null;
  weight_kg: number | null;
  budget_sar: number | null;
  origin_city: string | null;
  destination_city: string | null;
  pickup_date: string | null;
  urgency: string | null;
  image_urls: string[] | null;
};

export default function FeaturedJobsCarouselClient({
  jobs,
  favoriteJobIds = [],
  locale = "en",
}: {
  jobs: TransportJob[];
  favoriteJobIds?: string[];
  locale?: Locale;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const favoriteSet = new Set(favoriteJobIds);
  const t = getTranslations(locale).home;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "right" ? 420 : -420,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 lg:text-2xl">
          {t.browseOpenJobs}
        </h2>

        <Link
          href="/jobs"
          className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          {t.viewAll} →
        </Link>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-50 lg:flex"
          aria-label={t.previousJobs}
        >
          ←
        </button>

        <div
          ref={scrollRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {jobs.map((job) => (
            <div
              key={job.id}
              className="w-[calc(100vw-40px)] max-w-[360px] shrink-0 snap-start sm:w-[360px] lg:w-[360px]"
            >
              <JobCard
                job={job}
                isFavorited={favoriteSet.has(job.id)}
                locale={locale}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-50 lg:flex"
          aria-label={t.moreJobs}
        >
          →
        </button>
      </div>
    </section>
  );
}
