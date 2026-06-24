import Link from "next/link";
import { LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import FormSubmitButton from "@/app/components/FormSubmitButton";
import SaudiPhoneInput from "@/app/components/SaudiPhoneInput";
import { requireUser } from "@/app/lib/auth";
import { changePassword, updateProfile } from "@/app/lib/authActions";
import { getAuthErrorMessage } from "@/app/lib/authMessages";
import { formatSaudiMobile, getSaudiMobileLocal } from "@/app/lib/saudiPhone";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getTranslations } from "@/app/i18n";
import { getLocale } from "@/app/lib/locale";

export const dynamic = "force-dynamic";

function pick(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function DashboardProfilePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireUser("/login?next=/dashboard/profile");
  const locale = await getLocale();
  const t = getTranslations(locale);
  const sp = await searchParams;
  const error = pick(sp, "error");
  const status = pick(sp, "status");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name, email, phone, company_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-[#f2f3f5] text-slate-900">
      <SiteHeader sticky />

      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
        <Link
          href="/dashboard"
          className="text-sm font-bold text-amber-600 hover:text-amber-700"
        >
          {t.common.backToDashboard}
        </Link>

        <div className="mt-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            {t.profile.label}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
            {t.profile.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t.profile.description}
          </p>

          {status === "profile_updated" && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {t.auth.profileUpdated}
            </div>
          )}
          {status === "password_updated" && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {t.auth.passwordUpdated}
            </div>
          )}
          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {getAuthErrorMessage(t.auth, error)}
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <form action={updateProfile} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <UserRound className="h-5 w-5 text-amber-600" />
                <h2 className="text-lg font-extrabold text-slate-950">{t.profile.editDetails}</h2>
              </div>

              <div className="mt-5 grid gap-4">
                <div>
                  <label className="ms-label" htmlFor="full_name">{t.profile.fullName}</label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    defaultValue={profile?.full_name || ""}
                    autoComplete="name"
                    className="ms-input mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="ms-label" htmlFor="phone">{t.profile.phone}</label>
                  <SaudiPhoneInput
                    id="phone"
                    name="phone"
                    defaultValue={getSaudiMobileLocal(profile?.phone)}
                    required
                  />
                </div>
                <div>
                  <label className="ms-label" htmlFor="company_name">{t.profile.companyName}</label>
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    defaultValue={profile?.company_name || ""}
                    autoComplete="organization"
                    className="ms-input mt-1"
                  />
                </div>
                <div>
                  <FormSubmitButton
                    idleLabel={t.auth.updateProfile}
                    pendingLabel={t.auth.updatingProfile}
                  />
                </div>
              </div>
            </form>

            <form action={changePassword} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <LockKeyhole className="h-5 w-5 text-amber-600" />
                <h2 className="text-lg font-extrabold text-slate-950">{t.auth.changePassword}</h2>
              </div>
              <div className="mt-5 grid gap-4">
                <div>
                  <label className="ms-label" htmlFor="current_password">{t.auth.currentPassword}</label>
                  <input
                    id="current_password"
                    name="current_password"
                    type="password"
                    autoComplete="current-password"
                    className="ms-input mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="ms-label" htmlFor="password">{t.auth.newPassword}</label>
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
                  <label className="ms-label" htmlFor="confirm_password">{t.auth.confirmPassword}</label>
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
                    idleLabel={t.auth.changePassword}
                    pendingLabel={t.auth.changingPassword}
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ProfileField icon={<Mail className="h-5 w-5" />} label={t.profile.email} value={profile?.email || user.email || t.common.notSet} />
            <ProfileField icon={<Phone className="h-5 w-5" />} label={t.profile.phone} value={formatSaudiMobile(profile?.phone) || t.common.notSet} isPhone />
            <ProfileField icon={<ShieldCheck className="h-5 w-5" />} label={t.profile.role} value={profile?.role || "user"} />
          </div>
        </div>
      </section>
    </main>
  );
}

function ProfileField({
  icon,
  label,
  value,
  isPhone = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isPhone?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-3 text-slate-500">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      </div>
      <div
        dir={isPhone ? "ltr" : undefined}
        className={`mt-3 break-words text-base font-extrabold text-slate-950 ${
          isPhone ? "text-left [unicode-bidi:plaintext]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
