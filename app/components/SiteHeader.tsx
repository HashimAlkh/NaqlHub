import Link from "next/link";
import ProfileMenu from "./ProfileMenu";
import { getCurrentUser } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

type SiteHeaderProps = {
  sticky?: boolean;
  mode?: "default" | "flow";
  rightLink?: { href: string; label: string };
};

function getInitials(fullName: string | null | undefined, email: string) {
  const nameParts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (nameParts.length > 0) {
    return nameParts
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return email.slice(0, 2).toUpperCase() || "U";
}

export default async function SiteHeader({ sticky }: SiteHeaderProps) {
  const user = await getCurrentUser();
  const { data: profile } = user
    ? await supabaseAdmin
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };
  const initials = user ? getInitials(profile?.full_name, user.email || "") : "";

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

        <nav className="flex items-center gap-4 text-sm md:gap-8">
          <Link
            href={
              user
                ? "/dashboard/job-alerts"
                : "/login?next=/dashboard/job-alerts"
            }
            className="font-medium text-slate-600 transition hover:text-slate-900"
          >
            Job Alerts
          </Link>

          <Link
            href="/create-listing"
            className="font-bold text-amber-600 transition hover:text-amber-700"
          >
            Post Job
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <ProfileMenu initials={initials} />
          ) : (
            <Link
  href="/login"
  className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
