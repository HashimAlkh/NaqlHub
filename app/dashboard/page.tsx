import Link from "next/link";
import { BriefcaseBusiness, LogOut, PlusCircle } from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import { requireUser } from "@/app/lib/auth";
import { logout } from "@/app/lib/authActions";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser("/login?next=/dashboard");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.full_name || profile?.email || user.email;

  return (
    <main className="min-h-screen bg-[#f2f3f5] text-slate-900">
      <SiteHeader sticky />

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            Dashboard
          </div>

          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
                Welcome back{displayName ? `, ${displayName}` : ""}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Manage your transport requests and create new jobs for carriers
                across Saudi Arabia.
              </p>
            </div>

            <form action={logout}>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link
            href="/dashboard/jobs"
            className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-extrabold text-slate-950">
              My Jobs
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              View the transport jobs you have posted.
            </p>
          </Link>

          <Link
            href="/create-listing"
            className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
              <PlusCircle className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-extrabold text-slate-950">
              Post a Job
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Create a new transport request with cargo, route and contact
              details.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
