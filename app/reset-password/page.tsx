import { redirect } from "next/navigation";
import SiteHeader from "@/app/components/SiteHeader";
import FormSubmitButton from "@/app/components/FormSubmitButton";
import { getCurrentUser } from "@/app/lib/auth";
import { resetPassword } from "@/app/lib/authActions";
import { getAuthErrorMessage } from "@/app/lib/authMessages";
import { getTranslations } from "@/app/i18n";
import { getLocale } from "@/app/lib/locale";

function pick(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!(await getCurrentUser())) redirect("/forgot-password?error=invalid_reset_link");

  const sp = await searchParams;
  const t = getTranslations(await getLocale()).auth;
  const error = pick(sp, "error");

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader sticky />
      <section className="mx-auto flex max-w-6xl justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
            {t.resetPasswordTitle}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t.resetPasswordDescription}
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {getAuthErrorMessage(t, error)}
            </div>
          )}

          <form action={resetPassword} className="mt-6 grid gap-4">
            <div>
              <label className="ms-label" htmlFor="password">
                {t.newPassword}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                className="ms-input mt-1"
                required
              />
            </div>
            <div>
              <label className="ms-label" htmlFor="confirm_password">
                {t.confirmPassword}
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                className="ms-input mt-1"
                required
              />
            </div>
            <div>
              <FormSubmitButton
                idleLabel={t.resetPassword}
                pendingLabel={t.resettingPassword}
              />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
