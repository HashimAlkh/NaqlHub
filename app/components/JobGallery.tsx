"use client";

import { ReactNode, useState } from "react";

export default function JobGallery({
  images,
  title,
  children,
}: {
  images: string[];
  title: string;
  children: ReactNode;
}) {
  const [selected, setSelected] = useState(0);
  const currentImage = images[selected] || "/truck-hero.png";
  const hasMultiple = images.length > 1;

  function showPrevious() {
    setSelected((current) => (current === 0 ? images.length - 1 : current - 1));
  }

  function showNext() {
    setSelected((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  }

  return (
    <div>
      <div className="relative h-[300px] overflow-hidden bg-slate-200 md:h-[410px]">
        <img
          src={currentImage}
          alt={title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {children}

        {hasMultiple && (
          <>
            {/* Desktop: count */}
            <div className="absolute right-5 top-5 z-30 hidden rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur md:block">
              {selected + 1} / {images.length}
            </div>

            {/* Desktop: arrows */}
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-5 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-slate-800 shadow-sm transition hover:bg-white md:flex"
              aria-label="Previous image"
            >
              ←
            </button>

            <button
              type="button"
              onClick={showNext}
              className="absolute right-5 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-slate-800 shadow-sm transition hover:bg-white md:flex"
              aria-label="Next image"
            >
              →
            </button>

            {/* Mobile: dots only */}
            <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2 md:hidden">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelected(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    selected === index
                      ? "bg-white"
                      : "bg-white/45 hover:bg-white/70"
                  }`}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}