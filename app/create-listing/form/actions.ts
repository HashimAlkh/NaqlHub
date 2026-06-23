"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/lib/auth";
import { normalizeSaudiCity } from "@/app/lib/saudiCities";

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

function requiredWeightKg(formData: FormData) {
  const tons = Number(requiredString(formData, "weight_kg"));

  if (!Number.isFinite(tons) || tons <= 0) {
    throw new Error("weight_kg must be a positive weight in tonnes");
  }

  return Math.round(tons * 1000);
}

function jobPayload(formData: FormData, userId: string) {
  return {
    title: requiredString(formData, "title"),
    cargo_type: requiredString(formData, "cargo_type"),
    vehicle_type: requiredString(formData, "vehicle_type"),
    weight_kg: requiredWeightKg(formData),
    budget_sar: optionalNumber(formData.get("budget_sar")),
    length_m: optionalNumber(formData.get("length_m")),
    width_m: optionalNumber(formData.get("width_m")),
    height_m: optionalNumber(formData.get("height_m")),
    origin_city: normalizeSaudiCity(requiredString(formData, "origin_city")),
    destination_city: normalizeSaudiCity(requiredString(formData, "destination_city")),
    pickup_date: requiredString(formData, "pickup_date"),
    urgency: requiredString(formData, "urgency"),
    description: requiredString(formData, "description"),
    contact_name: requiredString(formData, "contact_name"),
    whatsapp_number: requiredString(formData, "whatsapp_number"),
    user_id: userId,
  };
}

async function uploadJobImages(jobId: string, imageFiles: File[]) {
  const uploadedImageUrls: string[] = [];

  for (let index = 0; index < imageFiles.length; index += 1) {
    const file = imageFiles[index];
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${index + 1}-${Date.now()}-${safeFileName(
      file.name || `image.${fileExt}`
    )}`;
    const filePath = `${jobId}/${fileName}`;

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

  return uploadedImageUrls;
}

function remainingImageUrls(formData: FormData) {
  const raw = String(formData.get("remaining_image_urls") || "[]");

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

export async function createTransportJob(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      redirectTo: "/login?next=/create-listing/form",
    };
  }

  const company = String(formData.get("company") || "").trim();

  if (company.length > 0) {
    return {
      ok: true,
      redirectTo: "/create-listing/success",
    };
  }

  const imageFiles = getImageFiles(formData);

  const payload = {
    ...jobPayload(formData, user.id),
    status: "active",
  };

  const { data, error } = await supabase
    .from("transport_jobs")
    .insert([payload])
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Transport job could not be saved");
  }

  const uploadedImageUrls = await uploadJobImages(data.id, imageFiles);

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

export async function updateTransportJob(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      redirectTo: "/login?next=/dashboard/jobs",
    };
  }

  const jobId = String(formData.get("job_id") || "").trim();
  if (!jobId) throw new Error("Job id is required");

  const { data: existingJob, error: fetchError } = await supabase
    .from("transport_jobs")
    .select("id")
    .eq("id", jobId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError || !existingJob) {
    throw new Error("Job not found or you do not have permission.");
  }

  const retainedImageUrls = remainingImageUrls(formData);
  const uploadedImageUrls = await uploadJobImages(jobId, getImageFiles(formData));
  const image_urls = [...retainedImageUrls, ...uploadedImageUrls].slice(
    0,
    MAX_IMAGES
  );

  const { error } = await supabase
    .from("transport_jobs")
    .update({
      ...jobPayload(formData, user.id),
      image_urls,
    })
    .eq("id", jobId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/jobs");
  revalidatePath(`/dashboard/jobs/${jobId}/edit`);
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/jobs");
  revalidatePath("/");

  return {
    ok: true,
    jobId,
    redirectTo: "/dashboard/jobs",
  };
}
