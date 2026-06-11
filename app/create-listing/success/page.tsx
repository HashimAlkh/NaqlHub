import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader sticky />

      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
          ✓
        </div>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-900">
          Transport Job Submitted
        </h1>

        <p className="mt-4 max-w-xl text-lg text-slate-600">
          Your transport request has been successfully submitted and is now
          available on NaqlHub.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/jobs"
            className="rounded-2xl bg-amber-400 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-300"
          >
            Browse Jobs
          </Link>

          <Link
            href="/create-listing"
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Post Another Job
          </Link>
        </div>
      </section>
    </main>
  );
}