"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleFavorite } from "@/app/lib/favoriteActions";

export default function FavoriteButton({
  jobId,
  initialFavorited,
  className = "",
  label = "Save job",
  showText = false,
  variant = "pill",
}: {
  jobId: string;
  initialFavorited: boolean;
  className?: string;
  label?: string;
  showText?: boolean;
  variant?: "pill" | "bare";
}) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        const nextValue = !isFavorited;
        setIsFavorited(nextValue);

        startTransition(async () => {
          try {
            await toggleFavorite(jobId, isFavorited);
            router.refresh();
          } catch (error) {
            setIsFavorited(isFavorited);
            throw error;
          }
        });
      }}
      className={`inline-flex items-center justify-center transition disabled:opacity-70 ${
        variant === "bare"
          ? isFavorited
            ? "rounded-full bg-white/95 text-[#FF385C] shadow-md ring-1 ring-black/5 backdrop-blur hover:bg-white hover:text-rose-600"
            : "rounded-full bg-white/95 text-slate-700 shadow-md ring-1 ring-black/5 backdrop-blur hover:bg-white hover:text-[#FF385C]"
          : isFavorited
            ? "rounded-full bg-rose-500 text-white shadow-sm hover:bg-rose-600"
            : "rounded-full bg-white/95 text-slate-700 shadow-sm hover:bg-white hover:text-rose-500"
      } ${className}`}
      aria-label={isFavorited ? "Remove saved job" : label}
      title={isFavorited ? "Saved" : label}
    >
      <Heart
        className={`h-[22px] w-[22px] ${isFavorited ? "fill-current" : ""}`}
        strokeWidth={2.4}
      />
      {showText && (
        <span className="ml-2 text-sm font-extrabold">
          {isPending ? "Saving..." : isFavorited ? "Saved job" : label}
        </span>
      )}
    </button>
  );
}
