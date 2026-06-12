import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import SiteHeader from "@/app/components/SiteHeader";
import Link from "next/link";
import { Search } from "lucide-react";

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

  const jobCount = jobs?.length || 0;

  return (
    <main className="min-h-screen bg-[#f2f3f5]">
      <SiteHeader sticky />

      <section className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              Transport jobs
            </h1>
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>

            {(cargoType || vehicleType) && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {cargoType && (
                  <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-800">
                    {formatValue(cargoType)}
                  </span>
                )}
                {vehicleType && (
                  <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                    {formatValue(vehicleType)}
                  </span>
                )}
              </div>
            )}

            <p className="mt-2 text-xs text-slate-500 md:text-sm">
              {jobCount} {jobCount === 1 ? "job" : "jobs"} found
            </p>
          </div>

          <Link
            href={homeSearchHref}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 sm:w-auto"
          >
            <Search className="h-4 w-4" />
            Change search
          </Link>
        </div>

        {jobs && jobs.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <Link
                href={`/jobs/${job.id}`}
                key={job.id}
                className="group block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700">
                    {job.urgency || "normal"}
                  </span>

                  <span className="text-sm font-semibold text-emerald-700">
                    {job.budget_sar ? `SAR ${job.budget_sar}` : "Open"}
                  </span>
                </div>

                <h2 className="mt-4 line-clamp-2 text-lg font-semibold tracking-tight text-slate-900 group-hover:text-slate-700 sm:text-xl">
                  {job.title}
                </h2>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Route
                  </div>
                  <div className="mt-1 text-base font-semibold text-slate-900">
                    {job.origin_city} → {job.destination_city}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniCard label="Weight" value={`${job.weight_kg} kg`} />
                  <MiniCard label="Vehicle" value={formatValue(job.vehicle_type)} />
                  <MiniCard label="Cargo" value={formatValue(job.cargo_type)} />
                  <MiniCard label="Pickup" value={job.pickup_date} />
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-medium text-slate-500">
                    View details
                  </span>
                  <span className="text-sm font-semibold text-amber-600">
                    Contact →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:mt-6">
            <h2 className="text-lg font-semibold text-slate-900">No jobs found</h2>
            <p className="mt-2 text-sm text-slate-600">
              Try different filters or post a new transport request.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={homeSearchHref}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800 hover:bg-amber-100"
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

function MiniCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 line-clamp-1 font-semibold capitalize text-slate-900">
        {value}
      </div>
    </div>
  );
}
