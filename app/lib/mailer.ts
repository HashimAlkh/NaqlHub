import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  const from = process.env.RESEND_FROM || "Medstay <onboarding@resend.dev>";

  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing – skipping email send");
    return;
  }

  const { error } = await resend.emails.send({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Email konnte nicht gesendet werden");
  }
}