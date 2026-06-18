import Link from "next/link";
import { Heart } from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import { requireUser } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export default async function LikedJobsPage() {
  await requireUser("/login?next=/dashboard/liked-jobs");

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

        <div className="mt-4 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Heart className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
            Liked Jobs
          </h1>

          <p className="mt-3 text-sm font-semibold text-slate-600">
            Saved jobs will appear here.
          </p>
        </div>
      </section>
    </main>
  );
}
