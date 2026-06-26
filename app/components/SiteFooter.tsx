import Link from "next/link";
import { getTranslations } from "@/app/i18n";
import { getLocale } from "@/app/lib/locale";

export default async function SiteFooter() {
  const t = getTranslations(await getLocale()).footer;

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* Brand */}
          <div>
            <div className="text-lg font-bold text-slate-900">
              Naql<span className="text-amber-500">Hub</span>
            </div>

            <p className="mt-3 max-w-sm text-sm text-slate-600">
              {t.description}
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              {t.platform}
            </h3>

            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <Link href="/jobs" className="hover:text-slate-900">
                {t.browseJobs}
              </Link>

              <Link href="/create-listing" className="hover:text-slate-900">
                {t.jobAlerts}
              </Link>

              <Link href="/alerts" className="hover:text-slate-900">
                {t.postJob}
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              {t.legal}
            </h3>

            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <Link href="/legal" className="hover:text-slate-900">
                {t.legalNotice}
              </Link>

              <Link href="/privacy" className="hover:text-slate-900">
                {t.privacy}
              </Link>

              <Link href="/terms" className="hover:text-slate-900">
                {t.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} NaqlHub. {t.rights}
      </div>
    </footer>
  );
}
