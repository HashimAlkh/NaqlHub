import Stripe from "stripe";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs"; // wichtig: Stripe Webhook braucht Node runtime

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // apiVersion absichtlich weggelassen (TS-Fehler bei dir)
});

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook signature verification failed";
    return new Response(msg, { status: 400 });
  }

  try {
    // Wir reagieren NUR auf checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const draftId = session.metadata?.draft_id;

      // nur wenn wirklich bezahlt
      const paid = session.payment_status === "paid";

      if (draftId && paid) {
        // idempotent: mehrfaches Event ist egal
        await supabaseAdmin
          .from("listing_drafts")
          .update({
            payment_status: "paid",
            paid_at: new Date().toISOString(),
          })
          .eq("id", draftId)
          .neq("payment_status", "paid");
      }
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook handler error";
    return new Response(msg, { status: 500 });
  }
}