import { normalizeSaudiPhoneFlexible } from "@/app/lib/saudiPhone";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

type AlertMatchJob = {
  id: string;
  origin_city: string | null;
  destination_city: string | null;
  cargo_type: string | null;
  vehicle_type: string | null;
  created_at?: string | null;
};

export type JobAlertFilters = {
  id: string;
  origin_city: string | null;
  destination_city: string | null;
  cargo_type: string | null;
  vehicle_type: string | null;
};

type StoredJobAlert = JobAlertFilters & { user_id: string };

type ActiveJobForAlertMatch = Pick<AlertMatchJob, "id" | "origin_city" | "destination_city" | "cargo_type" | "vehicle_type">;

export type JobAlertNotification = {
  userId: string;
  phone: string;
  jobId: string;
  origin: string | null;
  destination: string | null;
  cargoType: string | null;
  vehicleType: string | null;
  createdAt: string;
};

function matchesFilter(alertValue: string | null, jobValue: string | null) {
  return !alertValue || alertValue === jobValue;
}

export function doesJobMatchAlert(
  alert: Omit<JobAlertFilters, "id">,
  job: Omit<ActiveJobForAlertMatch, "id">
) {
  return (
    matchesFilter(alert.origin_city, job.origin_city) &&
    matchesFilter(alert.destination_city, job.destination_city) &&
    matchesFilter(alert.cargo_type, job.cargo_type) &&
    matchesFilter(alert.vehicle_type, job.vehicle_type)
  );
}

/**
 * Counts active public jobs for each saved alert. Empty alert filters are wildcards.
 * The jobs are fetched once so the dashboard avoids one database query per alert.
 */
export async function getActiveJobAlertMatchCounts(alerts: JobAlertFilters[]) {
  if (alerts.length === 0) return new Map<string, number>();

  const { data: jobs, error } = await supabaseAdmin
    .from("transport_jobs")
    .select("id,origin_city,destination_city,cargo_type,vehicle_type")
    .eq("status", "active")
    .returns<ActiveJobForAlertMatch[]>();

  if (error) throw new Error("Unable to load active jobs for alert matching");

  return new Map(
    alerts.map((alert) => [
      alert.id,
      (jobs || []).filter((job) => doesJobMatchAlert(alert, job)).length,
    ])
  );
}

/**
 * Builds notification payloads for every stored alert matching a newly created job.
 * Empty alert filters are wildcards. Delivery is intentionally left to the caller.
 */
export async function findMatchingJobAlerts(job: AlertMatchJob) {
  const { data: alerts, error: alertsError } = await supabaseAdmin
    .from("job_alerts")
    .select("id,user_id,origin_city,destination_city,cargo_type,vehicle_type")
    .returns<StoredJobAlert[]>();

  if (alertsError) throw new Error("Unable to load job alerts for matching");

  const storedAlerts = alerts || [];
  if (storedAlerts.length === 0) return [] as JobAlertNotification[];

  const userIds = [...new Set(storedAlerts.map((alert) => alert.user_id))];
  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("id,phone")
    .in("id", userIds)
    .returns<Array<{ id: string; phone: string | null }>>();

  if (profilesError) throw new Error("Unable to load notification recipients");

  const phonesByUserId = new Map(
    (profiles || []).map((profile) => [
      profile.id,
      {
        originalPhone: profile.phone,
        normalizedPhone: normalizeSaudiPhoneFlexible(profile.phone || ""),
      },
    ])
  );

  const matchingAlerts = storedAlerts.filter((alert) => {
    const originMatch = matchesFilter(alert.origin_city, job.origin_city);
    const destinationMatch = matchesFilter(alert.destination_city, job.destination_city);
    const cargoMatch = matchesFilter(alert.cargo_type, job.cargo_type);
    const vehicleMatch = matchesFilter(alert.vehicle_type, job.vehicle_type);
    const phone = phonesByUserId.get(alert.user_id);

    console.log("Job Alert match debug", {
      "alert.id": alert.id,
      "alert.user_id": alert.user_id,
      "alert.origin_city": alert.origin_city,
      "job.origin_city": job.origin_city,
      originMatch,
      "alert.destination_city": alert.destination_city,
      "job.destination_city": job.destination_city,
      destinationMatch,
      "alert.cargo_type": alert.cargo_type,
      "job.cargo_type": job.cargo_type,
      cargoMatch,
      "alert.vehicle_type": alert.vehicle_type,
      "job.vehicle_type": job.vehicle_type,
      vehicleMatch,
      profilePhonePresent: Boolean(phone?.originalPhone),
      originalPhone: phone?.originalPhone || null,
      normalizedPhone: phone?.normalizedPhone || null,
      phoneValid: Boolean(phone?.normalizedPhone),
    });

    return doesJobMatchAlert(alert, job);
  });

  return matchingAlerts.flatMap((alert) => {
    const phone = phonesByUserId.get(alert.user_id)?.normalizedPhone;
    if (!phone) return [];

    return [{
      userId: alert.user_id,
      phone,
      jobId: job.id,
      origin: job.origin_city,
      destination: job.destination_city,
      cargoType: job.cargo_type,
      vehicleType: job.vehicle_type,
      createdAt: job.created_at || new Date().toISOString(),
    }];
  });
}
