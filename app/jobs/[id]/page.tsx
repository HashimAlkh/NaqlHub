import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import SiteHeader from "@/app/components/SiteHeader";
import {
  Calendar,
  MapPin,
  Package,
  Ruler,
  ShieldCheck,
  Truck,
  Weight,
} from "lucide-react";
import JobGallery from "@/app/components/JobGallery";

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
    .eq("status", "approved")
    .single();

  if (!job) notFound();

  const images =
    Array.isArray(job.image_urls) && job.image_urls.length > 0
      ? job.image_urls
      : ["/truck-hero.png"];

  const dimensions = `${job.length_m || "-"} × ${job.width_m || "-"} × ${
    job.height_m || "-"
  } m`;

  return (
    <main className="min-h-screen bg-[#f2f3f5] text-slate-900">
      <SiteHeader sticky />

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-5 lg:px-10 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <JobGallery images={images} title={job.title}>
              <Link
                href="/jobs"
                className="absolute left-5 top-5 z-40 inline-flex items-center rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
              >
                ← Back to jobs
              </Link>

              {/* Desktop title overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-20 hidden p-5 md:block md:p-7">
                <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow md:text-[34px]">
                  {job.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-5 text-sm font-semibold text-white/95">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {job.origin_city}
                  </span>

                  <span className="font-black text-amber-300">→</span>

                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {job.destination_city}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(job.pickup_date)}
                  </span>
                </div>
              </div>
            </JobGallery>

            {/* Mobile title panel */}
            <div className="relative z-20 -mt-8 mx-1 rounded-t-[2rem] bg-white px-5 pb-4 pt-6 md:hidden">
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-950">
                {job.title}
              </h1>

              <div className="mt-4 flex items-center gap-3 text-sm font-bold text-slate-900">
                <span className="inline-flex min-w-0 items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="truncate">{job.origin_city}</span>
                </span>

                <span className="shrink-0 font-black text-amber-500">→</span>

                <span className="inline-flex min-w-0 items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="truncate">{job.destination_city}</span>
                </span>
              </div>

              <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Calendar className="h-4 w-4 text-slate-500" />
                {formatDate(job.pickup_date)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 px-4 pb-5 pt-4 md:px-5 lg:grid-cols-4 lg:pt-5">
              <FactItem
                icon={<Weight className="h-5 w-5" />}
                label="Weight"
                value={`${Number(job.weight_kg || 0).toLocaleString()} kg`}
              />

              <FactItem
                icon={<Truck className="h-5 w-5" />}
                label="Vehicle"
                value={formatValue(job.vehicle_type)}
              />

              <FactItem
                icon={<Package className="h-5 w-5" />}
                label="Cargo"
                value={formatValue(job.cargo_type)}
              />

              <FactItem
                icon={<Ruler className="h-5 w-5" />}
                label="Dimensions"
                value={dimensions}
              />
            </div>

            <div className="border-t border-slate-100 px-5 pb-6 pt-4 md:px-7">
              <h2 className="text-lg font-extrabold tracking-tight text-slate-950">
                Description
              </h2>

              <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-600">
                {job.description}
              </p>
            </div>
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-base font-extrabold text-slate-950">
                Contact shipper
              </div>

              <div className="mt-5 flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-extrabold text-slate-600">
                  {String(job.contact_name || "?").charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="truncate text-sm font-extrabold text-slate-950">
                    {job.contact_name}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-500">
                    {job.whatsapp_number}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Budget
                </div>

                <div className="mt-1 text-2xl font-extrabold text-amber-500">
                  {job.budget_sar
                    ? `SAR ${Number(job.budget_sar).toLocaleString()}`
                    : "Open"}
                </div>
              </div>

              <a
                href={whatsappLink(job.whatsapp_number, job.title)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300"
              >
                Contact via WhatsApp
              </a>

              <Link
                href="/jobs"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
              >
                Browse more jobs
              </Link>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>
                    Verify job details, permits, loading requirements and pricing
                    directly with the shipper before accepting a transport.
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function FactItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-amber-500">{icon}</span>
        <span className="text-[11px] font-extrabold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <div className="mt-2 line-clamp-2 break-words text-sm font-extrabold capitalize text-slate-950">
        {value}
      </div>
    </div>
  );
}