export type Furnished = "yes" | "partial" | "no";

export type ListingDraft = {
  id: string;
  title: string;
  city: string;
  price: number;
  available_from: string; // YYYY-MM-DD
  available_to: string;   // YYYY-MM-DD
  email: string | null;
  status: "draft" | "submitted" | "published";

  // new fields
  housing_type: string | null;
  distance_km: number | null;
  furnished: Furnished | null;
  wifi: boolean | null;
  kitchen: boolean | null;
  washing_machine: boolean | null;
  elevator: boolean | null;
  basement: boolean | null;

  image_url: string | null; // later
};