"use server";

import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

function requiredString(formData: FormData, key: string) {
  const value = String(formData.get(key) || "").trim();
  if (!value) throw new Error(`${key} is required`);
  return value;
}

function optionalString(formData: FormData, key: string) {
  const value = String(formData.get(key) || "").trim();
  return value || null;
}

export async function createCarrierAlert(formData: FormData) {
  const payload = {
    name: requiredString(formData, "name"),
    whatsapp_number: requiredString(formData, "whatsapp_number"),
    vehicle_type: optionalString(formData, "vehicle_type"),
    origin_city: optionalString(formData, "origin_city"),
    destination_city: optionalString(formData, "destination_city"),
    is_active: true,
  };

  const { error } = await supabaseAdmin.from("carrier_alerts").insert([payload]);

  if (error) {
    throw new Error(error.message);
  }

  return { ok: true };
}