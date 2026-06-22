import SiteHeader from "../../components/SiteHeader";
import CreateListingForm from "../form/CreateListingForm";
import { requireUser } from "../../lib/auth";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { getTranslations } from "../../i18n";
import { getLocale } from "../../lib/locale";

export const dynamic = "force-dynamic";

export default async function CreateListingFormPage() {
  const user = await requireUser("/login?next=/create-listing/form");
  const locale = await getLocale();
  const t = getTranslations(locale).form;
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name, phone, company_name")
    .eq("id", user.id)
    .maybeSingle();

  const contactDefaults = {
    contact_name: profile?.company_name || profile?.full_name || "",
    whatsapp_number: profile?.phone || "",
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader sticky />

      <section className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {t.createTitle}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {t.createDescription}
        </p>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <CreateListingForm
            initialDraft={null}
            contactDefaults={contactDefaults}
            locale={locale}
          />
        </div>
      </section>
    </main>
  );
}
