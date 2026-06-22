"use client";

import Link from "next/link";
import { deleteOwnJob, setOwnJobStatus } from "./actions";
import { getTranslations, type Locale } from "@/app/i18n";

export default function JobManagementButtons({
  jobId,
  status,
  locale = "en",
}: {
  jobId: string;
  status: string | null;
  locale?: Locale;
}) {
  const isActive = status === "active";
  const t = getTranslations(locale);

  return (
    <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
      <Link
        href={`/dashboard/jobs/${jobId}/edit`}
        className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
      >
        {t.common.edit}
      </Link>

      <form action={setOwnJobStatus}>
        <input type="hidden" name="job_id" value={jobId} />
        <input
          type="hidden"
          name="status"
          value={isActive ? "inactive" : "active"}
        />
        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
        >
          {isActive ? t.common.deactivate : t.common.activate}
        </button>
      </form>

      <form
        action={deleteOwnJob}
        onSubmit={(event) => {
          if (!window.confirm(`${t.common.delete}?`)) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="job_id" value={jobId} />
        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-600 transition hover:bg-red-100 sm:w-auto"
        >
          {t.common.delete}
        </button>
      </form>
    </div>
  );
}
