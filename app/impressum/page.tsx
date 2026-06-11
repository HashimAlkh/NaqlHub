import SiteHeader from "@/app/components/SiteHeader";

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Impressum
          </h1>

          <div className="mt-8 space-y-8 text-base leading-7 text-slate-700">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Angaben gemäß § 5 TMG
              </h2>

              <p className="mt-3">
                Hashim Alkhateeb
                <br />
                Cheliusstraße 1-3
                <br />
                68167 Mannheim
                <br />
                Deutschland
              </p>

              <p className="mt-4">
                E-Mail:{" "}
                <a
                  href="mailto:Alkhateeb.Hashim@outlook.com"
                  className="font-medium text-teal-700 hover:text-teal-800"
                >
                  kontakt@med-stay.de
                </a>
              </p>
            </section>

            <section>
              <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Verantwortlich für den Inhalt
              </h2>

              <p className="mt-3">
                Hashim Alkhateeb
                <br />
                Cheliusstraße 1-3
                <br />
                68167 Mannheim
              </p>
            </section>

            <section className="mt-6 rounded-2xl bg-slate-50 p-5">
              <h2 className="font-semibold text-slate-900">
                Hinweis zur Plattform
              </h2>

              <p className="mt-3">
                medstay ist eine digitale Plattform zur Vermittlung von
                Wohnungs- und Zimmerangeboten. medstay tritt nicht als
                Vermieter, Makler oder Vertragspartei von Mietverträgen auf.
              </p>

              <p className="mt-3">
                Verträge kommen ausschließlich zwischen den jeweiligen Nutzern
                zustande.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}