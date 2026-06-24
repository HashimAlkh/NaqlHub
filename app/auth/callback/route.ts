import { NextRequest, NextResponse } from "next/server";
import {
  clearRecoveryVerifier,
  getSupabaseRecoveryClient,
} from "@/app/lib/auth";

function setSessionCookies(
  response: NextResponse,
  session: { access_token: string; refresh_token: string; expires_in: number }
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

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = safeNext(url.searchParams.get("next"));

  if (!code && !(tokenHash && type === "recovery")) {
    return NextResponse.redirect(new URL("/forgot-password?error=invalid_reset_link", url));
  }

  try {
    const supabase = await getSupabaseRecoveryClient();
    const { data, error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({ token_hash: tokenHash!, type: "recovery" });

    if (error || !data.session) {
      return NextResponse.redirect(new URL("/forgot-password?error=invalid_reset_link", url));
    }

    await clearRecoveryVerifier();
    const response = NextResponse.redirect(new URL(next, url));
    setSessionCookies(response, data.session);
    return response;
  } catch {
    return NextResponse.redirect(new URL("/forgot-password?error=invalid_reset_link", url));
  }
}
