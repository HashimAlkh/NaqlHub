import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/app/components/SiteHeader";
import { getCurrentUser } from "@/app/lib/auth";
import { registerWithPassword } from "@/app/lib/authActions";

function pick(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const sp = await searchParams;
  const error = pick(sp, "error");

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader sticky />

      <section className="mx-auto flex max-w-6xl items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            Create shipper account
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">
            Register for NaqlHub
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Post transport jobs, track your requests and keep everything under
            one account.
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form action={registerWithPassword} className="mt-6 grid gap-4">
            <div>
              <label className="ms-label" htmlFor="full_name">
                Full name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                className="ms-input mt-1"
                required
              />
            </div>

            <div>
              <label className="ms-label" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="ms-input mt-1"
                required
              />
            </div>

            <div>
              <label className="ms-label" htmlFor="company_name">
                Company name <span className="font-medium text-slate-400">(optional)</span>
              </label>
              <input
                id="company_name"
                name="company_name"
                type="text"
                autoComplete="organization"
                className="ms-input mt-1"
              />
            </div>

            <div>
              <label className="ms-label" htmlFor="email">
                Email
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
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="ms-input mt-1"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-sm transition hover:bg-amber-300"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-600 hover:text-amber-700">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
