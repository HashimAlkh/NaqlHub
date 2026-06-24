export function normalizeSaudiMobile(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("00966")) digits = digits.slice(5);
  else if (digits.startsWith("966")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);

  return /^5\d{8}$/.test(digits) ? `+966${digits}` : null;
}

export function getSaudiMobileLocal(value: string | null | undefined) {
  const normalized = normalizeSaudiMobile(value || "");
  return normalized ? normalized.slice(4) : value || "";
}

export function formatSaudiMobile(value: string | null | undefined) {
  return normalizeSaudiMobile(value || "") || value || "";
}
