import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/app/components/SiteHeader";
import CreateListingForm, {
  type TransportJobFormInitialValues,
} from "@/app/create-listing/form/CreateListingForm";
import { requireUser } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getLocale } from "@/app/lib/locale";
import { getTranslations } from "@/app/i18n";

export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser("/login?next=/dashboard/jobs");
  const locale = await getLocale();
  const t = getTranslations(locale).form;
  const { id } = await params;

  const { data: job } = await supabaseAdmin
    .from("transport_jobs")
    .select(
      "id,title,cargo_type,vehicle_type,weight_kg,budget_sar,length_m,width_m,height_m,origin_city,destination_city,pickup_date,urgency,description,contact_name,whatsapp_number,image_urls"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!job) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader sticky />

      <section className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <Link
          href="/dashboard/jobs"
          className="text-sm font-bold text-amber-600 hover:text-amber-700"
        >
          {t.backToMyJobs}
        </Link>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
          {t.editTitle}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {t.editDescription}
        </p>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <CreateListingForm
            initialDraft={job as TransportJobFormInitialValues}
            locale={locale}
          />
        </div>
      </section>
    </main>
  );
}
