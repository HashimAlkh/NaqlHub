export function formatWeight(
  weightKg: number | null | undefined,
  fallback = "Weight not set"
) {
  const value = Number(weightKg);

  if (!Number.isFinite(value) || value <= 0) return fallback;

  if (value < 1000) {
    return `${new Intl.NumberFormat("en-GB").format(value)} kg`;
  }

  return `${new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 1,
  }).format(value / 1000)} t`;
}
