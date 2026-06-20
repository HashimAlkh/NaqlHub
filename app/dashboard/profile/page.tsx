import Link from "next/link";
import { Building2, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import { requireUser } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function DashboardProfilePage() {
  const user = await requireUser("/login?next=/dashboard/profile");

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
          Back to dashboard
        </Link>

        <div className="mt-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            Profile
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
            Account details
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your NaqlHub shipper profile information.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <ProfileField
              icon={<UserRound className="h-5 w-5" />}
              label="Full name"
              value={profile?.full_name || "Not set"}
            />
            <ProfileField
              icon={<Mail className="h-5 w-5" />}
              label="Email"
              value={profile?.email || user.email || "Not set"}
            />
            <ProfileField
              icon={<Phone className="h-5 w-5" />}
              label="Phone"
              value={profile?.phone || "Not set"}
            />
            <ProfileField
              icon={<Building2 className="h-5 w-5" />}
              label="Company name"
              value={profile?.company_name || "Not provided"}
            />
            <ProfileField
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Role"
              value={profile?.role || "shipper"}
            />
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-3 text-slate-500">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="mt-3 break-words text-base font-extrabold text-slate-950">
        {value}
      </div>
    </div>
  );
}
