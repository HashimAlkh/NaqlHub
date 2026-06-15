import Link from "next/link";
import { MapPin, Package, Truck, Calendar } from "lucide-react";

function formatValue(value: string | null | undefined) {
  if (!value) return "Not specified";
  return value.replaceAll("_", " ");
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Pickup date not set";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
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

export default function JobCard({ job }: { job: any }) {
  const tag = (job.urgency || "new").toLowerCase();
  const { label, className } = urgencyConfig[tag] ?? urgencyConfig.normal;

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex h-[450px] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
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

        <div className="absolute right-4 top-4 rounded-full bg-white/95 px-4 py-1.5 text-sm font-extrabold text-emerald-700 shadow-sm">
          {job.budget_sar
            ? `SAR ${Number(job.budget_sar).toLocaleString()}`
            : "Open"}
        </div>

        <div className="absolute bottom-5 left-4 z-10">
          <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold capitalize text-slate-700 shadow-md backdrop-blur">
            {formatValue(job.cargo_type)}
          </span>
        </div>
      </div>

      <div className="relative -mt-6 flex flex-1 flex-col rounded-t-[1.75rem] bg-white px-5 pb-5 pt-6">
        <h3 className="min-h-[72px] line-clamp-2 text-xl font-extrabold leading-tight text-slate-950">
          {job.title}
        </h3>

        <div className=" flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Calendar className="h-4 w-4 shrink-0 text-slate-500" />
          {formatDate(job.pickup_date)}
        </div>

        <div className="mt-4 flex h-[28px] items-center gap-3 text-sm font-bold text-slate-900">
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

        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-slate-700">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Package className="h-4 w-4 shrink-0 text-slate-500" />
              {job.weight_kg
                ? `${Number(job.weight_kg).toLocaleString()} kg`
                : "Weight not set"}
            </span>

            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Truck className="h-4 w-4 shrink-0 text-slate-500" />
              <span className="truncate">{formatValue(job.vehicle_type)}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}