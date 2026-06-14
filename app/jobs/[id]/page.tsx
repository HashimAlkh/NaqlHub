import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import SiteHeader from "@/app/components/SiteHeader";
import {
  Calendar,
  MapPin,
  Package,
  Ruler,
  Truck,
  Weight,
} from "lucide-react";

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

  const mainImage = images[0];
  const dimensions = `${job.length_m || "-"} × ${job.width_m || "-"} × ${
    job.height_m || "-"
  } m`;

  return (
    <main className="min-h-screen bg-[#f2f3f5] text-slate-900">
      <SiteHeader sticky />

      <section className="mx-auto max-w-7xl px-5 py-6 lg:px-10 lg:py-10">
        <Link
          href="/jobs"
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          ← Back to jobs
        </Link>

        <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="relative h-[280px] overflow-hidden bg-slate-200 md:h-[420px]">
                <img
                  src={mainImage}
                  alt={job.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-amber-400 px-3.5 py-1.5 text-xs font-extrabold uppercase text-slate-950 shadow-sm">
                    {job.urgency || "normal"}
                  </span>

                  <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold capitalize text-slate-700 shadow-sm backdrop-blur">
                    {formatValue(job.cargo_type)}
                  </span>
                </div>

                <div className="absolute bottom-5 right-5 rounded-full bg-white/95 px-5 py-2 text-base font-extrabold text-emerald-700 shadow-sm backdrop-blur">
                  {job.budget_sar
                    ? `SAR ${Number(job.budget_sar).toLocaleString()}`
                    : "Open"}
                </div>
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-3 md:grid-cols-5">
                  {images.slice(0, 5).map((image: string, index: number) => (
                    <div
                      key={`${image}-${index}`}
                      className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100"
                    >
                      <img
                        src={image}
                        alt={`${job.title} photo ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-7">
              <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
                {job.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-base font-bold text-slate-900">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  {job.origin_city}
                </span>

                <span className="text-xl font-black text-amber-500">→</span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  {job.destination_city}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-slate-600 shadow-sm ring-1 ring-slate-200">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  {formatDate(job.pickup_date)}
                </span>
              </div>
            </div>

            <div className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-950">
                    Key transport facts
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Core information carriers need before contacting the shipper.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
            </div>

            <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-950">
                Description
              </h2>

              <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600">
                {job.description}
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="bg-[#07152b] p-6 text-white">
                <div className="text-sm text-slate-300">Contact shipper</div>
                <div className="mt-1 text-2xl font-extrabold">
                  {job.contact_name}
                </div>

                <div className="mt-5 rounded-2xl bg-white/10 p-4">
                  <div className="text-sm text-slate-300">Estimated budget</div>
                  <div className="mt-1 text-3xl font-extrabold text-emerald-300">
                    {job.budget_sar
                      ? `SAR ${Number(job.budget_sar).toLocaleString()}`
                      : "Open"}
                  </div>
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
                  className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
                >
                  Contact via WhatsApp
                </a>

                <Link
                  href="/jobs"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
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
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-amber-500">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <div className="mt-3 line-clamp-2 break-words text-base font-extrabold capitalize text-slate-950">
        {value}
      </div>
    </div>
  );
}