"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

async function ensureOwnJob(jobId: string, userId: string) {
  const { data: job, error } = await supabaseAdmin
    .from("transport_jobs")
    .select("id")
    .eq("id", jobId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !job) {
    throw new Error("Job not found or you do not have permission.");
  }
}

export async function setOwnJobStatus(formData: FormData) {
  const user = await requireUser("/login?next=/dashboard/jobs");
  const jobId = String(formData.get("job_id") || "").trim();
  const status = String(formData.get("status") || "").trim();

  if (!jobId) throw new Error("Job id is required.");
  if (status !== "active" && status !== "inactive") {
    throw new Error("Invalid status.");
  }

  await ensureOwnJob(jobId, user.id);

  const { error } = await supabaseAdmin
    .from("transport_jobs")
    .update({ status })
    .eq("id", jobId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/jobs");
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/jobs");
  revalidatePath("/");
}

export async function deleteOwnJob(formData: FormData) {
  const user = await requireUser("/login?next=/dashboard/jobs");
  const jobId = String(formData.get("job_id") || "").trim();

  if (!jobId) throw new Error("Job id is required.");

  await ensureOwnJob(jobId, user.id);

  const { error } = await supabaseAdmin
    .from("transport_jobs")
    .delete()
    .eq("id", jobId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/jobs");
  revalidatePath("/jobs");
  revalidatePath("/");
  redirect("/dashboard/jobs");
}
