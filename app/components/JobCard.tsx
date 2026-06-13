import Link from "next/link";
import {
  MapPin,
  Package,
  Truck,
  Calendar,
  ChevronRight,
} from "lucide-react";

function formatValue(value: string | null | undefined) {
  if (!value) return "Not specified";
  return value.replaceAll("_", " ");
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
      className="group flex h-[440px] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
     <div className="relative h-56 shrink-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
          style={{ backgroundImage: "url('/truck-hero.png')" }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent" />

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
      </div>

      <div className="relative -mt-5 flex flex-1 flex-col rounded-t-[1.75rem] bg-white px-5 pb-5 pt-6">
        <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-slate-950">
          {job.title}
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-slate-900">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-slate-500" />
            {job.origin_city}
          </span>

          <span className="text-lg font-black text-amber-500">→</span>

          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-slate-500" />
            {job.destination_city}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-6 text-sm font-semibold text-slate-700">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Package className="h-4 w-4 text-slate-500" />
            {job.weight_kg
              ? `${Number(job.weight_kg).toLocaleString()} kg`
              : "Weight not set"}
          </span>

          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Truck className="h-4 w-4 text-slate-500" />
            <span className="truncate">
  {formatValue(job.vehicle_type)}
</span>
          </span>

          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Calendar className="h-4 w-4 text-slate-500" />
            {job.pickup_date || "Pickup date not set"}
          </span>
        </div>

       <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="max-w-[52%] rounded-full bg-slate-100 px-3 py-2 text-xs font-bold capitalize text-slate-600 line-clamp-1">
            {formatValue(job.cargo_type)}
          </span>

          <span className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition group-hover:bg-amber-300">
            View job <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}