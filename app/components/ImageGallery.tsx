"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ImageGallery({ images }: { images: string[] }) {
  const cleanImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const total = cleanImages.length;
  const activeImage = cleanImages[activeIndex];

  function goPrev() {
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }

  function goNext() {
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }

  function openAt(index: number) {
    setActiveIndex(index);
    setLightboxOpen(true);
  }

  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, total]);

  if (total === 0) return null;

const visibleDesktopImages = cleanImages.slice(0, 5);
  const hiddenCount = Math.max(total - 5, 0);

  return (
    <>
      {/* MOBILE */}
      <div className="md:hidden">
        <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-slate-100">
          <button
            type="button"
            onClick={() => openAt(activeIndex)}
            className="relative block h-full w-full"
          >
            <Image
              src={activeImage}
              alt={`Bild ${activeIndex + 1}`}
              fill
              priority
              className="object-cover"
            />
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm"
                aria-label="Vorheriges Bild"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm"
                aria-label="Nächstes Bild"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5">
                {cleanImages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === activeIndex ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Bild ${i + 1} anzeigen`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:grid md:h-[360px] md:grid-cols-[2fr_1fr] md:gap-2">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="group relative overflow-hidden rounded-l-3xl bg-slate-100"
        >
          <Image
            src={cleanImages[0]}
            alt="Hauptbild"
            fill
            priority
            className="object-cover transition duration-200 group-hover:scale-[1.02]"
          />
        </button>

        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {visibleDesktopImages.slice(1, 5).map((img, index) => {
            const realIndex = index + 1;
            const isLastVisible = realIndex === 4 && hiddenCount > 0;

            return (
              <button
                key={`${img}-${realIndex}`}
                type="button"
                onClick={() => openAt(realIndex)}
                className={`group relative overflow-hidden bg-slate-100 ${
  realIndex === 2 ? "rounded-tr-3xl" : ""
} ${
  realIndex === 4 ? "rounded-br-3xl overflow-hidden" : ""
}`}
              >
                <div
  className={`absolute inset-0 overflow-hidden ${
    realIndex === 2 ? "rounded-tr-3xl" : ""
  } ${
    realIndex === 4 ? "rounded-br-3xl" : ""
  }`}
>
  <Image
    src={img}
    alt={`Bild ${realIndex + 1}`}
    fill
    className="object-cover transition duration-200 group-hover:scale-[1.02]"
  />
</div>

{isLastVisible && (
  <div className="absolute inset-0 rounded-br-3xl bg-black/45">
    <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-white">
      +{hiddenCount} Bilder
    </div>
  </div>
)}
              </button>
            );
          })}

          {total < 5 &&
            Array.from({ length: 5 - total }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="rounded-2xl bg-slate-100"
              />
            ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-6"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Schließen"
          >
            <X className="h-6 w-6" />
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Vorheriges Bild"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Nächstes Bild"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}

          <div
            className="relative flex max-h-[85vh] w-full max-w-6xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={`Bild ${activeIndex + 1}`}
              width={1600}
              height={1100}
              className="max-h-[85vh] max-w-full object-contain"
              priority
            />
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
            {activeIndex + 1} / {total}
          </div>
        </div>
      )}
    </>
  );
}