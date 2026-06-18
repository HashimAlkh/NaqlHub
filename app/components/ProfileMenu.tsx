"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/app/lib/authActions";

export default function ProfileMenu({
  initials,
}: {
  initials: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-400 bg-slate-950 text-sm font-extrabold text-white shadow-sm transition hover:bg-slate-900"
        aria-label="Open profile menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
          <MenuLink href="/dashboard" label="Dashboard" />
          <MenuLink href="/dashboard/jobs" label="My Jobs" />
          <MenuLink href="/dashboard/liked-jobs" label="Liked Jobs" />
          <MenuLink href="/dashboard/profile" label="Profile" />

          <div className="my-2 h-px bg-slate-100" />

          <form action={logout}>
            <button
              type="submit"
              className="flex w-full px-4 py-2.5 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
    >
      {label}
    </Link>
  );
}
