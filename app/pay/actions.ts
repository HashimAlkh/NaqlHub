"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { LISTING_FEE_EUR } from "@/app/lib/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // apiVersion absichtlich weggelassen (TS-Fehler vermeiden)
});

export async function startCheckout(formData: FormData) {
  const draftId = String(formData.get("draft_id") || "").trim();
  if (!draftId) throw new Error("draft_id fehlt");

  // Draft prüfen (existiert + noch nicht bezahlt)
  const { data: draft, error } = await supabaseAdmin
    .from("listing_drafts")
    .select("id,title,city,paid_at,payment_status,status")
    .eq("id", draftId)
    .single();

  if (error || !draft) throw new Error("Draft nicht gefunden");

  // wenn schon bezahlt -> direkt zurück zur Preview
  if (draft.paid_at || draft.payment_status === "paid") {
    redirect(`/create-listing/preview?draft=${encodeURIComponent(draftId)}&paid=1`);
  }

  // Wichtig: das muss deine Codespaces https://*.app.github.dev URL sein
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    // ✅ robust: Draft ID doppelt speichern
    client_reference_id: draftId,
    metadata: { draft_id: draftId },

    payment_method_types: ["card"],

    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(LISTING_FEE_EUR * 100),
          product_data: {
            name: "Medstay Inserat einstellen",
            description: `Inserat-ID: ${draftId}`,
          },
        },
      },
    ],

    success_url: `${origin}/create-listing/success?draft=${encodeURIComponent(
      draftId
    )}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/create-listing/preview?draft=${encodeURIComponent(draftId)}&canceled=1`,
  });

  redirect(session.url!);
}