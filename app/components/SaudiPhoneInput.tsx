"use client";

import { getSaudiMobileLocal } from "@/app/lib/saudiPhone";

export default function SaudiPhoneInput({
  defaultValue,
  id,
  name,
  required = false,
}: {
  defaultValue?: string | null;
  id?: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div
      dir="ltr"
      className="mt-1 flex h-12 w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-sm text-slate-900 shadow-sm transition focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-100 [unicode-bidi:plaintext]"
    >
      <span className="flex shrink-0 items-center border-r border-slate-200 bg-slate-50 px-3 font-semibold text-slate-600">
        +966
      </span>
      <input
        id={id}
        name={name}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        defaultValue={getSaudiMobileLocal(defaultValue)}
        placeholder="501234567"
        className="min-w-0 flex-1 bg-transparent px-3 text-left outline-none placeholder:text-slate-400"
        required={required}
      />
    </div>
  );
}
