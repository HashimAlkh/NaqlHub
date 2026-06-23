import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardPenLine,
  Clock3,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { getTranslations, type Locale } from "@/app/i18n";

export default function ListingFlow({ locale = "en" }: { locale?: Locale }) {
  const t = getTranslations(locale).flow;
  const isArabic = locale === "ar";
  const DirectionIcon = isArabic ? ArrowLeft : ArrowRight;
  const steps = [
    {
      title: t.postTitle,
      description: t.postDescription,
      icon: ClipboardPenLine,
    },
    {
      title: t.contactTitle,
      description: t.contactDescription,
      icon: MessageCircle,
    },
    {
      title: t.chooseTitle,
      description: t.chooseDescription,
      icon: Truck,
    },
  ];
  const benefits = [
    {
      title: t.benefits.heavyTransportTitle,
      description: t.benefits.heavyTransportDescription,
      icon: ShieldCheck,
    },
    {
      title: t.benefits.whatsappTitle,
      description: t.benefits.whatsappDescription,
      icon: MessageCircle,
    },
    {
      title: t.benefits.quickPostTitle,
      description: t.benefits.quickPostDescription,
      icon: Clock3,
    },
    {
      title: t.benefits.nationwideTitle,
      description: t.benefits.nationwideDescription,
      icon: MapPin,
    },
  ];

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className={`rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10 lg:p-12 ${
        isArabic ? "text-right" : "text-left"
      }`}
    >
      <header className="mx-auto max-w-2xl text-center">
        <span className="inline-flex rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-bold text-amber-700">
          {t.eyebrow}
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
          {t.title}
        </h2>
        <p className="mt-3 text-base font-medium text-slate-600">{t.subtitle}</p>
      </header>

      <div className="relative mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-8">
        <div className="pointer-events-none absolute left-[16.666%] right-[16.666%] top-12 hidden md:block">
          <div className="border-t-2 border-dotted border-amber-300" />
          <DirectionIcon className="absolute left-[28%] top-1/2 h-4 w-4 -translate-y-1/2 bg-white text-amber-500" />
          <DirectionIcon className="absolute left-[70%] top-1/2 h-4 w-4 -translate-y-1/2 bg-white text-amber-500" />
        </div>

        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <article key={step.title} className="relative z-10 mx-auto max-w-xs text-center">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-amber-100 bg-amber-50 text-slate-900 shadow-sm">
                <Icon className="h-9 w-9" strokeWidth={1.8} />
                <span
                  className={`absolute -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-xs font-extrabold text-slate-950 shadow-sm ${
                    isArabic ? "-left-1" : "-right-1"
                  }`}
                >
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-base font-extrabold text-slate-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-10 text-center md:mt-12">
        <Link
          href="/create-listing/form"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 text-sm font-extrabold text-slate-950 shadow-sm transition hover:bg-amber-300"
        >
          {t.cta}
          <DirectionIcon className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 rounded-2xl border border-amber-100 bg-amber-50/70 p-5 md:mt-12 md:p-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div key={benefit.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
