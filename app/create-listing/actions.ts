"use server";

import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { redirect } from "next/navigation";

function toBool(v: FormDataEntryValue | null) {
  if (v === null) return null;
  const s = String(v).trim().toLowerCase();
  if (s === "true") return true;
  if (s === "false") return false;
  return null;
}

function toNumberOrNull(raw: FormDataEntryValue | null) {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export async function createDraft(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const price = Number(String(formData.get("price") || "0").replace(",", "."));
  const available_from = String(formData.get("from") || "").trim();
  const available_to = String(formData.get("to") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const email = String(formData.get("email") || "").trim();

  const housing_type = String(formData.get("housing_type") || "").trim() || null; // "apartment" | "room"
  const distance_km = toNumberOrNull(formData.get("distance_km"));

  const furnished = toBool(formData.get("furnished")); // true/false/null
  const wifi = formData.get("wifi") === "on";
  const kitchen = formData.get("kitchen") === "on";
  const washing_machine = formData.get("washing_machine") === "on";
  const elevator = formData.get("elevator") === "on";
  const basement = formData.get("basement") === "on";

  const { data, error } = await supabaseAdmin
    .from("listing_drafts")
    .insert([
      {
        title,
        city,
        price,
        available_from,
        available_to,
        description,
        email,
        housing_type,
        distance_km,
        furnished,
        wifi,
        kitchen,
        washing_machine,
        elevator,
        basement,
        status: "draft",
        payment_status: "unpaid",
      },
    ])
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Draft konnte nicht gespeichert werden");
  }

  redirect(`/create-listing/preview?draft=${data.id}`);
}