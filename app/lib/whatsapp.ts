import type { JobAlertNotification } from "@/app/lib/jobAlertNotifications";

const WHATSAPP_API_VERSION = process.env.WHATSAPP_GRAPH_API_VERSION || "v20.0";
const DEFAULT_TEMPLATE_LANGUAGE = "en_US";

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function getWhatsAppConfig() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const jobAlertTemplateName = process.env.WHATSAPP_JOB_ALERT_TEMPLATE_NAME;
  const jobAlertTemplateLanguage =
    process.env.WHATSAPP_JOB_ALERT_TEMPLATE_LANGUAGE || DEFAULT_TEMPLATE_LANGUAGE;

  if (!accessToken || !phoneNumberId || !jobAlertTemplateName) {
    console.error("WhatsApp notification skipped: missing environment variables", {
      hasAccessToken: Boolean(accessToken),
      hasPhoneNumberId: Boolean(phoneNumberId),
      hasJobAlertTemplateName: Boolean(jobAlertTemplateName),
    });
    return null;
  }

  return {
    accessToken,
    phoneNumberId,
    jobAlertTemplateName,
    jobAlertTemplateLanguage,
  };
}

function formatRecipient(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

function formatValue(value: string | null) {
  return value || "Any";
}

function formatBudget(value: number | null) {
  return value ? `SAR ${Number(value).toLocaleString("en-US")}` : "Not specified";
}

function buildJobAlertTemplateParameters(notification: JobAlertNotification) {
  return [
    formatValue(notification.origin),
    formatValue(notification.destination),
    formatValue(notification.cargoType),
    formatValue(notification.vehicleType),
    formatBudget(notification.budgetSar),
    `${getSiteUrl()}/jobs/${notification.jobId}`,
  ].map((text) => ({ type: "text", text }));
}

export async function sendJobAlertTemplate(notification: JobAlertNotification) {
  const config = getWhatsAppConfig();
  if (!config) return false;

  const recipient = formatRecipient(notification.phone);
  const endpoint = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${config.phoneNumberId}/messages`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "template",
        template: {
          name: config.jobAlertTemplateName,
          language: {
            code: config.jobAlertTemplateLanguage,
          },
          components: [
            {
              type: "body",
              parameters: buildJobAlertTemplateParameters(notification),
            },
          ],
        },
      }),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      console.error("WhatsApp template notification failed", {
        status: response.status,
        body: responseBody,
        jobId: notification.jobId,
        userId: notification.userId,
        recipient,
        templateName: config.jobAlertTemplateName,
      });
      return false;
    }

    console.log("WhatsApp template notification sent", {
      status: response.status,
      body: responseBody,
      jobId: notification.jobId,
      userId: notification.userId,
      recipient,
      templateName: config.jobAlertTemplateName,
    });
    return true;
  } catch (error) {
    console.error("WhatsApp template notification request failed", {
      error,
      jobId: notification.jobId,
      userId: notification.userId,
      recipient,
      templateName: config.jobAlertTemplateName,
    });
    return false;
  }
}
