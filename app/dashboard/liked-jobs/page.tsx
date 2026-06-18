import Link from "next/link";
import { Heart } from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import { requireUser } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import JobCard, { type JobCardJob } from "@/app/components/JobCard";

export const dynamic = "force-dynamic";

export default async function LikedJobsPage() {
  const user = await requireUser("/login?next=/dashboard/liked-jobs");

  const { data: favorites } = await supabaseAdmin
    .from("job_favorites")
    .select("job_id")
    .eq("user_id", user.id);

  const favoriteJobIds = (favorites || [])
    .map((favorite) => favorite.job_id)
    .filter((jobId): jobId is string => typeof jobId === "string");

  const { data: jobs } =
    favoriteJobIds.length > 0
      ? await supabaseAdmin
          .from("transport_jobs")
          .select(
            "id,title,cargo_type,vehicle_type,weight_kg,budget_sar,origin_city,destination_city,pickup_date,urgency,image_urls"
          )
          .eq("status", "active")
          .in("id", favoriteJobIds)
          .returns<JobCardJob[]>()
      : { data: [] as JobCardJob[] };

  const orderedJobs = favoriteJobIds
    .map((jobId) => (jobs || []).find((job) => job.id === jobId))
    .filter((job): job is JobCardJob => Boolean(job));

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

        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
            Liked Jobs
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Saved transport jobs from your account.
            </p>
          </div>

          <Link
            href="/jobs"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-amber-400 px-5 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300"
          >
            Find Jobs
          </Link>
        </div>

        {orderedJobs.length > 0 ? (
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {orderedJobs.map((job) => (
              <JobCard key={job.id} job={job} isFavorited />
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Heart className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950">
              No saved jobs yet
            </h2>

            <p className="mt-3 text-sm font-semibold text-slate-600">
              Saved jobs will appear here.
            </p>

            <Link
              href="/jobs"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-amber-400 px-5 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300"
            >
              Browse jobs
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
