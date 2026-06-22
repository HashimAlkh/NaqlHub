import Link from "next/link";
import { Calendar, MapPin, Package, Weight } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import { formatWeight } from "@/app/lib/jobFormatters";
import { getTranslations, type Locale } from "@/app/i18n";

export type JobCardJob = {
  id: string;
  title: string | null;
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

function formatValue(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  return value.replaceAll("_", " ");
}

function formatDate(value: string | null | undefined, locale: Locale, fallback: string) {
  if (!value) return fallback;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const urgencyConfig: Record<string, { label: string; className: string }> = {
  urgent: { label: "URGENT", className: "bg-red-100 text-red-600" },
  hot: { label: "HOT", className: "bg-orange-100 text-orange-600" },
  new: { label: "NEW", className: "bg-green-100 text-green-700" },
  normal: { label: "NORMAL", className: "bg-slate-100 text-slate-600" },
};

const vehicleLabelKeys: Record<string, "lowbed" | "flatbed" | "extendable"> = {
  lowbed_trailer: "lowbed",
  flatbed_trailer: "flatbed",
  extendable_trailer: "extendable",
};

const cargoLabelKeys: Record<
  string,
  "heavyEquipment" | "industrial" | "oversized" | "construction"
> = {
  heavy_equipment: "heavyEquipment",
  industrial_cargo: "industrial",
  oversized_load: "oversized",
  construction_materials: "construction",
};

function formatVehicle(
  value: string | null | undefined,
  fallback: string,
  labels: ReturnType<typeof getTranslations>["types"]
) {
  if (!value) return fallback;
  const key = vehicleLabelKeys[value];
  return key ? labels[key] : formatValue(value, fallback);
}

function formatCargo(
  value: string | null | undefined,
  fallback: string,
  labels: ReturnType<typeof getTranslations>["types"]
) {
  if (!value) return fallback;
  const key = cargoLabelKeys[value];
  return key ? labels[key] : formatValue(value, fallback);
}

function TrailerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M2.5 5.5h11.5v9H2.5z" />
      <path d="M14 10h3.5l3 3v1.5H14" />
      <path d="M2.5 14.5h18" />
      <circle cx="6" cy="17" r="1.5" />
      <circle cx="17.5" cy="17" r="1.5" />
    </svg>
  );
}

export default function JobCard({
  job,
  isFavorited = false,
  locale = "en",
}: {
  job: JobCardJob;
  isFavorited?: boolean;
  locale?: Locale;
}) {
  const t = getTranslations(locale);
  const tag = (job.urgency || "new").toLowerCase();
  const urgencyLabels: Record<string, string> = {
    urgent: t.types.urgent,
    hot: t.types.urgent,
    new: t.types.new,
    normal: t.types.normal,
  };
  const { className } = urgencyConfig[tag] ?? urgencyConfig.normal;
  const label = urgencyLabels[tag] ?? urgencyLabels.normal;

  return (
    <article className="group relative flex h-[400px] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/jobs/${job.id}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${job.title || "transport job"}`}
      />

      <div className="relative h-56 shrink-0 overflow-visible">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url('${job.image_urls?.[0] || "/truck-hero.png"}')`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/5 to-transparent" />

        <div className="absolute left-4 top-4">
          <span
            className={`rounded-full border border-white/70 px-3 py-1.5 text-xs font-extrabold shadow-sm ${className}`}
          >
            {label}
          </span>
        </div>

        <div className="absolute right-4 top-4 z-20">
          <FavoriteButton
            jobId={job.id}
            initialFavorited={isFavorited}
            variant="bare"
            className="h-9 w-9"
          />
        </div>

        <div className="absolute bottom-8 right-4 z-10 rounded-full bg-white/95 px-2.5 py-1 text-sm font-extrabold text-slate-900 shadow-md backdrop-blur">
          {job.budget_sar
            ? `SAR ${Number(job.budget_sar).toLocaleString("en-US")}`
            : t.common.open}
        </div>
      </div>

      <div className="relative -mt-6 flex flex-1 flex-col rounded-t-[1.75rem] bg-white px-5 pb-5 pt-4">
        <h3 className="min-h-[72px] line-clamp-2 text-xl font-extrabold leading-tight text-slate-950">
          {job.title}
        </h3>

        <div className=" flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Calendar className="h-4 w-4 shrink-0 text-slate-500" />
          {formatDate(job.pickup_date, locale, t.jobs.pickupDateNotSet)}
        </div>

        <div className="mt-2 mb-3 flex h-[28px] items-center gap-3 text-sm font-bold text-slate-900">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="truncate">{job.origin_city}</span>
          </span>

          <span className="shrink-0 text-lg font-black text-amber-500">→</span>

          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="truncate">{job.destination_city}</span>
          </span>
        </div>

        <div className="mt-auto border-t border-slate-100 ">
          <div className="grid min-h-12 grid-cols-3 divide-x divide-slate-100 text-[11px] font-semibold leading-4 text-slate-700">
            <span className="flex min-w-0 items-center justify-center gap-1.5 pr-2 pb-2">
              <TrailerIcon className="h-4 w-4 shrink-1 text-slate-600" />
              <span className="min-w-0 break-words">{formatVehicle(job.vehicle_type, t.common.notSpecified, t.types)}</span>
            </span>

            <span className="flex min-w-0 items-center justify-center gap-1.5 px-1 pb-2">
              <Weight className="h-4 w-4 shrink-1 text-slate-500" />
              <span className="min-w-0 break-words">{formatWeight(job.weight_kg, t.jobs.weightNotSet)}</span>
            </span>

            <span className="flex min-w-0 items-center justify-center gap-1.5 pl-2 pb-2">
              <Package className="h-4 w-4 shrink-1 text-slate-500" />
              <span className="min-w-0 break-words">{formatCargo(job.cargo_type, t.common.notSpecified, t.types)}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
