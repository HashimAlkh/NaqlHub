import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function POST(req: Request) {
  const formData = await req.formData();

  const token = String(formData.get("manage_token") || "");

  if (!token) {
    return NextResponse.json(
      { error: "Missing manage token" },
      { status: 400 }
    );
  }

  const { data: listing, error: fetchError } = await supabaseAdmin
    .from("listings")
    .select("id, edit_token_expires_at")
    .eq("manage_token", token)
    .single();

  if (fetchError || !listing) {
    return NextResponse.json(
      { error: "Listing not found" },
      { status: 404 }
    );
  }

  const editable =
    listing.edit_token_expires_at &&
    new Date(listing.edit_token_expires_at) > new Date();

  if (!editable) {
    return NextResponse.json(
      { error: "Edit window expired" },
      { status: 403 }
    );
  }

  const housingType = String(formData.get("housing_type") || "apartment");

const updatePayload: Record<string, unknown> = {
  title: String(formData.get("title") || ""),
  price: Number(formData.get("price") || 0),
  deposit: formData.get("deposit") ? Number(formData.get("deposit")) : null,
  rooms: formData.get("rooms") ? Number(formData.get("rooms")) : null,
  size_sqm: formData.get("size_sqm") ? Number(formData.get("size_sqm")) : null,
  available_from: String(formData.get("from") || ""),
  available_to: String(formData.get("to") || ""),
  description: String(formData.get("description") || ""),
  email: String(formData.get("email") || ""),
  housing_type: housingType,
  equipment: {
    housing_type: housingType,
    wifi: formData.get("wifi") === "on",
    washing_machine: formData.get("washing_machine") === "on",
    parking: formData.get("parking") === "on",
  },
};

  const { error: updateError } = await supabaseAdmin
    .from("listings")
    .update(updatePayload)
    .eq("id", listing.id);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return new Response(null, {
  status: 303,
  headers: {
    Location: `/listing/${listing.id}`,
  },
});
}