import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type Session, type User } from "@supabase/supabase-js";

const ACCESS_TOKEN_COOKIE = "naqlhub-access-token";
const REFRESH_TOKEN_COOKIE = "naqlhub-refresh-token";
const SUPABASE_PKCE_COOKIE_MAX_AGE = 60 * 15;

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

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

function getSupabaseConfig() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) throw new Error("Supabase URL is not configured");
  if (!supabaseKey) throw new Error("Supabase public key is not configured");

  return { supabaseUrl, supabaseKey };
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

function supabaseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    maxAge: SUPABASE_PKCE_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
}

function isSupabaseAuthCookieName(name: string) {
  return (
    name.startsWith("sb-") &&
    (name.includes("-auth-token") || name.includes("-code-verifier"))
  );
}

export function getSupabaseAuthCookieNames(cookiesToInspect: { name: string }[]) {
  return cookiesToInspect
    .map((cookie) => cookie.name)
    .filter(isSupabaseAuthCookieName)
    .sort();
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

export async function getSupabaseServerActionClient() {
  const cookieStore = await cookies();
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookieOptions: supabaseCookieOptions(),
    auth: {
      autoRefreshToken: false,
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

export function getSupabaseRouteClient(request: NextRequest) {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  const pendingCookies: CookieToSet[] = [];
  const pendingHeaders: Record<string, string> = {};

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookieOptions: supabaseCookieOptions(),
    auth: {
      autoRefreshToken: false,
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        pendingCookies.push(...cookiesToSet);
        Object.assign(pendingHeaders, headers);
      },
    },
  });

  return {
    supabase,
    getPendingCookieNames() {
      return getSupabaseAuthCookieNames(pendingCookies);
    },
    applyCookies(response: NextResponse) {
      pendingCookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      Object.entries(pendingHeaders).forEach(([name, value]) => {
        response.headers.set(name, value);
      });
    },
  };
}

export function clearSupabaseAuthCookies(response: NextResponse, cookieNames: string[]) {
  cookieNames.forEach((name) => {
    response.cookies.set(name, "", {
      ...supabaseCookieOptions(),
      maxAge: 0,
    });
  });
}

export async function clearSupabaseAuthCookiesFromStore() {
  const cookieStore = await cookies();
  getSupabaseAuthCookieNames(cookieStore.getAll()).forEach((name) => {
    cookieStore.set(name, "", {
      ...supabaseCookieOptions(),
      maxAge: 0,
    });
  });
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
