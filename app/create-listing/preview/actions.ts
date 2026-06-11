"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend =
  process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function siteUrl() {
  return (
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://organic-parakeet-rxvq4pgg55xfpp5j-3000.app.github.dev"
  ).replace(/\/$/, "");
}

async function sendVerificationEmail(
  toEmail: string,
  draftId: string,
  token: string
) {
  if (!resend) throw new Error("RESEND_API_KEY fehlt");
  if (!process.env.RESEND_FROM) throw new Error("RESEND_FROM fehlt");

  const verifyLink = `${siteUrl()}/auth/verify?draft=${encodeURIComponent(
    draftId
  )}&token=${encodeURIComponent(token)}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: [toEmail],
    subject: "Bitte bestätige deine E-Mail für dein Medstay-Inserat",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.5">
        <p>Hi,</p>
        <p>bitte bestätige kurz deine E-Mail-Adresse, damit du dein Inserat kostenlos einreichen kannst.</p>
        <p>
          <a href="${verifyLink}" target="_self" rel="noopener" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#14b8a6;color:#fff;text-decoration:none;font-weight:600">
            E-Mail bestätigen
          </a>
        </p>
        <p style="color:#64748b;font-size:12px">
          Falls der Button nicht geht, kopiere diesen Link in den Browser:<br/>
          ${verifyLink}
        </p>
      </div>
    `,
  });
}

async function sendAdminNotification(draftId: string) {
  if (!resend) return;
  if (!process.env.RESEND_FROM) return;
  if (!process.env.ADMIN_EMAIL) return;

  const adminUrl = `${siteUrl()}/admin?key=${encodeURIComponent(
    process.env.ADMIN_KEY || ""
  )}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: [process.env.ADMIN_EMAIL],
    subject: "Neues Medstay-Inserat wartet auf Prüfung",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.5">
        <p>Ein neues Inserat wurde eingereicht und wartet auf Prüfung.</p>
        <p><b>Draft-ID:</b> ${draftId}</p>
        <p>
          <a href="${adminUrl}" target="_blank" rel="noopener">
            Zum Adminbereich
          </a>
        </p>
      </div>
    `,
  });
}

export async function submitDraft(formData: FormData) {
  const id = String(formData.get("draft_id") || "").trim();

  if (!id) {
    throw new Error("Missing draft_id");
  }

  const { data: draft, error: fetchErr } = await supabase
    .from("listing_drafts")
    .select("id,email_verified")
    .eq("id", id)
    .single();

  if (fetchErr || !draft) {
    throw new Error(fetchErr?.message || "Draft not found");
  }

  if (!draft.email_verified) {
    redirect(
      `/create-listing/preview?draft=${encodeURIComponent(id)}&verify=required`
    );
  }



  const { error } = await supabase
    .from("listing_drafts")
    .update({
      status: "submitted",
      payment_status: "paid",
    })
    .eq("id", id);

if (error) {
  throw new Error(error.message);
}

try {
  await sendAdminNotification(id);
} catch (e) {
  console.error("Admin notification failed:", e);
}

redirect(`/create-listing/success?draft=${encodeURIComponent(id)}`);
}

export async function resendVerification(formData: FormData) {
  const id = String(formData.get("draft_id") || "").trim();

  if (!id) {
    throw new Error("Missing draft_id");
  }

  const { data: draft, error } = await supabase
    .from("listing_drafts")
    .select(
      "id,email,email_verified,email_verification_token,email_verification_sent_at"
    )
    .eq("id", id)
    .single();

  if (error || !draft) {
    redirect(
      `/create-listing/preview?draft=${encodeURIComponent(id)}&resend=error`
    );
  }

  if (draft.email_verified) {
    redirect(
      `/create-listing/preview?draft=${encodeURIComponent(id)}&verified=1`
    );
  }

  const lastSent = draft.email_verification_sent_at
    ? new Date(draft.email_verification_sent_at).getTime()
    : 0;

  if (lastSent && Date.now() - lastSent < 60_000) {
    redirect(
      `/create-listing/preview?draft=${encodeURIComponent(
        id
      )}&resend=too_fast`
    );
  }

  const email = String(draft.email || "").trim().toLowerCase();

  if (!email) {
    redirect(
      `/create-listing/preview?draft=${encodeURIComponent(id)}&resend=no_email`
    );
  }

  const token =
    (draft.email_verification_token &&
      String(draft.email_verification_token)) ||
    crypto.randomBytes(24).toString("hex");

  const { error: updErr } = await supabase
    .from("listing_drafts")
    .update({
      email_verification_token: token,
      email_verification_sent_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updErr) {
    redirect(
      `/create-listing/preview?draft=${encodeURIComponent(id)}&resend=error`
    );
  }

  try {
    await sendVerificationEmail(email, id, token);
    redirect(`/create-listing/preview?draft=${encodeURIComponent(id)}&resend=1`);
  } catch (e) {
    console.error("resendVerification failed:", e);
    redirect(
      `/create-listing/preview?draft=${encodeURIComponent(
        id
      )}&resend=mail_fail`
    );
  }
}