import Link from "next/link";
import { Calendar, MapPin, Package, PlusCircle, Truck } from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import { requireUser } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { formatWeight } from "@/app/lib/jobFormatters";
import JobManagementButtons from "./JobManagementButtons";
import { getTranslations } from "@/app/i18n";
import { getLocale } from "@/app/lib/locale";
import { getSaudiCityName } from "@/app/lib/saudiCities";
import { formatGregorianDate, getRouteArrow } from "@/app/lib/localeFormatters";

export const dynamic = "force-dynamic";

type DashboardJob = {
  id: string;
  title: string | null;
  cargo_type: string | null;
  vehicle_type: string | null;
  weight_kg: number | null;
  budget_sar: number | null;
  origin_city: string | null;
  destination_city: string | null;
  pickup_date: string | null;
  status: string | null;
  created_at: string | null;
};

function formatValue(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  return value.replaceAll("_", " ");
}

function statusBadge(status: string | null, labels: { active: string; inactive: string }) {
  const isInactive = status === "inactive";

  return {
    label: isInactive ? labels.inactive : labels.active,
    className: isInactive
      ? "bg-slate-100 text-slate-600"
      : "bg-emerald-100 text-emerald-700",
  };
}

export default async function DashboardJobsPage() {
  const user = await requireUser("/login?next=/dashboard/jobs");
  const locale = await getLocale();
  const t = getTranslations(locale);

  const { data: jobs } = await supabaseAdmin
    .from("transport_jobs")
    .select(
      "id,title,cargo_type,vehicle_type,weight_kg,budget_sar,origin_city,destination_city,pickup_date,status,created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<DashboardJob[]>();

  return (
    <main className="min-h-screen bg-[#f2f3f5] text-slate-900">
      <SiteHeader sticky />

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-sm font-bold text-amber-600 hover:text-amber-700"
            >
              {t.common.backToDashboard}
            </Link>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
              {t.dashboard.myJobs}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {t.dashboard.myJobsDescription}
            </p>
          </div>

          <Link
            href="/create-listing"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300"
          >
            <PlusCircle className="h-4 w-4" />
            {t.dashboard.postJob}
          </Link>
        </div>

        {jobs && jobs.length > 0 ? (
          <div className="mt-7 grid gap-4">
            {jobs.map((job) => {
              const badge = statusBadge(job.status, {
                active: t.common.active,
                inactive: t.common.inactive,
              });

              return (
              <article
                key={job.id}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-extrabold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold capitalize text-amber-700">
                        {formatValue(job.cargo_type, t.common.notSpecified)}
                      </span>
                    </div>

                    {job.status === "inactive" ? (
                      <h2 className="mt-3 text-xl font-extrabold leading-tight text-slate-950">
                        {job.title || t.jobs.untitled}
                      </h2>
                    ) : (
                      <Link
                        href={`/jobs/${job.id}`}
                        className="mt-3 block text-xl font-extrabold leading-tight text-slate-950 transition hover:text-amber-600"
                      >
                        {job.title || t.jobs.untitled}
                      </Link>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        {getSaudiCityName(job.origin_city, locale) || t.alerts.origin} {getRouteArrow(locale)}{" "}
                        {getSaudiCityName(job.destination_city, locale) || t.alerts.destination}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        {formatGregorianDate(job.pickup_date, locale, t.jobs.pickupDateNotSet)}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm font-bold text-slate-700 md:min-w-48 md:text-right">
                    <span className="inline-flex items-center gap-2 md:justify-end">
                      <Package className="h-4 w-4 text-slate-500" />
                      {formatWeight(job.weight_kg, t.jobs.weightNotSet)}
                    </span>
                    <span className="inline-flex items-center gap-2 capitalize md:justify-end">
                      <Truck className="h-4 w-4 text-slate-500" />
                      {formatValue(job.vehicle_type, t.common.notSpecified)}
                    </span>
                    <span className="text-emerald-700">
                      {job.budget_sar
                        ? `SAR ${Number(job.budget_sar).toLocaleString()}`
                        : t.common.openBudget}
                    </span>
                    <JobManagementButtons jobId={job.id} status={job.status} locale={locale} />
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-7 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-950">
              {t.management.noJobsYet}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {t.management.postedJobsDescription}
            </p>
            <Link
              href="/create-listing"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-amber-400 px-5 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300"
            >
              {t.management.postFirstJob}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
