import "server-only";

import { supabaseAdmin } from "./supabaseAdmin";

export async function getFavoriteJobIds(userId: string, jobIds: string[]) {
  if (jobIds.length === 0) return new Set<string>();

  const { data, error } = await supabaseAdmin
    .from("job_favorites")
    .select("job_id")
    .eq("user_id", userId)
    .in("job_id", jobIds);

  if (error) {
    console.error("Favorite lookup failed:", error.message);
    return new Set<string>();
  }

  return new Set(
    (data || [])
      .map((favorite) => favorite.job_id)
      .filter((jobId): jobId is string => typeof jobId === "string")
  );
}
