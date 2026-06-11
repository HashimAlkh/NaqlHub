export const dynamic = "force-dynamic";

import type React from "react";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { LISTING_FEE_ENABLED, LISTING_FEE_LABEL } from "@/app/lib/pricing";
import { submitDraft, resendVerification } from "./actions";
import { equipmentKeys, formatGermanDate, furnishedLabel } from "@/app/lib/listingView";
import { startCheckout } from "@/app/pay/actions";
import SiteHeader from "../../components/SiteHeader";
import { equipmentMeta } from "@/app/lib/equipmentMeta";
import MetaPill from "@/app/components/MetaPill";
import ImageGallery from "@/app/components/ImageGallery";
import ResendButton from "@/app/components/ResendButton";

type SP = Record<string, string | string[] | undefined>;

function pick(sp: SP, key: string) {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v || "").toString().trim();
}

function housingTypeLabel(v: string | null) {
  if (v === "apartment") return "Wohnung";
  if (v === "room") return "Zimmer";
  return "—";
}

function bathroomLabel(v: string | null) {
  if (v === "private") return "eigenes Bad";
  if (v === "shared") return "gemeinsames Bad";
  return "—";
}

function kitchenLabel(v: string | null) {
  if (v === "private") return "eigene Küche";
  if (v === "shared") return "gemeinsame Küche";
  return "—";
}

function Banner({
  tone,
  children,
}: {
  tone: "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
}) {
const cls =
  tone === "success"
    ? "border-green-200 bg-green-50 text-green-700"
    : tone === "warning"
    ? "border-slate-200 bg-slate-100 text-slate-700"
    : tone === "danger"
    ? "border-red-200 bg-red-50 text-red-700"
    : "border-slate-200 bg-slate-100 text-slate-700";

  return (
  <div
    className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${cls}`}
  >
    {children}
  </div>
);
}

/**
 * ✅ WICHTIG:
 * Dieser Typ muss zu deiner Supabase-Tabelle listing_drafts passen.
 * Wenn du Spalten anders benannt hast, passe hier UND im select-String an.
 */
type DraftRow = {
  id: string;
  title: string | null;
  city: string | null;
  country: string | null;
  price: number | null;
  deposit: number | null;
  available_from: string | null;
  available_to: string | null;
  description: string | null;
  first_name: string | null;
last_name: string | null;
email: string | null;
phone: string | null;
phone_country_code: string | null;
  status: string | null;
  created_at: string | null;
  rooms: number | null;
  size_sqm: number | null;
  housing_type: string | null;
  furnished: string | null;

  // ✅ Ausstattung (neu)
  wifi: boolean | null;
  washing_machine: boolean | null;
  elevator: boolean | null;
  parking: boolean | null;

  bathroom_type: string | null; // private | shared
  kitchen_type: string | null;  // private | shared

  // ✅ Adresse (intern)
  street: string | null;
  postal_code: string | null;
  address_note: string | null;

  image_url: string | null;
  image_urls: string[] | null;

  paid_at: string | null;
  payment_status: string | null;

  // ✅ Mail-Verifizierung
  email_verified: boolean | null;
};

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);
  const draftId = pick(sp, "draft");

  // URL-Flags (nur UX-Hinweise)
  const verifiedParam = pick(sp, "verified") === "1";
  const verifyInvalid = pick(sp, "verify") === "invalid";
  const resent = pick(sp, "resent") === "1";
  const resendTooFast = pick(sp, "resent") === "too_fast";

  if (!draftId) {
    return (
      <main className="min-h-screen bg-slate-50">
        <SiteHeader mode="flow" rightLink={{ href: "/create-listing/form", label: "Zurück" }} />
        <section className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-2xl font-semibold tracking-tight">Vorschau</h1>
          <p className="mt-2 text-slate-600">Kein Draft angegeben.</p>
          <p className="mt-3 text-sm text-slate-600">
            Öffne die Seite mit <span className="font-mono">?draft=DEINE_ID</span>.
          </p>
        </section>
      </main>
    );
  }

  const { data: draft, error } = await supabaseAdmin
    .from("listing_drafts")
    .select(
      [
        "id",
        "title",
        "city",
        "country",
        "street",
        "price",
        "deposit",
        "available_from",
        "available_to",
        "description",
        "first_name",
"last_name",
"email",
"phone",
"phone_country_code",
        "status",
        "created_at",
        "housing_type",
        "furnished",
        "wifi",
        "washing_machine",
        "elevator",
        "parking",
        "bathroom_type",
        "kitchen_type",
        "rooms",
        "size_sqm",
        "street",
        "postal_code",
        "address_note",
        "image_url",
        "image_urls",
        "paid_at",
        "payment_status",
        "email_verified",
      ].join(",")
    )
    .eq("id", draftId)
    .single<DraftRow>();

  if (error || !draft) {
    return (
      <main className="min-h-screen bg-slate-50">
        <SiteHeader mode="flow" rightLink={{ href: "/create-listing/form", label: "Zurück" }} />
        <section className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-2xl font-semibold tracking-tight">Vorschau</h1>
          <p className="mt-2 text-slate-600">Draft nicht gefunden.</p>
          <p className="mt-3 text-xs text-slate-500">{error?.message}</p>
        </section>
      </main>
    );
  }

  const hostName =
  draft.first_name && draft.last_name
    ? `${draft.first_name} ${draft.last_name.charAt(0)}.`
    : draft.first_name || "Vermieter";

  // ✅ Wahrheits-Status aus DB
  const isVerified = !!draft.email_verified;
  const isPaid = !!draft.paid_at && draft.payment_status === "paid";
  const isSubmitted = draft.status === "submitted";

  // ✅ Ausstattung als Badges (dein listingView.ts muss das verstehen)
  const badgeKeys = equipmentKeys({
  furnished: draft.furnished,
  housing_type: draft.housing_type,
  wifi: !!draft.wifi,
  washing_machine: !!draft.washing_machine,
  elevator: !!draft.elevator,
  parking: !!draft.parking,
  bathroom_type: draft.bathroom_type,
  kitchen_type: draft.kitchen_type,
});

  const furnished = furnishedLabel(draft.furnished ?? null) || "—";
  
  // ✅ genau 1 Banner: URL-Hinweise priorisieren, danach DB-Status
  let topBanner: React.ReactNode = null;

  if (verifyInvalid) {
    topBanner = (
      <Banner tone="danger">
        Verifizierungslink ungültig oder abgelaufen. Bitte fordere eine neue Bestätigungs-Mail an.
      </Banner>
    );
  } else if (resendTooFast) {
    topBanner = (
      <Banner tone="warning">
        Bitte warte kurz, bevor du die Bestätigungs-Mail erneut anforderst.
      </Banner>
    );
  } else if (resent) {
    topBanner = (
      <Banner tone="success">
        Bestätigungs-Mail wurde erneut gesendet! Bitte prüfe auch den Spam-Ordner.
      </Banner>
    );
  } else if (isSubmitted) {
    topBanner = (
      <Banner tone="success">
        Inserat eingereicht! Wir prüfen es kurz und schalten es anschließend frei.
      </Banner>
    );
  } else if (isPaid) {
    topBanner = (
      <Banner tone="info">Zahlung erfasst! Du kannst dein Inserat jetzt einreichen.</Banner>
    );
  } else if (isVerified) {
    topBanner = (
      <Banner tone="success">
        E-Mail bestätigt! Du kannst dein Inserat jetzt kostenlos einreichen.
      </Banner>
    );
  } else {
    topBanner = (
      <Banner tone="warning">
  Bitte bestätige deine E-Mail-Adresse. Wir haben dir einen
  Bestätigungslink an <b>{draft.email}</b> geschickt. Prüfe bitte
  auch deinen Spam-Ordner.
</Banner>
    );
  }

  const hasAddress =
    !!draft.street || !!draft.postal_code || !!draft.address_note;

  const previewImages =
  draft.image_url && draft.image_urls?.length
    ? [
        draft.image_url,
        ...draft.image_urls.filter(
          (url) => url !== draft.image_url
        ),
      ]
    : draft.image_urls?.length
    ? draft.image_urls
    : draft.image_url
    ? [draft.image_url]
    : [];

  const currencyLabel = draft.country === "Schweiz" ? "CHF" : "€";
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader
  mode="flow"
  rightLink={{
    href: `/create-listing/form?draft=${encodeURIComponent(draft.id)}`,
    label: "Zurück",
  }}
/>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Vorschau</h1>
            
          </div>
          
        </div>

        {topBanner}

        <div className="mt-6">
          {/* Links: Preview Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
           <div className="mb-6">
{previewImages.length > 0 ? (
  <ImageGallery images={previewImages} />
) : (
  <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
    Bild folgt
  </div>
)}
</div>
<div className="flex flex-col gap-8 sm:flex-row sm:items-start">
  {/* LINKS */}
<div className="min-w-0 sm:basis-[68%]">
      <div className="text-sm text-slate-500">
  {draft.city}
  {draft.country ? `, ${draft.country}` : ""}
</div>

    <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
      {draft.title}
    </div>
    {draft.street && (
  <div className="mt-1 text-sm text-slate-600">
    {draft.street}
  </div>
)}

    <div className="mt-5 grid gap-2">
      <div className="text-base text-slate-700">
        <span className="text-slate-500">Zeitraum:</span>{" "}
        {formatGermanDate(draft.available_from)} –{" "}
        {formatGermanDate(draft.available_to)}
      </div>

      <div className="text-base text-slate-700">
        <span className="text-slate-500">Wohnungstyp:</span>{" "}
        {housingTypeLabel(draft.housing_type)}
      </div>
      <div className="text-base text-slate-700">
  <span className="text-slate-500">Zimmer:</span>{" "}
  {draft.rooms ?? "—"}
</div>

<div className="text-base text-slate-700">
  <span className="text-slate-500">Größe:</span>{" "}
  {draft.size_sqm ? `${draft.size_sqm} m²` : "—"}
</div>
      
    </div>

    <div className="mt-6">
      <div className="text-base font-medium text-slate-900">Ausstattung</div>

      <div className="mt-3 flex flex-wrap gap-2">
        {badgeKeys.map((key) => {
          const item = equipmentMeta[key];
          const Icon = item.icon;

          return (
            <MetaPill
              key={key}
              label={item.label}
              icon={<Icon size={12} />}
              variant="highlight"
            />
          );
        })}
      </div>
    </div>
  </div>

  {/* RECHTS */}
<div className="hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm h-fit sm:block sm:basis-[32%] sm:shrink-0">
  <div className="text-sm text-slate-500">Preis</div>
    <div className="mt-1 text-3xl font-semibold text-slate-900">
      {draft.price} {currencyLabel}
    </div>
    <div className="text-sm text-slate-500">pro Monat</div>
    <div className="mt-2 text-sm text-slate-600">
  Kaution:{" "}
  <span className="font-semibold text-slate-900">
    {draft.deposit ? `${draft.deposit} ${currencyLabel}` : "—"}
  </span>
</div>
    <div className="my-4 h-px bg-slate-200" />
 

    <div className="mt-5">
      {!isVerified ? (
        <form action={resendVerification}>
          <input type="hidden" name="draft_id" value={draft.id} />
          <ResendButton />
        </form>
      ) : LISTING_FEE_ENABLED && !isPaid ? (
  <form action={startCheckout}>
    <input type="hidden" name="draft_id" value={draft.id} />
    <button className="w-full rounded-xl bg-teal-600 text-white py-2.5 text-sm font-medium hover:bg-teal-700">
      Jetzt bezahlen ({LISTING_FEE_LABEL} €)
    </button>
  </form>
) : (
<form action={submitDraft}>
  <input type="hidden" name="draft_id" value={draft.id} />
  <button
    type="submit"
    className="w-full rounded-xl cursor-pointer bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
  >
    Inserat kostenlos einreichen
  </button>
</form>
)}
    </div>
    <div className="mt-4 text-xs text-slate-500">
  Inseriert von{" "}
  <span className="font-medium text-slate-700">
    {hostName}
  </span>
</div>
{draft.phone && (
  <div className="mt-2 text-xs text-slate-500">
    Telefon:{" "}
    <a
      href={`tel:${`${draft.phone_country_code || ""}${draft.phone}`.replace(/\s+/g, "")}`}
      className="font-medium text-teal-700 hover:text-teal-800"
    >
      {draft.phone_country_code ? `${draft.phone_country_code} ` : ""}
      {draft.phone}
    </a>
  </div>
)}
  </div>

</div>

            {draft.description ? (
              <div className="mt-4">
                <div className="text-base font-medium text-slate-900">Beschreibung</div>
                <p className="mt-2 text-base text-slate-700 whitespace-pre-line">
                  {draft.description}
                </p>
              </div>
            ) : null}
            <div className="mt-6 sm:hidden">
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
    <div className="text-sm text-slate-500">Preis</div>

    <div className="mt-1 text-3xl font-semibold text-slate-900">
      {draft.price} {currencyLabel}
    </div>

    <div className="text-sm text-slate-500">pro Monat</div>

    <div className="mt-2 text-sm text-slate-600">
      Kaution:{" "}
      <span className="font-semibold text-slate-900">
        {draft.deposit ? `${draft.deposit} ${currencyLabel}` : "—"}
      </span>
    </div>

    <div className="my-4 h-px bg-slate-200" />

    {!isVerified ? (
      <form action={resendVerification}>
        <input type="hidden" name="draft_id" value={draft.id} />
        <ResendButton />
      </form>
    ) : LISTING_FEE_ENABLED && !isPaid ? (
      <form action={startCheckout}>
        <input type="hidden" name="draft_id" value={draft.id} />
        <button className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-medium text-white hover:bg-teal-700">
          Jetzt bezahlen ({LISTING_FEE_LABEL} €)
        </button>
      </form>
    ) : (
      <form action={submitDraft}>
        <input type="hidden" name="draft_id" value={draft.id} />
        <button
          type="submit"
          className="w-full rounded-xl cursor-pointer bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          Inserat kostenlos einreichen
        </button>
      </form>
    )}
    <div className="mt-4 text-xs text-slate-500">
  Inseriert von{" "}
  <span className="font-medium text-slate-700">
    {hostName}
  </span>
</div>
{draft.phone && (
  <div className="mt-2 text-xs text-slate-500">
    Telefon:{" "}
    <a
      href={`tel:${draft.phone}`}
      className="font-medium text-teal-700 hover:text-teal-800"
    >
      {draft.phone}
    </a>
  </div>
)}
  </div>
</div>
          </div>

          
        
        </div>
      </section>
    </main>
  );
}