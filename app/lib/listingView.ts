import type { EquipmentMetaKey } from "./equipmentMeta";

export function formatGermanDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}

export function distanceLabelKm(km: number | null | undefined) {
  if (km === null || km === undefined) return "";
  if (Number.isNaN(Number(km))) return "";
  return `${Number(km).toLocaleString("de-DE", { maximumFractionDigits: 1 })} km`;
}

export function furnishedLabel(v: string | null) {
  if (!v) return "";
  if (v === "yes") return "möbliert";
  if (v === "no") return "unmöbliert";
  return "";
}

type EquipmentInput = {
  furnished?: string | null;
  housing_type?: string | null;

  wifi?: boolean;
  washing_machine?: boolean;
  elevator?: boolean;
  parking?: boolean;

  bathroom_type?: "private" | "shared" | string | null;
  kitchen_type?: "private" | "shared" | string | null;
};

export function equipmentList(e: EquipmentInput): string[] {
  const out: string[] = [];

  if (e.wifi) out.push("WLAN");
  if (e.washing_machine) out.push("Waschmaschine");
  if (e.elevator) out.push("Aufzug");
  if (e.parking) out.push("Parkplatz");

  if (e.bathroom_type === "private") out.push("Eigenes Bad");
  else if (e.bathroom_type === "shared") out.push("Gemeinsames Bad");

  if (e.kitchen_type === "private") out.push("Eigene Küche");
  else if (e.kitchen_type === "shared") out.push("Gemeinsame Küche");

  return out;
}

export function equipmentKeys(e: EquipmentInput): EquipmentMetaKey[] {
  const out: EquipmentMetaKey[] = [];

  if (e.wifi) out.push("wifi");
  if (e.washing_machine) out.push("washing_machine");
  if (e.elevator) out.push("elevator");
  if (e.parking) out.push("parking");

  if (e.bathroom_type === "private") out.push("bathroom_private");
  else if (e.bathroom_type === "shared") out.push("bathroom_shared");

  if (e.kitchen_type === "private") out.push("kitchen_private");
  else if (e.kitchen_type === "shared") out.push("kitchen_shared");

  return out;
}