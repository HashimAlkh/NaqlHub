import SiteHeader from "@/app/components/SiteHeader";
import AlertForm from "./AlertForm";

export default function AlertsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader sticky />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-center">
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-sm font-medium text-amber-700">
            Job Alerts
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Get notified about matching transport jobs.
          </h1>

          <p className="mt-4 text-slate-600">
            Add your WhatsApp number and preferred vehicle type. We will use this
            later to notify you when relevant jobs are posted.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <AlertForm />
        </div>
      </section>
    </main>
  );
}