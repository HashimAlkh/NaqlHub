"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function updateJobStatus(jobId: string, status: string) {
  const allowed = ["pending", "approved", "rejected", "closed"];

  if (!allowed.includes(status)) {
    throw new Error("Invalid status");
  }

  const { error } = await supabaseAdmin
    .from("transport_jobs")
    .update({ status })
    .eq("id", jobId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/jobs");
  revalidatePath("/");
}
export async function deleteJob(jobId: string) {
  const { error } = await supabaseAdmin
    .from("transport_jobs")
    .delete()
    .eq("id", jobId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/jobs");
  revalidatePath("/");
}