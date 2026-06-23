import { getTranslations } from "@/app/i18n";

type TypeLabels = ReturnType<typeof getTranslations>["types"];

const vehicleTypeLabelKeys = {
  lowbed_trailer: "lowbed",
  flatbed_trailer: "flatbed",
  extendable_trailer: "extendable",
  crane_truck: "craneTruck",
  container_truck: "containerTruck",
} as const;

const cargoTypeLabelKeys = {
  heavy_equipment: "heavyEquipment",
  industrial_cargo: "industrial",
  oversized_load: "oversized",
  construction_materials: "construction",
} as const;

function formatType(
  value: string | null | undefined,
  fallback: string,
  labels: TypeLabels,
  labelKeys: Record<string, keyof TypeLabels>
) {
  if (!value) return fallback;

  const key = labelKeys[value];
  return key ? labels[key] : fallback;
}

export function formatVehicleType(
  value: string | null | undefined,
  fallback: string,
  labels: TypeLabels
) {
  return formatType(value, fallback, labels, vehicleTypeLabelKeys);
}

export function formatCargoType(
  value: string | null | undefined,
  fallback: string,
  labels: TypeLabels
) {
  return formatType(value, fallback, labels, cargoTypeLabelKeys);
}
