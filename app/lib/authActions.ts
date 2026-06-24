"use server";

import { redirect } from "next/navigation";
import {
  clearAuthCookies,
  getSupabaseRecoveryClient,
  getAuthenticatedSupabaseClient,
  getCurrentUser,
  getSupabaseAuthClient,
  setAuthCookies,
} from "./auth";
import { normalizeSaudiMobile } from "./saudiPhone";
import { supabaseAdmin } from "./supabaseAdmin";

type AuthErrorCode =
  | "invalid_credentials"
  | "account_not_found"
  | "too_many_attempts"
  | "unavailable"
  | "invalid_email"
  | "full_name_required"
  | "invalid_phone"
  | "password_too_short"
  | "passwords_do_not_match"
  | "invalid_reset_link"
  | "current_password_invalid"
  | "recovery_unavailable"
  | "recovery_rate_limited";

function cleanString(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function safeRedirectPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

function authErrorRedirect(
  path: string,
  code: AuthErrorCode,
  next?: string
): never {
  const params = new URLSearchParams({ error: code });
  if (next) params.set("next", safeRedirectPath(next));
  redirect(`${path}?${params.toString()}`);
}

function authStatusRedirect(path: string, status: string): never {
  redirect(`${path}?status=${encodeURIComponent(status)}`);
}

function mapAuthError(error: { code?: string; message?: string } | null) {
  const code = error?.code?.toLowerCase() || "";
  const message = error?.message?.toLowerCase() || "";

  if (code.includes("invalid_credentials") || message.includes("invalid login")) {
    return "invalid_credentials" as const;
  }
  if (message.includes("not found") || message.includes("user not found")) {
    return "account_not_found" as const;
  }
  if (code.includes("over_request_rate_limit") || message.includes("too many")) {
    return "too_many_attempts" as const;
  }
  if (message.includes("password") && (message.includes("weak") || message.includes("least"))) {
    return "password_too_short" as const;
  }
  if (message.includes("email") && message.includes("invalid")) {
    return "invalid_email" as const;
  }
  return "unavailable" as const;
}

function isUnknownAccountError(error: { code?: string; message?: string } | null) {
  const code = error?.code?.toLowerCase() || "";
  const message = error?.message?.toLowerCase() || "";
  return (
    code.includes("user_not_found") ||
    code.includes("email_not_found") ||
    message.includes("user not found") ||
    message.includes("account not found")
  );
}

function isRecoveryRateLimited(error: { code?: string; status?: number } | null) {
  return error?.code === "over_email_send_rate_limit" || error?.status === 429;
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  );
}

export async function loginWithPassword(formData: FormData) {
  const email = cleanString(formData.get("email")).toLowerCase();
  const password = cleanString(formData.get("password"));
  const next = safeRedirectPath(cleanString(formData.get("next")) || "/dashboard");

  if (!email || !password) authErrorRedirect("/login", "invalid_credentials", next);

  try {
    const supabase = getSupabaseAuthClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      authErrorRedirect("/login", mapAuthError(error), next);
    }

    await setAuthCookies(data.session);
    redirect(next);
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    authErrorRedirect("/login", "unavailable", next);
  }
}

export async function registerWithPassword(formData: FormData) {
  const email = cleanString(formData.get("email")).toLowerCase();
  const password = cleanString(formData.get("password"));
  const fullName = cleanString(formData.get("full_name"));
  const phone = normalizeSaudiMobile(cleanString(formData.get("phone")));
  const companyName = cleanString(formData.get("company_name"));
  const next = safeRedirectPath(cleanString(formData.get("next")) || "/dashboard");

  if (!fullName) authErrorRedirect("/register", "full_name_required", next);
  if (!phone) authErrorRedirect("/register", "invalid_phone", next);
  if (!email.includes("@")) authErrorRedirect("/register", "invalid_email", next);
  if (password.length < 8) authErrorRedirect("/register", "password_too_short", next);

  try {
    const supabase = getSupabaseAuthClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          company_name: companyName || null,
          role: "user",
        },
      },
    });

    if (error || !data.user) authErrorRedirect("/register", mapAuthError(error), next);

    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: fullName,
      phone,
      company_name: companyName || null,
      role: "user",
    });

    if (profileError) authErrorRedirect("/register", "unavailable", next);

    if (data.session) {
      await setAuthCookies(data.session);
      redirect(next);
    }

    redirect(`/login?registered=1&next=${encodeURIComponent(next)}`);
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    authErrorRedirect("/register", "unavailable", next);
  }
}

export async function requestPasswordReset(formData: FormData) {
  const email = cleanString(formData.get("email")).toLowerCase();
  if (!email.includes("@")) authErrorRedirect("/forgot-password", "invalid_email");

  try {
    const supabase = await getSupabaseRecoveryClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl()}/auth/callback?next=/reset-password`,
    });

    if (error) {
      if (isUnknownAccountError(error)) authStatusRedirect("/forgot-password", "sent");
      console.error("Password reset request failed", error);
      if (isRecoveryRateLimited(error)) {
        authErrorRedirect("/forgot-password", "recovery_rate_limited");
      }
      authErrorRedirect("/forgot-password", "recovery_unavailable");
    }
    authStatusRedirect("/forgot-password", "sent");
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    console.error("Password reset request failed", error);
    authErrorRedirect("/forgot-password", "recovery_unavailable");
  }
}

export async function resetPassword(formData: FormData) {
  const password = cleanString(formData.get("password"));
  const confirmPassword = cleanString(formData.get("confirm_password"));

  if (password.length < 8) authErrorRedirect("/reset-password", "password_too_short");
  if (password !== confirmPassword) authErrorRedirect("/reset-password", "passwords_do_not_match");

  const sessionClient = await getAuthenticatedSupabaseClient();
  if (!sessionClient) authErrorRedirect("/forgot-password", "invalid_reset_link");

  try {
    const { error } = await sessionClient.supabase.auth.updateUser({ password });
    if (error) authErrorRedirect("/reset-password", mapAuthError(error));
    await clearAuthCookies();
    authStatusRedirect("/login", "password_reset");
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    authErrorRedirect("/reset-password", "unavailable");
  }
}

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard/profile");

  const fullName = cleanString(formData.get("full_name"));
  const phone = normalizeSaudiMobile(cleanString(formData.get("phone")));
  const companyName = cleanString(formData.get("company_name"));

  if (!fullName) authErrorRedirect("/dashboard/profile", "full_name_required");
  if (!phone) authErrorRedirect("/dashboard/profile", "invalid_phone");

  try {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ full_name: fullName, phone, company_name: companyName || null })
      .eq("id", user.id);

    if (error) authErrorRedirect("/dashboard/profile", "unavailable");

    const sessionClient = await getAuthenticatedSupabaseClient();
    if (sessionClient) {
      await sessionClient.supabase.auth.updateUser({
        data: { full_name: fullName, phone, company_name: companyName || null },
      });
    }

    authStatusRedirect("/dashboard/profile", "profile_updated");
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    authErrorRedirect("/dashboard/profile", "unavailable");
  }
}

export async function changePassword(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.email) redirect("/login?next=/dashboard/profile");

  const currentPassword = cleanString(formData.get("current_password"));
  const password = cleanString(formData.get("password"));
  const confirmPassword = cleanString(formData.get("confirm_password"));

  if (password.length < 8) authErrorRedirect("/dashboard/profile", "password_too_short");
  if (password !== confirmPassword) authErrorRedirect("/dashboard/profile", "passwords_do_not_match");

  try {
    const supabase = getSupabaseAuthClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (error || !data.session) {
      authErrorRedirect("/dashboard/profile", "current_password_invalid");
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) authErrorRedirect("/dashboard/profile", mapAuthError(updateError));

    authStatusRedirect("/dashboard/profile", "password_updated");
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    authErrorRedirect("/dashboard/profile", "unavailable");
  }
}

export async function logout() {
  await clearAuthCookies();
  redirect("/login");
}
