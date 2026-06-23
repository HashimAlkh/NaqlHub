"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { normalizeSaudiCity } from "@/app/lib/saudiCities";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export type JobAlert = {
  id: string;
  origin_city: string | null;
  destination_city: string | null;
  cargo_type: string | null;
  vehicle_type: string | null;
  created_at: string | null;
};

function optionalString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim() || null;
}

function safeReturnPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) return "/jobs";
  return value;
}

async function requireAlertUser(returnTo = "/dashboard/job-alerts") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(safeReturnPath(returnTo))}`);
  }

  return user;
}

export async function createJobAlert(formData: FormData) {
  const returnTo = safeReturnPath(String(formData.get("return_to") || "/jobs"));
  const user = await requireAlertUser(returnTo);
  const filters = {
    origin_city: normalizeSaudiCity(optionalString(formData, "origin_city") || "") || null,
    destination_city:
      normalizeSaudiCity(optionalString(formData, "destination_city") || "") || null,
    cargo_type: optionalString(formData, "cargo_type"),
    vehicle_type: optionalString(formData, "vehicle_type"),
  };

  if (!Object.values(filters).some(Boolean)) {
    throw new Error("Choose at least one search filter before creating an alert.");
  }

  const { error } = await supabaseAdmin.from("job_alerts").insert({
    user_id: user.id,
    ...filters,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/jobs");
  revalidatePath("/dashboard/job-alerts");
  redirect("/dashboard/job-alerts?created=1");
}

export async function getUserJobAlerts() {
  const user = await requireAlertUser();
  const { data, error } = await supabaseAdmin
    .from("job_alerts")
    .select("id,origin_city,destination_city,cargo_type,vehicle_type,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<JobAlert[]>();

  if (error) throw new Error(error.message);

  return data || [];
}

export async function deleteJobAlert(alertId: string) {
  const user = await requireAlertUser();
  const { error } = await supabaseAdmin
    .from("job_alerts")
    .delete()
    .eq("id", alertId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/job-alerts");
}
