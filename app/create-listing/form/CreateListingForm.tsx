"use client";

import { FormEvent, useState } from "react";
import { createTransportJob } from "./actions";

type InitialDraft = null;

function SubmitButton({ submitting }: { submitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="w-full rounded-2xl bg-amber-400 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {submitting ? "Submitting job..." : "Submit Transport Job"}
    </button>
  );
}

export default function CreateListingForm({
  initialDraft,
}: {
  initialDraft?: InitialDraft;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
  await createTransportJob(formData);
  window.location.href = "/create-listing/success";
} catch (error) {
  console.error(error);
  alert(
    error instanceof Error
      ? error.message
      : "Transport job could not be saved."
  );
  setSubmitting(false);
}
  }

function fillTestData() {
  const form = document.querySelector("form");
  if (!form) return;

  const values: Record<string, string> = {
    title: "Transport excavator from Riyadh to Jeddah",
    cargo_type: "heavy_equipment",
    vehicle_type: "lowbed_trailer",
    weight_kg: "45000",
    budget_sar: "12000",
    length_m: "12.5",
    width_m: "3.2",
    height_m: "4.1",
    origin_city: "Riyadh",
    destination_city: "Jeddah",
    pickup_date: "2026-06-25",
    urgency: "urgent",
    description:
      "Heavy excavator transport. Loading assistance available. Access for lowbed trailer confirmed.",
    contact_name: "Test Company",
    whatsapp_number: "+966501234567",
  };

  Object.entries(values).forEach(([name, value]) => {
    const field = form.querySelector(`[name="${name}"]`) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null;

    if (field) {
      field.value = value;
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });

  const legal = form.querySelector(`[name="legal"]`) as HTMLInputElement | null;
  if (legal) {
    legal.checked = true;
    legal.dispatchEvent(new Event("change", { bubbles: true }));
  }
}


  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      {process.env.NODE_ENV === "development" && (
  <button
    type="button"
    onClick={fillTestData}
    className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-100"
  >
    Fill test data
  </button>
)}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Cargo details</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="ms-label">Job title</label>
            <input
              name="title"
              type="text"
              placeholder="e.g. Transport excavator from Riyadh to Jeddah"
              className="ms-input mt-1"
              required
            />
          </div>

          <div>
            <label className="ms-label">Cargo type</label>
            <select name="cargo_type" className="ms-input mt-1" required>
              <option value="">Select cargo type</option>
              <option value="heavy_equipment">Heavy equipment</option>
              <option value="industrial_cargo">Industrial cargo</option>
              <option value="oversized_load">Oversized load</option>
              <option value="construction_materials">
                Construction materials
              </option>
              <option value="containers">Containers</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="ms-label">Required vehicle</label>
            <select name="vehicle_type" className="ms-input mt-1" required>
              <option value="">Select vehicle type</option>
              <option value="lowbed_trailer">Lowbed trailer</option>
              <option value="flatbed_trailer">Flatbed trailer</option>
              <option value="extendable_trailer">Extendable trailer</option>
              <option value="crane_truck">Crane truck</option>
              <option value="container_truck">Container truck</option>
              <option value="not_sure">Not sure</option>
            </select>
          </div>

          <div>
            <label className="ms-label">Weight (kg)</label>
            <input
              name="weight_kg"
              type="number"
              min={1}
              placeholder="45000"
              className="ms-input mt-1"
              required
            />
          </div>

          <div>
            <label className="ms-label">Budget (SAR, optional)</label>
            <input
              name="budget_sar"
              type="number"
              min={0}
              placeholder="12000"
              className="ms-input mt-1"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Dimensions</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="ms-label">Length (m)</label>
            <input
              name="length_m"
              type="number"
              step="0.01"
              min={0}
              placeholder="12.5"
              className="ms-input mt-1"
            />
          </div>

          <div>
            <label className="ms-label">Width (m)</label>
            <input
              name="width_m"
              type="number"
              step="0.01"
              min={0}
              placeholder="3.2"
              className="ms-input mt-1"
            />
          </div>

          <div>
            <label className="ms-label">Height (m)</label>
            <input
              name="height_m"
              type="number"
              step="0.01"
              min={0}
              placeholder="4.1"
              className="ms-input mt-1"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Route</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="ms-label">Origin city</label>
            <input
              name="origin_city"
              type="text"
              placeholder="Riyadh"
              className="ms-input mt-1"
              required
            />
          </div>

          <div>
            <label className="ms-label">Destination city</label>
            <input
              name="destination_city"
              type="text"
              placeholder="Jeddah"
              className="ms-input mt-1"
              required
            />
          </div>

          <div>
            <label className="ms-label">Pickup date</label>
            <input
              name="pickup_date"
              type="date"
              className="ms-input mt-1 min-h-[52px] appearance-none text-slate-900"
              required
            />
          </div>

          <div>
            <label className="ms-label">Urgency</label>
            <select name="urgency" className="ms-input mt-1" required>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        <label className="ms-label">Job description</label>
        <textarea
          name="description"
          rows={5}
          placeholder="Describe loading requirements, access, special permits or additional details."
          className="ms-input mt-1 min-h-[130px]"
          required
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">
          Contact details
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="ms-label">Contact name</label>
            <input
              name="contact_name"
              type="text"
              placeholder="Full name or company"
              className="ms-input mt-1"
              required
            />
          </div>

          <div>
            <label className="ms-label">WhatsApp number</label>
            <input
              name="whatsapp_number"
              type="tel"
              placeholder="+966 5x xxx xxxx"
              className="ms-input mt-1"
              required
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
          <input
            name="legal"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
          />
          <span>
            I confirm that the information is accurate and that NaqlHub may
            review this job before publication.
          </span>
        </label>
      </section>

      <SubmitButton submitting={submitting} />
    </form>
  );
}