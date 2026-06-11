"use client";

import { Heart } from "lucide-react";

export default function WishlistButton() {
  return (
    <button
      onClick={(e) => e.preventDefault()}
      className="absolute right-4 top-4 text-slate-200 hover:text-red-400 transition-colors"
      aria-label="Save job"
    >
      <Heart className="h-5 w-5" />
    </button>
  );
}