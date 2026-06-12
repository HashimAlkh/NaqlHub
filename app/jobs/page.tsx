import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import SiteHeader from "@/app/components/SiteHeader";
import Link from "next/link";
import {
  Search,
  MapPin,
  Package,
  Truck,
  Calendar,
  ArrowRight,
} from "lucide-react";

function formatValue(value: string | null | undefined) {
  if (!value) return "Not specified";
  return value.replaceAll("_", " ");
}

function pick(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const origin = pick(sp, "origin").trim();
  const destination = pick(sp, "destination").trim();
  const cargoType = pick(sp, "cargo_type").trim();
  const vehicleType = pick(sp, "vehicle_type").trim();

  let query = supabaseAdmin
    .from("transport_jobs")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (origin) query = query.ilike("origin_city", `%${origin}%`);
  if (destination) query = query.ilike("destination_city", `%${destination}%`);
  if (cargoType) query = query.eq("cargo_type", cargoType);
  if (vehicleType) query = query.eq("vehicle_type", vehicleType);

  const { data: jobs } = await query;
  const jobCount = jobs?.length || 0;

  const hasRouteFilter = !!(origin || destination);

  const subtitle = hasRouteFilter
    ? `Results for ${origin || "Anywhere"} → ${destination || "Anywhere"}`
    : "All approved transport jobs";

  const homeQuery = new URLSearchParams();
  if (origin) homeQuery.set("origin", origin);
  if (destination) homeQuery.set("destination", destination);
  if (cargoType) homeQuery.set("cargo_type", cargoType);
  if (vehicleType) homeQuery.set("vehicle_type", vehicleType);

  const homeSearchHref = homeQuery.toString() ? `/?${homeQuery}` : "/";

  return (
    <main className="min-h-screen bg-[#f2f3f5] text-slate-900">
      <SiteHeader sticky />

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 lg:px-10 lg:py-10">
        {/* Header */}
<div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-slate-950">
      Transport jobs
    </h1>

    <p className="mt-2 text-base text-slate-600">
      {subtitle}
    </p>

    <p className="mt-2 text-sm text-slate-500">
      {jobCount} {jobCount === 1 ? "job" : "jobs"} found
    </p>
  </div>

  <Link
    href={homeSearchHref}
    className="
      inline-flex
      h-11
      w-full
      lg:w-auto
      items-center
      justify-center
      gap-2
      rounded-xl
      border
      border-amber-300
      bg-amber-50
      px-5
      text-sm
      font-semibold
      text-slate-900
      hover:bg-amber-100
    "
  >
    <Search className="h-4 w-4" />
    Change search
  </Link>
</div>

        {/* Filter Summary */}
        <div className="mb-7 rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <div className="grid gap-5 md:grid-cols-3 md:divide-x md:divide-slate-200">
            <SummaryItem
              icon={<MapPin className="h-5 w-5" />}
              label="Route"
              value={
                hasRouteFilter
                  ? `${origin || "Anywhere"} → ${destination || "Anywhere"}`
                  : "All routes"
              }
            />

            <SummaryItem
              icon={<Package className="h-5 w-5" />}
              label="Cargo"
              value={cargoType ? formatValue(cargoType) : "All cargo types"}
            />

            <SummaryItem
              icon={<Truck className="h-5 w-5" />}
              label="Vehicle"
              value={vehicleType ? formatValue(vehicleType) : "All vehicle types"}
            />
          </div>
        </div>



        {jobs && jobs.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <Link
                href={`/jobs/${job.id}`}
                key={job.id}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700">
                    {job.urgency || "normal"}
                  </span>

                  <span className="text-sm font-bold text-emerald-700">
                    {job.budget_sar
                      ? `SAR ${Number(job.budget_sar).toLocaleString()}`
                      : "Open"}
                  </span>
                </div>

                <h2 className="mt-4 line-clamp-2 text-xl font-bold leading-snug tracking-tight text-slate-950">
                  {job.title}
                </h2>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Route
                  </div>

                  <div className="mt-1 text-base font-bold text-slate-950">
                    {job.origin_city} → {job.destination_city}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniCard label="Weight" value={`${job.weight_kg} Kg`} />
                  <MiniCard label="Vehicle" value={formatValue(job.vehicle_type)} />
                  <MiniCard label="Cargo" value={formatValue(job.cargo_type)} />
                  <MiniCard label="Pickup" value={job.pickup_date || "Not set"} />
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-semibold text-slate-500">
                    View details
                  </span>

                  <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600">
                    Contact <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">No jobs found</h2>

            <p className="mt-2 text-sm text-slate-600">
              Try different filters or post a new transport request.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={homeSearchHref}
                className="
  inline-flex
  h-11
  w-full
  max-w-[220px]
  items-center
  justify-center
  gap-2
  self-start
  rounded-xl
  border
  border-amber-300
  bg-amber-50
  px-5
  text-sm
  font-semibold
  text-slate-900
  hover:bg-amber-100
  lg:w-[180px]
  lg:self-start
"
              >
                <Search className="h-4 w-4" />
                Change search
              </Link>

              <Link
                href="/create-listing"
                className="inline-flex items-center justify-center rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300"
              >
                Post a Job
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 md:px-6 first:md:pl-0">
      <div className="text-slate-900">{icon}</div>

      <div>
        <div className="text-xs font-medium text-slate-500">{label}</div>

        <div className="mt-1 text-sm font-bold capitalize text-slate-950">
          {value}
        </div>
      </div>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3">
      <div className="text-xs text-slate-500">{label}</div>

      <div className="mt-1 line-clamp-1 font-bold capitalize text-slate-950">
        {value}
      </div>
    </div>
  );
}