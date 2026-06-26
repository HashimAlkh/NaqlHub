import { NextRequest, NextResponse } from "next/server";
import type { Session } from "@supabase/supabase-js";
import {
  getSupabaseAuthCookieNames,
  getSupabaseRouteClient,
} from "@/app/lib/auth";

function setSessionCookies(
  response: NextResponse,
  session: Pick<Session, "access_token" | "refresh_token" | "expires_in">
) {
  const options = {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  response.cookies.set("naqlhub-access-token", session.access_token, {
    ...options,
    maxAge: session.expires_in,
  });
  response.cookies.set("naqlhub-refresh-token", session.refresh_token, {
    ...options,
    maxAge: 60 * 60 * 24 * 60,
  });
}

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/reset-password";
}

function invalidResetLinkResponse(url: URL) {
  return NextResponse.redirect(new URL("/forgot-password?error=invalid_reset_link", url));
}

function logAuthCallbackDebug(
  message: string,
  details: Record<string, unknown>
) {
  console.info(`[auth/callback] ${message}`, details);
}

function errorDetails(error: { code?: string; message?: string } | null) {
  return {
    code: error?.code || null,
    message: error?.message || null,
  };
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = safeNext(url.searchParams.get("next"));
  const supabaseAuthCookies = getSupabaseAuthCookieNames(request.cookies.getAll());
  const hasPkceVerifier = supabaseAuthCookies.some((name) =>
    name.includes("-code-verifier")
  );

  const baseDebug = {
    hasCode: Boolean(code),
    hasTokenHash: Boolean(tokenHash),
    type,
    next,
    hasPkceVerifier,
    supabaseAuthCookies,
  };

  logAuthCallbackDebug("received recovery callback", baseDebug);

  if (code && !hasPkceVerifier) {
    console.error("Missing PKCE verifier cookie", baseDebug);
  }

  if (!code && !(tokenHash && type === "recovery")) {
    logAuthCallbackDebug("invalid callback parameters", {
      ...baseDebug,
      sessionCreated: false,
    });
    return invalidResetLinkResponse(url);
  }

  try {
    const supabaseClient = getSupabaseRouteClient(request);
    let session: Session | null = null;

    if (code) {
      const { data, error } = await supabaseClient.supabase.auth.exchangeCodeForSession(code);
      session = data.session;
      logAuthCallbackDebug("exchangeCodeForSession result", {
        ...baseDebug,
        exchangeCodeForSessionError: errorDetails(error),
        pendingSupabaseAuthCookies: supabaseClient.getPendingCookieNames(),
        sessionCreated: Boolean(session),
      });
    }

    if (!session && tokenHash && type === "recovery") {
      const { data, error } = await supabaseClient.supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "recovery",
      });
      session = data.session;
      logAuthCallbackDebug("verifyOtp result", {
        ...baseDebug,
        verifyOtpError: errorDetails(error),
        pendingSupabaseAuthCookies: supabaseClient.getPendingCookieNames(),
        sessionCreated: Boolean(session),
      });
    }

    if (!session) {
      logAuthCallbackDebug("no session created", {
        ...baseDebug,
        sessionCreated: false,
      });
      return invalidResetLinkResponse(url);
    }

    const response = NextResponse.redirect(new URL(next, url));
    supabaseClient.applyCookies(response);
    setSessionCookies(response, session);
    logAuthCallbackDebug("redirecting with session cookies", {
      ...baseDebug,
      pendingSupabaseAuthCookies: supabaseClient.getPendingCookieNames(),
      sessionCreated: true,
    });
    return response;
  } catch (error) {
    console.error("[auth/callback] unexpected recovery callback failure", {
      ...baseDebug,
      error,
      sessionCreated: false,
    });
    return invalidResetLinkResponse(url);
  }
}
