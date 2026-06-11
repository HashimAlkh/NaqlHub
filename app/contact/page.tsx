import SiteHeader from "@/app/components/SiteHeader";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Kontakt
          </h1>

          <div className="mt-8 space-y-4 text-base leading-7 text-slate-700">
            <p>
              Du hast Fragen zu einem Inserat, Probleme bei der Nutzung oder
              Feedback zu medstay?
            </p>

            <p>
              Schreib uns jederzeit — wir versuchen so schnell wie möglich zu
              antworten.
            </p>

            <p>
              medstay wird aktuell von Medizinstudierenden aufgebaut und befindet
              sich noch in der Early-Access-Phase.
            </p>

            <section className="mt-8 rounded-2xl bg-slate-50 p-5">
              <h2 className="font-semibold text-slate-900">
                E-Mail
              </h2>

              <p className="mt-3">
                <a
                  href="mailto:kontakt@med-stay.de"
                  className="font-medium text-teal-700 hover:text-teal-800"
                >
                  kontakt@med-stay.de
                </a>
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Für Fragen, Feedback oder Probleme rund um medstay.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}