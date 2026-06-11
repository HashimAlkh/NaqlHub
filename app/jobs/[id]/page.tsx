import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import SiteHeader from "@/app/components/SiteHeader";

function formatValue(value: string | null | undefined) {
  if (!value) return "Not specified";
  return value.replaceAll("_", " ");
}

function whatsappLink(number: string, title: string) {
  const cleaned = number.replace(/[^\d+]/g, "");
  const message = encodeURIComponent(
    `Hello, I am interested in your transport job: ${title}`
  );

  return `https://wa.me/${cleaned.replace("+", "")}?text=${message}`;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: job } = await supabaseAdmin
    .from("transport_jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (!job) notFound();

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <SiteHeader sticky />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(217,164,65,0.28),transparent_34%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-8 md:py-12">
          <Link
            href="/jobs"
            className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/15"
          >
            ← Back to jobs
          </Link>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200">
                {job.urgency || "normal"} request
              </div>

              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
                {job.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-slate-300">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                  {job.origin_city}
                </span>
                <span className="text-amber-300">→</span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                  {job.destination_city}
                </span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="text-sm text-slate-300">Estimated budget</div>
              <div className="mt-1 text-3xl font-semibold text-emerald-300">
                {job.budget_sar ? `SAR ${job.budget_sar}` : "Open"}
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Payment is handled directly between shipper and carrier.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:py-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5 md:space-y-6">
          <div className="nh-card p-5 shadow-sm md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  Transport details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Key information required to assess this job.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoCard label="Weight" value={`${job.weight_kg} kg`} />
              <InfoCard label="Vehicle" value={formatValue(job.vehicle_type)} />
              <InfoCard label="Pickup" value={job.pickup_date} />
              <InfoCard label="Cargo" value={formatValue(job.cargo_type)} />
              <InfoCard
                label="Dimensions"
                value={`${job.length_m || "-"} × ${job.width_m || "-"} × ${
                  job.height_m || "-"
                } m`}
              />
              <InfoCard label="Status" value={job.status || "pending"} />
            </div>
          </div>

          <div className="nh-card p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Route
            </h2>

            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <RoutePoint label="Origin" value={job.origin_city} />

              <div className="hidden h-px bg-slate-200 md:block" />

              <RoutePoint label="Destination" value={job.destination_city} />
            </div>
          </div>

          <div className="nh-card p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Description
            </h2>

            <p className="mt-3 whitespace-pre-line text-base leading-8 text-slate-600">
              {job.description}
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="bg-[#07152b] p-5 text-white">
              <div className="text-sm text-slate-300">Contact shipper</div>
              <div className="mt-1 text-xl font-semibold">
                {job.contact_name}
              </div>
            </div>

            <div className="p-5">
              <p className="text-sm leading-6 text-slate-600">
                Contact the shipper directly via WhatsApp. NaqlHub does not
                handle payment, contracts or transport execution.
              </p>

              <a
                href={whatsappLink(job.whatsapp_number, job.title)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Contact via WhatsApp
              </a>

              <Link
                href="/jobs"
                className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Browse more jobs
              </Link>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                Verify job details, permits, loading requirements and pricing
                directly with the shipper before accepting a transport.
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 break-words capitalize font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}

function RoutePoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </div>
    </div>
  );
}