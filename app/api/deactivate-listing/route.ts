import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function POST(req: Request) {
  const formData = await req.formData();
  const token = String(formData.get("token") || "");

  if (!token) {
    return Response.json(
      { error: "Missing token" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("listings")
    .update({
      status: "inactive",
    })
    .eq("manage_token", token);

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/listing-deactivated",
    },
  });
}