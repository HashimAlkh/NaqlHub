"use server";

import { redirect } from "next/navigation";
import { clearAuthCookies, getSupabaseAuthClient, setAuthCookies } from "./auth";
import { supabaseAdmin } from "./supabaseAdmin";

function cleanString(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function authErrorRedirect(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function safeRedirectPath(value: string) {
  if (!value.startsWith("/")) return "/dashboard";
  if (value.startsWith("//")) return "/dashboard";
  return value;
}

export async function loginWithPassword(formData: FormData) {
  const email = cleanString(formData.get("email")).toLowerCase();
  const password = cleanString(formData.get("password"));
  const next = safeRedirectPath(cleanString(formData.get("next")) || "/dashboard");

  if (!email || !password) {
    authErrorRedirect("/login", "Please enter your email and password.");
  }

  const supabase = getSupabaseAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const session = data.session;

  if (error || !session) {
    authErrorRedirect("/login", error?.message || "Login failed.");
  }

  await setAuthCookies(session);
  redirect(next);
}

export async function registerWithPassword(formData: FormData) {
  const email = cleanString(formData.get("email")).toLowerCase();
  const password = cleanString(formData.get("password"));
  const fullName = cleanString(formData.get("full_name"));
  const phone = cleanString(formData.get("phone"));
  const companyName = cleanString(formData.get("company_name"));

  if (!fullName) {
    authErrorRedirect("/register", "Full name is required.");
  }

  if (!phone) {
    authErrorRedirect("/register", "Phone number is required.");
  }

  if (!email || !password) {
    authErrorRedirect("/register", "Please enter your email and password.");
  }

  const supabase = getSupabaseAuthClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        company_name: companyName || null,
        role: "shipper",
      },
    },
  });

  const user = data.user;

  if (error || !user) {
    authErrorRedirect("/register", error?.message || "Registration failed.");
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
    id: user.id,
    email,
    full_name: fullName,
    phone,
    company_name: companyName || null,
    role: "shipper",
  });

  if (profileError) {
    authErrorRedirect("/register", profileError.message);
  }

  if (data.session) {
    await setAuthCookies(data.session);
    redirect("/dashboard");
  }

  redirect("/login?registered=1");
}

export async function logout() {
  await clearAuthCookies();
  redirect("/login");
}
