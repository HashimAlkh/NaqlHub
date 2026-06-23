import SiteHeader from "../components/SiteHeader";
import ListingFlow from "../components/ListingFlow";
import { requireUser } from "../lib/auth";
import { getLocale } from "../lib/locale";

export const dynamic = "force-dynamic";

export default async function CreateListingPage() {
  await requireUser("/login?next=/create-listing");
  const locale = await getLocale();

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader sticky />

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Post Transport Job
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Post your transport request in a few simple steps.
          </h1>

          <p className="mt-4 text-slate-600">
            Connect with transport providers across Saudi Arabia for heavy,
            oversized and industrial cargo.
          </p>
        </div>

        <div className="mt-12">
          <ListingFlow locale={locale} />
        </div>
      </section>
    </main>
  );
}
