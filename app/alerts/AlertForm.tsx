"use client";

import { FormEvent, useState } from "react";
import { createCarrierAlert } from "./actions";

export default function AlertForm() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await createCarrierAlert(formData);
      alert("Job alert created successfully.");
      e.currentTarget.reset();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Could not create job alert."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div>
        <label className="ms-label">Name / Company</label>
        <input
          name="name"
          type="text"
          placeholder="Ahmed Transport"
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

      <div>
        <label className="ms-label">Vehicle type</label>
        <select name="vehicle_type" className="ms-input mt-1">
          <option value="">Any vehicle</option>
          <option value="lowbed_trailer">Lowbed Trailer</option>
          <option value="flatbed_trailer">Flatbed Trailer</option>
          <option value="extendable_trailer">Extendable Trailer</option>
          <option value="crane_truck">Crane Truck</option>
          <option value="container_truck">Container Truck</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="ms-label">Preferred origin</label>
          <input
            name="origin_city"
            type="text"
            placeholder="Riyadh"
            className="ms-input mt-1"
          />
        </div>

        <div>
          <label className="ms-label">Preferred destination</label>
          <input
            name="destination_city"
            type="text"
            placeholder="Jeddah"
            className="ms-input mt-1"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-70"
      >
        {submitting ? "Creating alert..." : "Create Job Alert"}
      </button>
    </form>
  );
}