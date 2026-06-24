function getSaudiPhoneDigits(value: string) {
  const cleaned = value.trim().replace(/[\s\-()]/g, "");
  if (!/^\+?\d+$/.test(cleaned)) return null;

  let digits = cleaned.replace(/^\+/, "");

  if (digits.startsWith("00966")) digits = digits.slice(5);
  else if (digits.startsWith("966")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);

  return digits;
}

/**
 * Normalizes Saudi contact numbers used for jobs and profiles during the soft launch.
 * It intentionally accepts business and central numbers; OTP flows should use the
 * strict mobile helper below instead.
 */
export function normalizeSaudiPhoneFlexible(value: string) {
  const digits = getSaudiPhoneDigits(value);

  return digits && /^\d{7,12}$/.test(digits) ? `+966${digits}` : null;
}

/** Strict Saudi mobile validation reserved for future OTP or WhatsApp verification. */
export function normalizeSaudiMobileStrict(value: string) {
  const digits = getSaudiPhoneDigits(value);

  return digits && /^5\d{8}$/.test(digits) ? `+966${digits}` : null;
}

/** @deprecated Use normalizeSaudiPhoneFlexible for profile and job contact data. */
export const normalizeSaudiMobile = normalizeSaudiMobileStrict;

export function getSaudiMobileLocal(value: string | null | undefined) {
  const normalized = normalizeSaudiPhoneFlexible(value || "");
  return normalized ? normalized.slice(4) : value || "";
}

export function formatSaudiMobile(value: string | null | undefined) {
  return normalizeSaudiPhoneFlexible(value || "") || value || "";
}
