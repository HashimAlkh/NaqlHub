import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import { supabaseAdmin } from "./lib/supabaseAdmin";
import {
  Briefcase,
  MapPin,
  Zap,
  ShieldCheck,
  Package,
  Truck,
  Calendar,
  Search,
  ChevronRight,
  Users,
} from "lucide-react";
import WishListButton from "./components/WishListButton";

function formatValue(value: string | null | undefined) {
  if (!value) return "Not specified";
  return value.replaceAll("_", " ");
}

const urgencyConfig: Record<string, { label: string; className: string }> = {
  urgent: { label: "URGENT", className: "bg-red-100 text-red-600" },
  hot:    { label: "HOT",    className: "bg-orange-100 text-orange-600" },
  new:    { label: "NEW",    className: "bg-green-100 text-green-700" },
  normal: { label: "NORMAL", className: "bg-slate-100 text-slate-600" },
};

export default async function HomePage() {
  const { data: jobs } = await supabaseAdmin
    .from("transport_jobs")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(4);

  const { count: activeJobsCount } = await supabaseAdmin
    .from("transport_jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  const { data: cityRows } = await supabaseAdmin
    .from("transport_jobs")
    .select("origin_city,destination_city")
    .eq("status", "approved");

  const citiesCoveredCount = new Set(
    (cityRows || [])
      .flatMap((job: { origin_city: string | null; destination_city: string | null }) => [
        job.origin_city,
        job.destination_city,
      ])
      .filter(Boolean)
  ).size;

  return (
    <main className="min-h-screen bg-[#f2f3f5] text-slate-900">
      <SiteHeader sticky />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative bg-[#07152b] text-white">

        {/* Desktop bg image — only ≥ lg */}
        <div className="absolute inset-0 hidden lg:block">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: "url('/truck-hero.png')",
              backgroundPosition: "62% center",
            }}
          />
          {/* strong left fade so form + text stay legible */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg,#07152b 0%,#07152b 38%,rgba(7,21,43,.92) 42%,rgba(7,21,43,.3) 75%,rgba(7,21,43,0) 100%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-2 lg:px-10">

          {/* ── Mobile hero image (< lg) ── */}
          <div className="relative left-1/2 h-[240px] w-screen -translate-x-1/2 overflow-hidden lg:hidden">
            <img
              src="/truck-hero.png"
              alt="Heavy transport truck"
              className="h-full w-full object-contain"
            />
            {/* left-to-right fade: left half dark, right half transparent */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg,rgba(7,21,43,.95) 0%,rgba(7,21,43,.85) 35%,rgba(7,21,43,.2) 65%,rgba(7,21,43,0) 100%)",
              }}
            />
            {/* top-to-bottom subtle fade for depth */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg,rgba(7,21,43,.5) 0%,rgba(7,21,43,0) 80%,rgba(7,21,43,.8) 100%)",
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-start px-5 pb-5 pt-5">
              <span className=" mb-3 inline-flex w-fit rounded-xl border border-amber-400/60 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-300">
                Heavy transport marketplace for Saudi Arabia
              </span>
              {/* max-w-[50%] keeps text strictly on the left half */}
              <h1 className="max-w-[50%] text-lg font-extrabold leading-[1.1] tracking-tight pt-4">
                The right transport.<br />Every time.
              </h1>
              <p className="mt-3 max-w-[48%] text-sm leading-5 text-slate-300">
                Connect with verified <br /> 
                carriers for your heavy cargo.
              </p>
            </div>
          </div>

          {/* ── Desktop headline (≥ lg) ── */}
          <div className="hidden lg:block pt-16 pb-12">
            <span className="inline-flex rounded-full border border-amber-400/50 bg-amber-400/10 px-4 py-1 text-sm font-medium text-amber-200">
              Heavy transport marketplace for Saudi Arabia
            </span>
            <h1 className="mt-5 max-w-[560px] text-[52px] font-extrabold leading-[1.05] tracking-tight">
              Find the right transport for every heavy load.
            </h1>
            <p className="mt-4 max-w-[480px] text-lg leading-7 text-slate-300">
              The leading platform connecting shippers with trusted transport
              providers across Saudi Arabia.
            </p>
          </div>

          {/* ── Mobile search (< lg) ── */}
          <div className="mt-0 lg:hidden">
            <div className="rounded-2xl border border-white/10 bg-[#0c1d35] p-3">
              <div className="space-y-2">
                <label className="flex h-10 items-center gap-3 rounded-xl border border-white/10 bg-[#07152b] px-4 cursor-text">
                  <MapPin className="h-4 w-4 shrink-0 text-amber-400/70" />
                  <input
                    name="origin"
                    placeholder="From"
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none"
                  />
                </label>
                <label className="flex h-10 items-center gap-3 rounded-xl border border-white/10 bg-[#07152b] px-4 cursor-text">
                  <MapPin className="h-4 w-4 shrink-0 text-amber-400/70" />
                  <input
                    name="destination"
                    placeholder="To"
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none"
                  />
                </label>
                <label className="flex h-10 items-center gap-3 rounded-xl border border-white/10 bg-[#07152b] px-4">
                  <Package className="h-4 w-4 shrink-0 text-amber-400/70" />
                  <select
                    name="cargo_type"
                    defaultValue=""
                    className="w-full bg-transparent text-sm text-white outline-none appearance-none"
                  >
                    <option value="" className="bg-[#07152b]">Cargo Type</option>
                    <option value="heavy_equipment" className="bg-[#07152b]">Heavy Equipment</option>
                    <option value="industrial_cargo" className="bg-[#07152b]">Industrial Cargo</option>
                    <option value="oversized_load" className="bg-[#07152b]">Oversized Load</option>
                  </select>
                  <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </label>
                <label className="flex h-10 items-center gap-3 rounded-xl border border-white/10 bg-[#07152b] px-4">
                  <Truck className="h-4 w-4 shrink-0 text-amber-400/70" />
                  <select
                    name="vehicle_type"
                    defaultValue=""
                    className="w-full bg-transparent text-sm text-white outline-none appearance-none"
                  >
                    <option value="" className="bg-[#07152b]">Vehicle Type</option>
                    <option value="lowbed_trailer" className="bg-[#07152b]">Lowbed Trailer</option>
                    <option value="flatbed_trailer" className="bg-[#07152b]">Flatbed Trailer</option>
                    <option value="extendable_trailer" className="bg-[#07152b]">Extendable Trailer</option>
                  </select>
                  <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </label>
                <Link
                  href="/jobs"
                  className="flex h-10 w-full items-center justify-center rounded-xl bg-amber-400 text-sm font-bold text-slate-950 hover:bg-amber-300 transition-colors"
                >
                  Search Jobs
                </Link>
              </div>
            </div>
          </div>

          {/* ── Desktop search form (≥ lg) ── */}
          <div className="hidden lg:block pt-4">
            <div className="w-[600px] rounded-2xl border border-white/10 bg-[#0c1d35] p-5 shadow-2xl">
              {/* Row 1: From | To | Cargo Type */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">From</label>
                  <div className="flex h-[42px] items-center gap-2 rounded-xl border border-white/10 bg-[#07152b] px-3">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      name="origin"
                      placeholder="City or Region"
                      className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">To</label>
                  <div className="flex h-[42px] items-center gap-2 rounded-xl border border-white/10 bg-[#07152b] px-3">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      name="destination"
                      placeholder="City or Region"
                      className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cargo Type</label>
                  <select
                    name="cargo_type"
                    defaultValue=""
                    className="flex h-[42px] text-slate-400 items-center gap-2 rounded-xl border border-white/10 bg-[#07152b] px-3"
                  >
                    <option value="">All Types</option>
                    <option value="heavy_equipment">Heavy Equipment</option>
                    <option value="industrial_cargo">Industrial Cargo</option>
                    <option value="oversized_load">Oversized Load</option>
                  </select>
                </div>
              </div>
              {/* Row 2: Vehicle | Weight | Search */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vehicle Type</label>
                  <select
                    name="vehicle_type"
                    defaultValue=""
                    className="flex h-[42px] text-slate-400 items-center gap-2 rounded-xl border border-white/10 bg-[#07152b] px-3"
                  >
                    <option value="">All Vehicles</option>
                    <option value="lowbed_trailer">Lowbed Trailer</option>
                    <option value="flatbed_trailer">Flatbed Trailer</option>
                    <option value="extendable_trailer">Extendable Trailer</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Load Weight</label>
                  <select
                    name="weight"
                    defaultValue=""
                    className="flex h-[42px] text-slate-400 items-center gap-2 rounded-xl border border-white/10 bg-[#07152b] px-3"
                  >
                    <option value="">Any Weight</option>
                    <option value="0-10000">Up to 10,000 kg</option>
                    <option value="10000-30000">10,000–30,000 kg</option>
                    <option value="30000+">30,000+ kg</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-transparent select-none">Search</label>
                  <Link
                    href="/jobs"
                    className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-amber-400 text-sm font-bold text-slate-950 hover:bg-amber-300 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    Search Jobs
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Stats bar ── */}
        <div>
          <div className="mx-auto max-w-7xl px-5 lg:px-10">
            {/* Mobile: 2x2 centered vertical */}
<div className="flex items-center justify-center gap-24 py-7 lg:hidden">
<MobileStat
  icon={<Briefcase />}
  value={`${activeJobsCount || 0}+`}
  label="Jobs"
/>

<MobileStat
  icon={<MapPin />}
  value={`${citiesCoveredCount}+`}
  label="Cities"
/>
</div>
            {/* Desktop: horizontal row */}
            <div className="hidden lg:flex lg:divide-x lg:divide-white/10">
              <DesktopStat icon={<Briefcase className="h-5 w-5" />} value={`${activeJobsCount || 0}+`} label="Active Jobs" />
              <DesktopStat icon={<MapPin className="h-5 w-5" />} value={`${citiesCoveredCount}+`} label="Cities Covered" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ JOBS ═══════════ */}
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 lg:text-2xl">
            <span className="lg:hidden">Latest transport jobs</span>
            <span className="hidden lg:inline">Browse Open Transport Jobs</span>
          </h2>
          <Link href="/jobs" className="flex items-center gap-0.5 text-sm font-semibold text-slate-500 hover:text-slate-900 lg:text-blue-600">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {jobs && jobs.length > 0 ? (
          <>
            {/* Mobile list */}
            <div className="space-y-3 lg:hidden">
              {jobs.map((job) => <MobileJobCard key={job.id} job={job} />)}
            </div>
            {/* Desktop grid */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-4">
              {jobs.map((job) => <DesktopJobCard key={job.id} job={job} />)}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-900">No jobs posted yet</h3>
            <p className="mt-2 text-sm text-slate-500">Be the first to post a heavy transport request.</p>
            <Link href="/create-listing" className="mt-5 inline-flex rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-300">
              Post a Job
            </Link>
          </div>
        )}
      </section>

      {/* ═══════════ TRUST FEATURES ═══════════ */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-12">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-8">
            <TrustFeature icon={<ShieldCheck className="h-6 w-6" />} title="Verified Transporters" description="All transport providers are verified and trusted." />
            <TrustFeature icon={<Zap className="h-6 w-6" />} title="Fast & Easy" description="Post or find a job in minutes and get matched quickly." />
            <TrustFeature
              icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}
              title="Secure & Reliable"
              description="Safe transactions and reliable communication."
            />
            <TrustFeature
              icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>}
              title="Local Support"
              description="Dedicated support team across Saudi Arabia."
            />
          </div>
        </div>
      </section>

      {/* ═══════════ CTA BANNER (desktop only) ═══════════ */}
      <section className="hidden bg-[#07152b] lg:block">
        <div className="mx-auto max-w-7xl px-10 py-10">
          <div className="flex items-center justify-between gap-6">
            <p className="text-xl font-semibold text-white">
              Join thousands of shippers and transporters growing their business with{" "}
              <span className="text-amber-400">NaqlHub</span>.
            </p>
            <div className="flex shrink-0 gap-3">
              <Link href="/create-listing" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-300 transition-colors">
                Post a Job
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors">
                Create Carrier Profile
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ═══════════════════ SUB-COMPONENTS ═══════════════════ */

function MobileStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode; 
  value: string;
  label: string;
}) {
  return (

<div className="flex flex-col items-center text-center">
  <span className="text-amber-400 [&>svg]:h-6 [&>svg]:w-6">
    {icon}
  </span>

  <span className="mt-1 text-xl font-bold text-white">
    {value}
  </span>

  <span className="mt-1 text-xs text-slate-400">
    {label}
  </span>
</div>
  );
}

function DesktopStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 px-8 py-5 first:pl-0 last:pr-0">
      <span className="text-amber-400">{icon}</span>
      <div>
        <div className="text-xl font-bold text-white">{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </div>
  );
}

function MobileJobCard({ job }: { job: any }) {
  const tag = (job.urgency || "new").toLowerCase();
  const { label, className } = urgencyConfig[tag] ?? urgencyConfig.normal;
  return (
    <Link href={`/jobs/${job.id}`} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${className}`}>{label}</span>
        <span className="text-sm font-bold text-emerald-600">
          {job.budget_sar ? `SAR ${Number(job.budget_sar).toLocaleString()}` : "Open"}
        </span>
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 line-clamp-1">{job.title}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {job.origin_city} → {job.destination_city}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" />{job.weight_kg ? `${Number(job.weight_kg).toLocaleString()} kg` : "—"}</span>
        <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" />{formatValue(job.vehicle_type)}</span>
        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{job.pickup_date || "—"}</span>
      </div>
    </Link>
  );
}

function DesktopJobCard({ job }: { job: any }) {
  const tag = (job.urgency || "new").toLowerCase();
  const { label, className } = urgencyConfig[tag] ?? urgencyConfig.normal;
  return (
    <Link href={`/jobs/${job.id}`} className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <WishListButton />
      <span className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-bold ${className}`}>{label}</span>
      <h3 className="mt-3 text-base font-bold text-slate-900">{job.origin_city} → {job.destination_city}</h3>
      <div className="mt-1 space-y-0.5 text-xs text-slate-500">
        <p className="line-clamp-1">{job.origin_detail || job.origin_city}</p>
        <p className="line-clamp-1">{job.destination_detail || job.destination_city}</p>
      </div>
      <div className="mt-3 grow space-y-1.5 text-sm text-slate-600">
        <div className="flex items-center gap-2"><Package className="h-4 w-4 shrink-0 text-slate-400" />{job.weight_kg ? `${Number(job.weight_kg).toLocaleString()} kg` : "—"}</div>
        <div className="flex items-center gap-2"><Truck className="h-4 w-4 shrink-0 text-slate-400" />{formatValue(job.vehicle_type)}</div>
        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 shrink-0 text-slate-400" />{job.pickup_date || "—"}</div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-blue-700">{formatValue(job.cargo_type)}</span>
        <span className="text-sm font-bold text-emerald-600">{job.budget_sar ? `SAR ${Number(job.budget_sar).toLocaleString()}` : "Open"}</span>
      </div>
    </Link>
  );
}

function TrustFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 rounded-xl bg-slate-100 p-2 text-slate-500">{icon}</div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 lg:text-base">{title}</h3>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500 lg:text-sm">{description}</p>
      </div>
    </div>
  );
}