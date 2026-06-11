import SiteHeader from "@/app/components/SiteHeader";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { updateJobStatus, deleteJob } from "./actions";

export default async function AdminPage() {
  const { data: jobs } = await supabaseAdmin
    .from("transport_jobs")
    .select("*")
    .order("created_at", { ascending: false });
const totalJobs = jobs?.length || 0;

const approvedJobs =
  jobs?.filter((job) => job.status === "approved").length || 0;

const pendingJobs =
  jobs?.filter((job) => job.status === "pending").length || 0;

const rejectedJobs =
  jobs?.filter((job) => job.status === "rejected").length || 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader sticky />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>

<div className="mt-8 grid gap-4 md:grid-cols-4">
  <div className="rounded-3xl bg-white p-6 shadow-sm">
    <div className="text-sm text-slate-500">
      Total Jobs
    </div>

    <div className="mt-2 text-3xl font-semibold">
      {totalJobs}
    </div>
  </div>

  <div className="rounded-3xl bg-white p-6 shadow-sm">
    <div className="text-sm text-slate-500">
      Approved
    </div>

    <div className="mt-2 text-3xl font-semibold text-emerald-600">
      {approvedJobs}
    </div>
  </div>

  <div className="rounded-3xl bg-white p-6 shadow-sm">
    <div className="text-sm text-slate-500">
      Pending
    </div>

    <div className="mt-2 text-3xl font-semibold text-amber-600">
      {pendingJobs}
    </div>
  </div>

  <div className="rounded-3xl bg-white p-6 shadow-sm">
    <div className="text-sm text-slate-500">
      Rejected
    </div>

    <div className="mt-2 text-3xl font-semibold text-red-600">
      {rejectedJobs}
    </div>
  </div>
</div>

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Latest Jobs
          </h2>

          <div className="mt-5 space-y-4">
            {jobs?.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="font-semibold">
                  {job.title}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  {job.origin_city} → {job.destination_city}
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  {job.status}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
  {["pending", "approved", "rejected", "closed"].map((status) => (
    <form
      key={status}
      action={async () => {
        "use server";
        await updateJobStatus(job.id, status);
      }}
    >
      <button
        type="submit"
        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        {status}
      </button>
    </form>
  ))}

  <form
  action={async () => {
    "use server";
    await deleteJob(job.id);
  }}
>
  <button
    type="submit"
    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
  >
    Delete
  </button>
</form>
</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}