import Link from "next/link";
import { Bell, Calendar, MapPin, Package, Trash2, Truck } from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";
import JobAlertDialog from "@/app/components/JobAlertDialog";
import {
  deleteJobAlert,
  getUserJobAlerts,
  type JobAlert,
} from "@/app/lib/jobAlerts";

export const dynamic = "force-dynamic";

function formatValue(value: string | null) {
  return value ? value.replaceAll("_", " ") : "Any";
}

function formatDate(value: string | null) {
  if (!value) return "Date not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function DashboardJobAlertsPage() {
  const alerts = await getUserJobAlerts();

  return (
    <main className="min-h-screen bg-[#f2f3f5] text-slate-900">
      <SiteHeader sticky />

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <Link
          href="/dashboard"
          className="text-sm font-bold text-amber-600 hover:text-amber-700"
        >
          Back to dashboard
        </Link>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
              Your saved searches
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage the transport job searches you want to keep an eye on.
            </p>
          </div>

          <JobAlertDialog
            initialFilters={{
              origin_city: "",
              destination_city: "",
              cargo_type: "",
              vehicle_type: "",
            }}
            returnTo="/dashboard/job-alerts"
            triggerLabel="Create Alert"
          />
        </div>

        {alerts.length > 0 ? (
          <div className="mt-7 grid gap-4">
            {alerts.map((alert) => (
              <JobAlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <Bell className="mx-auto h-9 w-9 text-amber-500" />
            <h2 className="mt-4 text-xl font-extrabold text-slate-950">
              No job alerts yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Create an alert and get notified when matching transport jobs are
              posted.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <JobAlertDialog
                initialFilters={{
                  origin_city: "",
                  destination_city: "",
                  cargo_type: "",
                  vehicle_type: "",
                }}
                returnTo="/dashboard/job-alerts"
                triggerLabel="Create Alert"
              />
              <Link
                href="/jobs"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function JobAlertCard({ alert }: { alert: JobAlert }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="text-lg font-extrabold text-slate-950">
            {alert.origin_city || "Anywhere"} to {alert.destination_city || "Anywhere"}
          </div>

          <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
            <AlertDetail icon={<MapPin className="h-4 w-4" />} label="Origin" value={alert.origin_city || "Any"} />
            <AlertDetail icon={<MapPin className="h-4 w-4" />} label="Destination" value={alert.destination_city || "Any"} />
            <AlertDetail icon={<Package className="h-4 w-4" />} label="Cargo" value={formatValue(alert.cargo_type)} />
            <AlertDetail icon={<Truck className="h-4 w-4" />} label="Vehicle" value={formatValue(alert.vehicle_type)} />
          </div>

          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Calendar className="h-4 w-4" />
            Created {formatDate(alert.created_at)}
          </div>
        </div>

        <form action={deleteJobAlert.bind(null, alert.id)}>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-extrabold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </form>
      </div>
    </article>
  );
}

function AlertDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="shrink-0 text-slate-400">{icon}</span>
      <span className="min-w-0 truncate">
        <span className="text-slate-400">{label}: </span>
        <span className="capitalize text-slate-800">{value}</span>
      </span>
    </div>
  );
}
