import Link from "next/link";
import { startCheckout } from "./actions";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

type SP = Record<string, string | string[] | undefined>;
function pick(sp: SP, key: string) {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v || "").toString().trim();
}

export default async function PayPage({ searchParams }: { searchParams: SP | Promise<SP> }) {
  const sp = await Promise.resolve(searchParams);
  const draftId = pick(sp, "draft");

  let verified = false;
if (draftId) {
  const { data } = await supabaseAdmin
    .from("listing_drafts")
    .select("email_verified")
    .eq("id", draftId)
    .single();
  verified = !!data?.email_verified;
}

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            med<span className="text-blue-600">stay</span>
          </Link>
          <Link
            href={draftId ? `/create-listing/preview?draft=${encodeURIComponent(draftId)}` : "/create-listing"}
            className="text-sm text-slate-600 hover:text-black"
          >
            Zurück
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Bezahlung</h1>
        <p className="mt-2 text-slate-600">
          Für das Einstellen eines Inserats berechnen wir einmalig <span className="font-semibold">29 €</span>.
        </p>

        {draftId && !verified ? (
  <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
    Bitte bestätige zuerst deine E-Mail. Danach kannst du bezahlen.
    <div className="mt-3">
      <Link
        href={`/create-listing/preview?draft=${encodeURIComponent(draftId)}`}
        className="text-sm font-medium text-amber-900 underline"
      >
        Zur Vorschau zurück
      </Link>
    </div>
  </div>
) : (
          <form action={startCheckout} className="mt-6">
            <input type="hidden" name="draft_id" value={draftId} />
            <button className="w-full rounded-xl bg-blue-600 text-white py-3 text-sm font-medium hover:bg-blue-700">
              Jetzt sicher bezahlen
            </button>
            <p className="mt-3 text-xs text-slate-500">Du wirst zu Stripe weitergeleitet.</p>
          </form>
        )}
      </section>
    </main>
  );
}