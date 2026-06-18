"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const currentImage = images[selected] || "/truck-hero.png";
  const hasMultiple = images.length > 1;

  const showPrevious = useCallback(() => {
    setSelected((current) => {
      if (images.length <= 1) return 0;
      return current === 0 ? images.length - 1 : current - 1;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setSelected((current) => {
      if (images.length <= 1) return 0;
      return current === images.length - 1 ? 0 : current + 1;
    });
  }, [images.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (event.key === "ArrowLeft" && hasMultiple) showPrevious();
      if (event.key === "ArrowRight" && hasMultiple) showNext();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, hasMultiple, showPrevious, showNext]);

  return (
    <div>
      <div
        className={`relative h-[320px] overflow-hidden bg-slate-200 md:h-[410px] ${
          isLightboxOpen ? "invisible pointer-events-none" : ""
        }`}
        aria-hidden={isLightboxOpen}
      >
        <img
          src={currentImage}
          alt={title}
          className="h-full w-full object-cover"
        />

        <button
  type="button"
  onClick={() => setIsLightboxOpen(true)}
  className="absolute inset-0 z-[8] cursor-zoom-in"
  aria-label="Open image gallery"
/>

        <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent md:from-slate-950/80 md:via-slate-950/20" />

        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="pointer-events-auto">{children}</div>
        </div>

        {hasMultiple && (
          <>
            <div className="absolute right-5 top-5 z-30 hidden rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur md:block">
              {selected + 1} / {images.length}
            </div>

            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-5 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-slate-800 shadow-sm transition hover:bg-white md:flex"
            >
              ←
            </button>

            <button
              type="button"
              onClick={showNext}
              className="absolute right-5 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-slate-800 shadow-sm transition hover:bg-white md:flex"
            >
              →
            </button>

            <div className="absolute bottom-14 left-1/2 z-30 flex -translate-x-1/2 gap-2 md:hidden">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelected(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    selected === index ? "w-6 bg-white" : "w-2.5 bg-white/45"
                  }`}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {isLightboxOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(0,0,0,0.92)",
              zIndex: 2147483647,
            }}
            role="dialog"
            aria-modal="true"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div
  className="
    relative
    flex
    h-[calc(100vh-180px)]
    w-[calc(100vw-32px)]
    max-h-[760px]
    items-center
    justify-center
    overflow-hidden
    rounded-[2rem]
    bg-black
    shadow-2xl
    md:w-[calc(100vw-96px)]
    md:max-w-[1500px]
  "
  onClick={(e) => e.stopPropagation()}
>
              <img
  src={currentImage}
  alt={title}
  className="h-full w-full object-contain"
/>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80"
                aria-label="Close image gallery"
              >
                <X className="h-5 w-5" />
              </button>

              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                    {selected + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
