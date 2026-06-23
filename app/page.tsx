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
import JobCard from "./components/JobCard";
import FeaturedJobsCarousel from "./components/FeaturedJobsCarousel";
import LanguageSwitcher from "./components/LanguageSwitcher";
import HomeCityAutocomplete from "./components/HomeCityAutocomplete";
import { getTranslations } from "./i18n";
import { getLocale } from "./lib/locale";

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
  const locale = await getLocale();
  const t = getTranslations(locale);
  const isArabic = locale === "ar";
  const { data: jobs } = await supabaseAdmin
    .from("transport_jobs")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(4);

  const { count: activeJobsCount } = await supabaseAdmin
    .from("transport_jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { data: cityRows } = await supabaseAdmin
    .from("transport_jobs")
    .select("origin_city,destination_city")
    .eq("status", "active");

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
      <section className="relative bg-[#07152b] text-white" dir={isArabic ? "rtl" : undefined}>

        {/* Desktop bg image — only ≥ lg */}
        <div className="absolute inset-0 hidden lg:block">
          <div
            className={`absolute inset-0 bg-cover ${isArabic ? "scale-x-[-1]" : ""}`}
            style={{
              backgroundImage: "url('/truck-hero.png')",
              backgroundPosition: "62% center",
            }}
          />
          {/* strong left fade so form + text stay legible */}
          <div
            className="absolute inset-0"
            style={{
              background: isArabic
                ? "linear-gradient(270deg,#07152b 0%,#07152b 38%,rgba(7,21,43,.92) 42%,rgba(7,21,43,.3) 75%,rgba(7,21,43,0) 100%)"
                : "linear-gradient(90deg,#07152b 0%,#07152b 38%,rgba(7,21,43,.92) 42%,rgba(7,21,43,.3) 75%,rgba(7,21,43,0) 100%)",
            }}
          />
        </div>

        <div className={`relative mx-auto max-w-7xl px-0 py-0 lg:px-10 lg:py-2 ${isArabic ? "text-right" : ""}`}>
          <div
            className={`absolute top-4 z-30 ${
              isArabic ? "left-4" : "right-4"
            } lg:left-10 lg:right-auto`}
          >
            <LanguageSwitcher locale={locale} variant="hero" />
          </div>

          {/* ── Mobile hero image (< lg) ── */}
          <div className="relative h-[240px] w-full overflow-hidden lg:hidden">
            <img
              src="/truck-hero.png"
              alt="Heavy transport truck"
              className={`h-full w-full object-cover ${isArabic ? "scale-x-[-1]" : ""}`}
            />
            {/* left-to-right fade: left half dark, right half transparent */}
            <div
              className="absolute inset-0"
              style={{
              background: isArabic
                ? "linear-gradient(270deg,rgba(7,21,43,.95) 0%,rgba(7,21,43,.85) 35%,rgba(7,21,43,.2) 65%,rgba(7,21,43,0) 100%)"
                : "linear-gradient(90deg,rgba(7,21,43,.95) 0%,rgba(7,21,43,.85) 35%,rgba(7,21,43,.2) 65%,rgba(7,21,43,0) 100%)",
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
            <div
              className={`absolute inset-0 flex flex-col justify-start px-5 pb-5 pt-5 ${
                isArabic ? "items-end text-right" : ""
              }`}
            >
              <div
                className={
                  isArabic
                    ? "ml-auto flex w-1/2 flex-col text-right"
                    : ""
                }
              >
                <span className={`mb-3 inline-flex w-fit rounded-xl border border-amber-400/60 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-300 ${isArabic ? "self-end" : ""}`}>
                  {t.home.eyebrow}
                </span>
                <h1
                  className={`whitespace-pre-line pt-4 font-extrabold tracking-tight ${
                    isArabic
                      ? "w-full text-lg leading-[1.1]"
                      : "max-w-[50%] text-lg leading-[1.1]"
                  }`}
                >
                  {t.home.mobileTitle}
                </h1>
                <p
                  className={`mt-3 whitespace-pre-line text-sm leading-5 text-slate-300 ${
                    isArabic ? "w-[96%] self-end" : "max-w-[48%]"
                  }`}
                >
                  {t.home.mobileDescription}
                </p>
              </div>
            </div>
          </div>

          {/* ── Desktop headline (≥ lg) ── */}
          <div className={`hidden pt-16 pb-12 lg:block ${isArabic ? "text-right" : ""}`}>
            <span className="inline-flex rounded-full border border-amber-400/50 bg-amber-400/10 px-4 py-1 text-sm font-medium text-amber-200">
              {t.home.eyebrow}
            </span>
            <h1 className="mt-5 max-w-[560px] text-[52px] font-extrabold leading-[1.05] tracking-tight">
              {t.home.desktopTitle}
            </h1>
            <p className="mt-4 max-w-[480px] text-lg leading-7 text-slate-300">
              {t.home.desktopDescription}
            </p>
          </div>

          {/* ── Mobile search (< lg) ── */}
          <div className="mt-0 px-4 pb-4 lg:hidden">
            <form
              action="/jobs"
              dir={isArabic ? "rtl" : undefined}
              className={`rounded-2xl border border-white/10 bg-[#0c1d35] p-3 ${
                isArabic ? "text-right" : ""
              }`}
            >
              <div className="space-y-2">
                <HomeCityAutocomplete
                  locale={locale}
                  name="origin"
                  placeholder={t.home.from}
                  variant="mobile"
                />
                <HomeCityAutocomplete
                  locale={locale}
                  name="destination"
                  placeholder={t.home.to}
                  variant="mobile"
                />
                <label className="flex h-10 items-center gap-3 rounded-xl border border-white/10 bg-[#07152b] px-4">
                  <Package className="h-4 w-4 shrink-0 text-amber-400/70" />
                  <select
                    name="cargo_type"
                    defaultValue=""
                    className="w-full bg-transparent text-sm text-white outline-none appearance-none"
                  >
                    <option value="" className="bg-[#07152b]">{t.home.cargoType}</option>
                    <option value="heavy_equipment" className="bg-[#07152b]">{t.home.heavyEquipment}</option>
                    <option value="industrial_cargo" className="bg-[#07152b]">{t.home.industrialCargo}</option>
                    <option value="oversized_load" className="bg-[#07152b]">{t.home.oversizedLoad}</option>
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
                    <option value="" className="bg-[#07152b]">{t.home.vehicleType}</option>
                    <option value="lowbed_trailer" className="bg-[#07152b]">{t.home.lowbedTrailer}</option>
                    <option value="flatbed_trailer" className="bg-[#07152b]">{t.home.flatbedTrailer}</option>
                    <option value="extendable_trailer" className="bg-[#07152b]">{t.home.extendableTrailer}</option>
                  </select>
                  <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </label>
                <button
                  type="submit"
                  className="flex h-10 w-full items-center justify-center rounded-xl bg-amber-400 text-sm font-bold text-slate-950 hover:bg-amber-300 transition-colors"
                >
                  {t.home.searchJobs}
                </button>
              </div>
            </form>
          </div>
          <div className="flex items-center justify-center gap-24 py-7 lg:hidden">
  <MobileStat
    icon={<Briefcase />}
    value={`${activeJobsCount || 0}+`}
    label={t.home.jobs}
  />

  <MobileStat
    icon={<MapPin />}
    value={`${citiesCoveredCount}+`}
    label={t.home.cities}
  />
</div>

          {/* ── Desktop search form (≥ lg) ── */}
          <div className={`hidden pt-4 lg:block ${isArabic ? "text-right" : ""}`}>
            <form
              action="/jobs"
              className={`w-[600px] overflow-visible rounded-2xl border border-white/10 bg-[#0c1d35] p-5 shadow-2xl ${
                isArabic ? "ml-auto" : ""
              }`}
            >
              {/* Row 1: From | To | Cargo Type */}
              <div className="grid grid-cols-3 gap-3 overflow-visible mb-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.home.from}</label>
                  <HomeCityAutocomplete
                    locale={locale}
                    name="origin"
                    placeholder={t.home.cityOrRegion}
                    variant="desktop"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.home.to}</label>
                  <HomeCityAutocomplete
                    locale={locale}
                    name="destination"
                    placeholder={t.home.cityOrRegion}
                    variant="desktop"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.home.cargoType}</label>
                  <select
                    name="cargo_type"
                    defaultValue=""
                    className="flex h-[42px] items-center gap-2 rounded-xl border border-white/10 bg-[#07152b] px-3 text-sm font-medium text-white outline-none focus:border-amber-400"
                  >
                    <option value="">{t.home.allTypes}</option>
                    <option value="heavy_equipment">{t.home.heavyEquipment}</option>
                    <option value="industrial_cargo">{t.home.industrialCargo}</option>
                    <option value="oversized_load">{t.home.oversizedLoad}</option>
                  </select>
                </div>
              </div>
              {/* Row 2: Vehicle | Weight | Search */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.home.vehicleType}</label>
                  <select
                    name="vehicle_type"
                    defaultValue=""
                    className="flex h-[42px] items-center gap-2 rounded-xl border border-white/10 bg-[#07152b] px-3 text-sm font-medium text-white outline-none focus:border-amber-400"
                  >
                    <option value="">{t.home.allVehicles}</option>
                    <option value="lowbed_trailer">{t.home.lowbedTrailer}</option>
                    <option value="flatbed_trailer">{t.home.flatbedTrailer}</option>
                    <option value="extendable_trailer">{t.home.extendableTrailer}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.home.loadWeight}</label>
                  <select
                    name="weight"
                    defaultValue=""
                    className="flex h-[42px] items-center gap-2 rounded-xl border border-white/10 bg-[#07152b] px-3 text-sm font-medium text-white outline-none focus:border-amber-400"
                  >
                    <option value="">{t.home.anyWeight}</option>
                    <option value="0-10000">{t.home.upToTenTonnes}</option>
                    <option value="10000-30000">{t.home.tenToThirtyTonnes}</option>
                    <option value="30000+">{t.home.overThirtyTonnes}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="select-none text-[10px] font-bold uppercase tracking-widest text-transparent">{t.home.searchJobs}</label>
                  <button
                    type="submit"
                    className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-amber-400 text-sm font-bold text-slate-950 hover:bg-amber-300 transition-colors"
                  >
                  <Search className="h-4 w-4" />
                      {t.home.searchJobs}
                  </button>
                </div>
              </div>
            </form>
            <div className={`mt-6 mb-3 flex w-[600px] items-center gap-8 ${isArabic ? "ml-auto justify-end" : "justify-start"}`}>
  <DesktopStat
    icon={<Briefcase className="h-8 w-8" />}
    value={`${activeJobsCount || 0}+`}
    label={t.home.activeJobs}
  />

  <DesktopStat
    icon={<MapPin className="h-8 w-8" />}
    value={`${citiesCoveredCount}+`}
    label={t.home.citiesCovered}
  />
</div>
          </div>

        </div>


 
      </section>

      {/* ═══════════ JOBS ═══════════ */}
<FeaturedJobsCarousel />



      {/* ═══════════ CTA BANNER (desktop only) ═══════════ */}
      <section className="hidden bg-[#07152b] lg:block">
        <div className="mx-auto max-w-7xl px-10 py-10">
          <div className="flex items-center justify-between gap-6">
            <p className="text-xl font-semibold text-white">
              {t.home.join}{" "}
              <span className="text-amber-400">NaqlHub</span>.
            </p>
            <div className="flex shrink-0 gap-3">
              <Link href="/create-listing" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-300 transition-colors">
                {t.header.postJob}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
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

function DesktopStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-amber-400 [&>svg]:h-7 [&>svg]:w-7">
        {icon}
      </span>

      <div>
        <div className="text-2xl font-bold leading-none text-white">
          {value}
        </div>
        <div className="mt-1 text-sm font-medium text-slate-400">
          {label}
        </div>
      </div>
    </div>
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
