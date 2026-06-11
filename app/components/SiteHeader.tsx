"use client";

import Link from "next/link";

type SiteHeaderProps = {
  sticky?: boolean;
  mode?: "default" | "flow";
  rightLink?: { href: string; label: string };
};

export default function SiteHeader({ sticky }: SiteHeaderProps) {
  return (
    <header
      className={`w-full border-b border-slate-200 bg-white/95 backdrop-blur ${
        sticky ? "sticky top-0 z-50" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Naql<span className="text-amber-500">Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/jobs"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Jobs
          </Link>

          <Link
            href="/alerts"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Job Alerts
          </Link>

          <Link
            href="/create-listing"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Post Job
          </Link>
        </nav>

        <Link
          href="/create-listing"
          className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300"
        >
          Post a Job
        </Link>
      </div>
    </header>
  );
}