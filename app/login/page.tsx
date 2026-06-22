import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/app/components/SiteHeader";
import { loginWithPassword } from "@/app/lib/authActions";
import { getCurrentUser } from "@/app/lib/auth";
import { getTranslations } from "@/app/i18n";
import { getLocale } from "@/app/lib/locale";

function pick(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const sp = await searchParams;
  const error = pick(sp, "error");
  const registered = pick(sp, "registered");
  const next = pick(sp, "next") || "/dashboard";
  const t = getTranslations(await getLocale()).auth;

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader sticky />

      <section className="mx-auto flex max-w-6xl items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            {t.shipperAccount}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">
            {t.loginTitle}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t.loginDescription}
          </p>

          {registered && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Account created. Please log in to continue.
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form action={loginWithPassword} className="mt-6 grid gap-4">
            <input type="hidden" name="next" value={next} />

            <div>
              <label className="ms-label" htmlFor="email">
                {t.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="ms-input mt-1"
                required
              />
            </div>

            <div>
              <label className="ms-label" htmlFor="password">
                {t.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="ms-input mt-1"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-sm transition hover:bg-amber-300"
            >
              {t.login}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-slate-600">
            {t.newToNaqlHub}{" "}
            <Link href="/register" className="text-amber-600 hover:text-amber-700">
              {t.createAccount}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
