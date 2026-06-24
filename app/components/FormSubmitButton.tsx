"use client";

import { useFormStatus } from "react-dom";

export default function FormSubmitButton({
  idleLabel,
  pendingLabel,
}: {
  idleLabel: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-sm transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
