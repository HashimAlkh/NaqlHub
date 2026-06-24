import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import FormSubmitButton from "@/app/components/FormSubmitButton";
import { requestPasswordReset } from "@/app/lib/authActions";
import { getPasswordRecoveryErrorMessage } from "@/app/lib/authMessages";
import { getTranslations } from "@/app/i18n";
import { getLocale } from "@/app/lib/locale";

function pick(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const locale = await getLocale();
  const t = getTranslations(locale).auth;
  const error = pick(sp, "error");
  const status = pick(sp, "status");

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader sticky />
      <section className="mx-auto flex max-w-6xl justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
            {t.forgotPasswordTitle}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t.forgotPasswordDescription}
          </p>

          {status === "sent" && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {t.resetEmailSent}
            </div>
          )}
          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {getPasswordRecoveryErrorMessage(t, error)}
            </div>
          )}

          <form action={requestPasswordReset} className="mt-6 grid gap-4">
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
              <FormSubmitButton
                idleLabel={t.sendResetLink}
                pendingLabel={t.sendingResetLink}
              />
            </div>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-slate-600">
            <Link href="/login" className="text-amber-600 hover:text-amber-700">
              {t.login}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
