import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import FeaturedJobsCarouselClient from "./FeaturedJobsCarouselClient";
import { getCurrentUser } from "@/app/lib/auth";
import { getFavoriteJobIds } from "@/app/lib/favorites";
import { getLocale } from "@/app/lib/locale";

type TransportJob = {
  id: string;
  title: string;
  cargo_type: string | null;
  vehicle_type: string | null;
  weight_kg: number | null;
  budget_sar: number | null;
  origin_city: string | null;
  destination_city: string | null;
  pickup_date: string | null;
  urgency: string | null;
  image_urls: string[] | null;
};

export default async function FeaturedJobsCarousel() {
  const locale = await getLocale();
  const { data, error } = await supabaseAdmin
    .from("transport_jobs")
    .select(
  "id,title,cargo_type,vehicle_type,weight_kg,budget_sar,origin_city,destination_city,pickup_date,urgency,image_urls,created_at"
)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("FeaturedJobsCarousel error:", error.message);
    return null;
  }

  const jobs = (data ?? []) as TransportJob[];
  if (jobs.length === 0) return null;
  const user = await getCurrentUser();
  const favoriteJobIds = user
    ? await getFavoriteJobIds(
        user.id,
        jobs.map((job) => job.id)
      )
    : new Set<string>();

  return (
    <FeaturedJobsCarouselClient
      jobs={jobs}
      favoriteJobIds={Array.from(favoriteJobIds)}
      locale={locale}
    />
  );
}
