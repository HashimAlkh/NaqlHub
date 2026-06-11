import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { track } from "@vercel/analytics/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getBaseUrl(req: Request) {
  const h = req.headers;
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    new URL(req.url).host;
  return `${proto}://${host}`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const draftId = (url.searchParams.get("draft") || "").trim();
  const token = (url.searchParams.get("token") || "").trim();

  const base = getBaseUrl(req);

  if (!draftId || !token) {
    return NextResponse.redirect(`${base}/create-listing/form`);
  }

  const { data: draft, error } = await supabase
    .from("listing_drafts")
    .select("id,email_verified,email_verification_token")
    .eq("id", draftId)
    .single();

  if (error || !draft) {
    return NextResponse.redirect(`${base}/create-listing/form`);
  }

// Schon verifiziert? Dann direkt zur Erfolgsseite
if (draft.email_verified) {
  return NextResponse.redirect(
    `${base}/create-listing/success?draft=${encodeURIComponent(draftId)}&submitted=1`
  );
}

  if (draft.email_verification_token !== token) {
    return NextResponse.redirect(
      `${base}/create-listing/preview?draft=${encodeURIComponent(draftId)}&verify=invalid`
    );
  }

await supabase
  .from("listing_drafts")
  .update({
    email_verified: true,
    email_verification_token: null,
    status: "submitted",
  })
  .eq("id", draftId);
  await track("listing_email_verified");
  await track("listing_submitted");

return NextResponse.redirect(
  `${base}/create-listing/success?draft=${encodeURIComponent(draftId)}&submitted=1`
);
}