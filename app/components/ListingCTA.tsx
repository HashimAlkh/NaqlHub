type ListingCTAProps = {
  listingId?: string;
  city?: string;
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
};

function formatGermanDate(iso?: string) {
  if (!iso) return "__.__.____";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "__.__.____";
  return `${d}.${m}.${y}`;
}

export default function ListingCTA({ listingId, city, from, to }: ListingCTAProps) {
  const msg = `Hallo, ich interessiere mich für das Inserat (${listingId ?? "—"})${
    city ? ` in ${city}` : ""
  }.
Zeitraum: ${formatGermanDate(from)} bis ${formatGermanDate(to)}.
Ich bin: PJ / Famulatur / Pflegepraktikum.
Viele Grüße`;

  return (
    <div className="listing-cta rounded-2xl border bg-white p-5 h-fit">
      <div className="text-sm text-slate-500">Preis</div>
      <div className="text-2xl font-semibold mt-1">— €</div>
      <div className="text-xs text-slate-500 mt-1">pro Monat</div>

      <div className="my-4 h-px bg-slate-200" />

      <form
        className="space-y-3"
        action="mailto:medstay.demo@gmail.com"
        method="post"
        encType="text/plain"
      >
        <input
          type="text"
          name="Name"
          placeholder="Dein Name"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          name="E-Mail"
          placeholder="Deine E-Mail"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <textarea
          name="Nachricht"
          rows={6}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          defaultValue={msg}
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700"
        >
          Kontakt anfragen
        </button>

        <p className="text-xs text-slate-500">(MVP) Anfrage wird per E-Mail versendet.</p>
      </form>
    </div>
  );
}