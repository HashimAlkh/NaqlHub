import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient, type Session, type User } from "@supabase/supabase-js";

const ACCESS_TOKEN_COOKIE = "naqlhub-access-token";
const REFRESH_TOKEN_COOKIE = "naqlhub-refresh-token";
const RECOVERY_VERIFIER_COOKIE = "naqlhub-recovery-verifier";

function createSupabaseAuthClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) throw new Error("Supabase URL is not configured");
  if (!supabaseKey) throw new Error("Supabase public key is not configured");

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function cookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function setAuthCookies(session: Session) {
  const cookieStore = await cookies();

  cookieStore.set(
    ACCESS_TOKEN_COOKIE,
    session.access_token,
    cookieOptions(session.expires_in)
  );
  cookieStore.set(
    REFRESH_TOKEN_COOKIE,
    session.refresh_token,
    cookieOptions(60 * 60 * 24 * 60)
  );
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export async function getSupabaseRecoveryClient() {
  const cookieStore = await cookies();
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) throw new Error("Supabase URL is not configured");
  if (!supabaseKey) throw new Error("Supabase public key is not configured");

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: true,
      flowType: "pkce",
      storage: {
        getItem: () => cookieStore.get(RECOVERY_VERIFIER_COOKIE)?.value || null,
        setItem: (_key, value) => {
          cookieStore.set(RECOVERY_VERIFIER_COOKIE, value, cookieOptions(60 * 10));
        },
        removeItem: () => {
          cookieStore.delete(RECOVERY_VERIFIER_COOKIE);
        },
      },
    },
  });
}

export async function clearRecoveryVerifier() {
  const cookieStore = await cookies();
  cookieStore.delete(RECOVERY_VERIFIER_COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) return null;

  const supabase = createSupabaseAuthClient();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) return null;

  return data.user;
}

export async function getAuthenticatedSupabaseClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken || !refreshToken) return null;

  const supabase = createSupabaseAuthClient();
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error || !data.session) return null;

  return { supabase, session: data.session };
}

export async function requireUser(redirectTo = "/login") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

export function getSupabaseAuthClient() {
  return createSupabaseAuthClient();
}
