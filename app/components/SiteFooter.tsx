import Link from "next/link";

export default function SiteFooter() {
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
              Saudi Arabia's marketplace for heavy transport,
              oversized cargo and industrial logistics.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Platform
            </h3>

            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <Link href="/jobs" className="hover:text-slate-900">
                Browse Jobs
              </Link>

              <Link href="/create-listing" className="hover:text-slate-900">
                Post a Job
              </Link>

              <Link href="/alerts" className="hover:text-slate-900">
                Job Alerts
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Legal
            </h3>

            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <Link href="/impressum" className="hover:text-slate-900">
                Impressum
              </Link>

              <Link href="/datenschutz" className="hover:text-slate-900">
                Datenschutz
              </Link>

              <Link href="/agb" className="hover:text-slate-900">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} NaqlHub. All rights reserved.
      </div>
    </footer>
  );
}