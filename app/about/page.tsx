import SiteHeader from "@/app/components/SiteHeader";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Über medstay
          </h1>

          <div className="mt-8 space-y-6 text-base leading-8 text-slate-700">
            <p>
              medstay ist eine Plattform für möblierte Zwischenmieten speziell
              für Medizinstudierende.
            </p>

            <p>
              Gerade während Famulaturen, des PJs, Pflegepraktika oder
              Auslandsaufenthalten ist die Wohnungssuche oft unnötig stressig,
              teuer und unflexibel.
            </p>

            <p>
              Gleichzeitig stehen viele Wohnungen oder WG-Zimmer zeitweise leer,
              weil Studierende selbst für einige Monate in einer anderen Stadt
              oder im Ausland sind.
            </p>

            <p>
              medstay möchte Zwischenmieten einfacher machen — sowohl für
              Studierende, die eine Unterkunft suchen, als auch für diejenigen,
              die ihre Wohnung unkompliziert untervermieten möchten.
            </p>

            <section className="mt-8 rounded-2xl bg-slate-50 p-5">
              <h2 className="font-semibold text-slate-900">
                Fokus auf Einfachheit
              </h2>

              <p className="mt-3">
                medstay konzentriert sich bewusst auf das Wesentliche:
                flexible und möblierte Unterkünfte für begrenzte Zeiträume —
                ohne unnötige Komplexität.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}