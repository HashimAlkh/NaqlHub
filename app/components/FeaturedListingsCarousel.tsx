import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import FeaturedListingsCarouselClient from "./FeaturedListingsCarouselClient";

type Listing = {
  id: string;
  title: string;
  city: string;
  country: string | null;
  price: number;
  rooms: number | null;
  size_sqm: number | null;
  available_from: string;
  available_to: string;
  housing_type: string | null;
  image_url: string | null;
  equipment: {
    wifi?: boolean;
    washing_machine?: boolean;
    parking?: boolean;
  } | null;
};

export default async function FeaturedListingsCarousel() {
  const { data, error } = await supabaseAdmin
    .from("listings")
    .select(
      "id,title,city,country,price,rooms,size_sqm,available_from,available_to,housing_type,image_url,equipment,published_at"
    )
    .eq("status", "active")
    .order("published_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("FeaturedListingsCarousel error:", error.message);
    return null;
  }

  const listings = (data ?? []) as Listing[];
  if (listings.length === 0) return null;

  return <FeaturedListingsCarouselClient listings={listings} />;
}