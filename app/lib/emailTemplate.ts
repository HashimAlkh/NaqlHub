export function emailTemplate({
  title,
  content,
  buttonText,
  buttonUrl,
  secondaryButtonText,
  secondaryButtonUrl,
}: {
  title: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
}) {
  return `
    <div style="margin:0;padding:40px 16px;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:24px;padding:40px 32px;border:1px solid #e2e8f0;box-shadow:0 10px 30px rgba(15,23,42,0.05);">

        <div style="text-align:center;margin-bottom:32px;">
          <div style="display:inline-block;padding:10px 18px;border-radius:999px;background:#ccfbf1;color:#0f766e;font-weight:700;font-size:14px;letter-spacing:-0.2px;">
            medstay
          </div>
        </div>

        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;letter-spacing:-0.5px;color:#0f172a;">
          ${title}
        </h1>

        <div style="font-size:15px;line-height:1.7;color:#334155;">
          ${content}
        </div>

        ${
          buttonText && buttonUrl
            ? `
          <div style="margin-top:32px;text-align:center;">
            <a
              href="${buttonUrl}"
              style="
                display:inline-block;
                padding:14px 22px;
                border-radius:14px;
                background:#14b8a6;
                color:#ffffff;
                text-decoration:none;
                font-weight:600;
                font-size:15px;
              "
            >
              ${buttonText}
            </a>
          </div>
        `
            : ""
        }
        ${
  secondaryButtonText && secondaryButtonUrl
    ? `
      <div style="margin-top:12px">
        <a
          href="${secondaryButtonUrl}"
          style="
            display:inline-block;
            padding:10px 14px;
            border-radius:10px;
            border:1px solid #99f6e4;
            color:#0f766e;
            text-decoration:none;
            font-weight:600;
            background:#ffffff;
          "
        >
          ${secondaryButtonText}
        </a>
      </div>
    `
    : ""
}

        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:13px;line-height:1.7;color:#64748b;">
            Bei Fragen oder Änderungswünschen erreichst du uns unter
            <a href="mailto:kontakt@med-stay.de" style="color:#0f766e;text-decoration:none;font-weight:600;">
              kontakt@med-stay.de
            </a>
          </p>
        </div>
      </div>
    </div>
  `;
}