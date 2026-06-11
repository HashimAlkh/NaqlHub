import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";

export default function ListingDeactivatedPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader mode="flow" rightLink={{ href: "/", label: "Startseite" }} />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Dein Inserat wurde deaktiviert
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Dein Inserat ist nicht mehr öffentlich sichtbar und erscheint nicht mehr in den Suchergebnissen.
          </p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">
              Was bedeutet das?
            </div>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              <li>• Dein Inserat bleibt intern gespeichert.</li>
              <li>• Interessenten sehen es nicht mehr öffentlich.</li>
              <li>

  • Falls du dein Inserat reaktivieren möchtest,

  kontaktiere uns unter{" "}

  <a

    href="mailto:kontakt@med-stay.de"

    className="font-medium text-teal-700 hover:text-teal-800"

  >

    kontakt@med-stay.de

  </a>

  .

</li>
            </ul>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              Zur Startseite
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}