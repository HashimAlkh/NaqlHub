import type { ReactNode } from "react";

type Props = {
  label: string;
  icon?: ReactNode;
  variant?: "default" | "highlight";
};

export default function MetaPill({
  label,
  icon,
  variant = "default",
}: Props) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium";

  const styles =
    variant === "highlight"
      ? "border border-teal-200 bg-teal-50 text-teal-700"
      : "border border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span className={`${base} ${styles}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="ml-2">{label}</span>
    </span>
  );
}