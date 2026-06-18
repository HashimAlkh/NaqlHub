"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";
import { supabaseAdmin } from "./supabaseAdmin";

async function requireFavoriteUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

function revalidateFavoriteViews(jobId: string) {
  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard/liked-jobs");
}

export async function addFavorite(jobId: string) {
  const user = await requireFavoriteUser();

  const { error } = await supabaseAdmin.from("job_favorites").upsert(
    {
      user_id: user.id,
      job_id: jobId,
    },
    {
      onConflict: "user_id,job_id",
      ignoreDuplicates: true,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidateFavoriteViews(jobId);
}

export async function removeFavorite(jobId: string) {
  const user = await requireFavoriteUser();

  const { error } = await supabaseAdmin
    .from("job_favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("job_id", jobId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateFavoriteViews(jobId);
}

export async function toggleFavorite(jobId: string, isFavorited: boolean) {
  if (isFavorited) {
    await removeFavorite(jobId);
    return;
  }

  await addFavorite(jobId);
}
