import {
  ClipboardPenLine,
  MessageCircle,
  ClipboardCheck,
  Truck,
  ShieldCheck,
  Route,
} from "lucide-react";

const steps = [
  {
    title: "Enter cargo details",
    text: "Add origin, destination, cargo type, weight and required vehicle.",
    icon: ClipboardPenLine,
  },
  {
    title: "Review request",
    text: "Check all details before submitting your transport job.",
    icon: ClipboardCheck,
  },
  {
    title: "Submit job",
    text: "Send your request for manual quality review.",
    icon: Route,
  },
  {
    title: "Manual check",
    text: "We review the job to keep listings relevant and trustworthy.",
    icon: ShieldCheck,
  },
  {
    title: "Go live",
    text: "Your transport job becomes visible to carriers and fleet owners.",
    icon: Truck,
  },
  {
    title: "Get contacted",
    text: "Interested providers contact you directly via WhatsApp.",
    icon: MessageCircle,
  },
];

const trustItems = [
  {
    title: "Built for heavy transport",
    text: "Focused on oversized cargo, machinery and industrial loads across Saudi Arabia.",
    icon: Truck,
  },
  {
    title: "Direct WhatsApp contact",
    text: "No complicated inbox. Providers can contact the shipper quickly and directly.",
    icon: MessageCircle,
  },
];

export default function ListingFlow() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          How NaqlHub works
        </h2>
      </div>

      <div className="mt-8 grid gap-3 md:hidden">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-semibold text-slate-950">
                {index + 1}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 shrink-0 text-amber-600" />

                  <h3 className="text-sm font-semibold text-slate-900">
                    {step.title}
                  </h3>
                </div>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {step.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 hidden md:grid md:grid-cols-6 md:gap-5">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div key={step.title} className="text-center">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-sm font-semibold text-slate-950 shadow-sm">
                {index + 1}
              </div>

              <div className="mx-auto mt-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Icon className="h-8 w-8" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                {step.text}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-4 rounded-3xl bg-slate-50 p-5 md:grid-cols-2 md:p-6">
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-600">
                <Icon className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}