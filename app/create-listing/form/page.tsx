import SiteHeader from "../../components/SiteHeader";
import CreateListingForm from "../form/CreateListingForm";
import { requireUser } from "../../lib/auth";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function CreateListingFormPage() {
  const user = await requireUser("/login?next=/create-listing/form");
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
          Create Transport Job
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Add the cargo, route, vehicle requirements and WhatsApp contact details.
        </p>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <CreateListingForm initialDraft={null} contactDefaults={contactDefaults} />
        </div>
      </section>
    </main>
  );
}
