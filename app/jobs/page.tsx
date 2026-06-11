import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import SiteHeader from "@/app/components/SiteHeader";
import Link from "next/link";

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

  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      <SiteHeader sticky />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.25),transparent_32%),linear-gradient(135deg,rgba(2,6,23,1),rgba(15,23,42,0.96),rgba(30,41,59,0.72))]" />

        <div className="relative mx-auto max-w-7xl px-4 py-9 md:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200">
              Saudi Heavy Transport
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Find open transport jobs.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Browse heavy cargo, oversized loads and industrial transport
              requests across Saudi Arabia.
            </p>
          </div>

          <form className="mt-7 rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur md:p-4">
            <div className="grid gap-3 md:grid-cols-5">
              <input
                name="origin"
                defaultValue={origin}
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-900/75 px-4 text-sm text-white outline-none placeholder:text-slate-400 focus:border-amber-300/60"
                placeholder="Origin city"
              />

              <input
                name="destination"
                defaultValue={destination}
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-900/75 px-4 text-sm text-white outline-none placeholder:text-slate-400 focus:border-amber-300/60"
                placeholder="Destination city"
              />

              <select
                name="cargo_type"
                defaultValue={cargoType}
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-900/75 px-4 text-sm text-white outline-none focus:border-amber-300/60"
              >
                <option value="">Cargo type</option>
                <option value="heavy_equipment">Heavy Equipment</option>
                <option value="industrial_cargo">Industrial Cargo</option>
                <option value="oversized_load">Oversized Load</option>
                <option value="construction_materials">
                  Construction Materials
                </option>
                <option value="containers">Containers</option>
                <option value="other">Other</option>
              </select>

              <select
                name="vehicle_type"
                defaultValue={vehicleType}
                className="min-h-12 rounded-2xl border border-white/10 bg-slate-900/75 px-4 text-sm text-white outline-none focus:border-amber-300/60"
              >
                <option value="">Vehicle type</option>
                <option value="lowbed_trailer">Lowbed Trailer</option>
                <option value="flatbed_trailer">Flatbed Trailer</option>
                <option value="extendable_trailer">Extendable Trailer</option>
                <option value="crane_truck">Crane Truck</option>
                <option value="container_truck">Container Truck</option>
                <option value="not_sure">Not Sure</option>
              </select>

              <button className="min-h-12 rounded-2xl bg-amber-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">
                Search Jobs
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 md:py-10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              {jobs?.length || 0} jobs found
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest approved requests appear first.
            </p>
          </div>

          {(origin || destination || cargoType || vehicleType) && (
            <Link
              href="/jobs"
              className="shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Clear
            </Link>
          )}
        </div>

        {jobs && jobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
<Link
  href={`/jobs/${job.id}`}
  key={job.id}
  className="group block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
  <div className="flex items-start justify-between gap-4">
    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700">
      {job.urgency || "normal"}
    </span>

    <span className="text-sm font-semibold text-emerald-700">
      {job.budget_sar ? `SAR ${job.budget_sar}` : "Open"}
    </span>
  </div>

<h3 className="mt-4 line-clamp-2 text-lg font-semibold tracking-tight text-slate-900 group-hover:text-slate-700 sm:text-xl">    {job.title}
  </h3>

  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
      Route
    </div>
    <div className="mt-1 text-base font-semibold text-slate-900">
      {job.origin_city} → {job.destination_city}
    </div>
  </div>

  <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              No jobs found
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Try different filters or post a new transport request.
            </p>
            <Link
              href="/create-listing"
              className="mt-5 inline-flex rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300"
            >
              Post a Job
            </Link>
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
      <div className="mt-1 line-clamp-1 capitalize font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}