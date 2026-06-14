"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JOB_IMAGES_BUCKET = "job-images";
const MAX_IMAGES = 5;

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getImageFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0)
    .slice(0, MAX_IMAGES);
}

function optionalNumber(value: FormDataEntryValue | null) {
  if (value === null) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
}

function requiredString(formData: FormData, key: string) {
  const value = String(formData.get(key) || "").trim();
  if (!value) throw new Error(`${key} is required`);
  return value;
}

export async function createTransportJob(formData: FormData) {
  const company = String(formData.get("company") || "").trim();

  if (company.length > 0) {
    return {
      ok: true,
      redirectTo: "/create-listing/success",
    };
  }

  const imageFiles = getImageFiles(formData);

  const payload = {
    title: requiredString(formData, "title"),
    cargo_type: requiredString(formData, "cargo_type"),
    vehicle_type: requiredString(formData, "vehicle_type"),
    weight_kg: Number(requiredString(formData, "weight_kg")),
    budget_sar: optionalNumber(formData.get("budget_sar")),
    length_m: optionalNumber(formData.get("length_m")),
    width_m: optionalNumber(formData.get("width_m")),
    height_m: optionalNumber(formData.get("height_m")),
    origin_city: requiredString(formData, "origin_city"),
    destination_city: requiredString(formData, "destination_city"),
    pickup_date: requiredString(formData, "pickup_date"),
    urgency: requiredString(formData, "urgency"),
    description: requiredString(formData, "description"),
    contact_name: requiredString(formData, "contact_name"),
    whatsapp_number: requiredString(formData, "whatsapp_number"),
    status: "approved",
  };

  const { data, error } = await supabase
    .from("transport_jobs")
    .insert([payload])
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Transport job could not be saved");
  }

  const uploadedImageUrls: string[] = [];

  for (let index = 0; index < imageFiles.length; index += 1) {
    const file = imageFiles[index];
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${index + 1}-${Date.now()}-${safeFileName(
      file.name || `image.${fileExt}`
    )}`;
    const filePath = `${data.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(JOB_IMAGES_BUCKET)
      .upload(filePath, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from(JOB_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    uploadedImageUrls.push(publicUrlData.publicUrl);
  }

  if (uploadedImageUrls.length > 0) {
    const { error: imageUpdateError } = await supabase
      .from("transport_jobs")
      .update({ image_urls: uploadedImageUrls })
      .eq("id", data.id);

    if (imageUpdateError) {
      throw new Error(imageUpdateError.message);
    }
  }

  return {
    ok: true,
    jobId: data.id,
    redirectTo: "/create-listing/success",
  };
}