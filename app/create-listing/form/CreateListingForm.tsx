"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { createTransportJob } from "./actions";

type InitialDraft = null;

const MAX_IMAGES = 5;
const MAX_IMAGE_WIDTH = 1600;
const IMAGE_QUALITY = 0.78;

type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageUrl;
    });

    const scale = Math.min(1, MAX_IMAGE_WIDTH / image.width);
    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Image could not be processed.");

    ctx.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", IMAGE_QUALITY);
    });

    if (!blob) throw new Error("Image could not be compressed.");

    const cleanName = file.name.replace(/\.[^/.]+$/, "");

    return new File([blob], `${cleanName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

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
  const [images, setImages] = useState<SelectedImage[]>([]);
  const remainingImageSlots = useMemo(
    () => Math.max(0, MAX_IMAGES - images.length),
    [images.length]
  );

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedFiles = files.slice(0, remainingImageSlots);

    try {
      const compressedImages = await Promise.all(
        allowedFiles.map(async (file) => {
          const compressed = await compressImage(file);

          return {
            id: `${compressed.name}-${compressed.lastModified}-${Math.random()}`,
            file: compressed,
            previewUrl: URL.createObjectURL(compressed),
          };
        })
      );

      setImages((current) => [...current, ...compressedImages]);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "One or more images could not be processed."
      );
    } finally {
      e.target.value = "";
    }
  }

  function removeImage(id: string) {
    setImages((current) => {
      const image = current.find((item) => item.id === id);
      if (image) URL.revokeObjectURL(image.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.delete("images");
    images.forEach((image) => {
      formData.append("images", image.file);
    });

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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Photos</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add up to {MAX_IMAGES} photos of the cargo, equipment or loading situation.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {images.length}/{MAX_IMAGES}
          </span>
        </div>

        <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-white px-5 py-8 text-center transition hover:bg-slate-100">
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              disabled={remainingImageSlots === 0}
              onChange={handleImageChange}
              className="hidden"
            />

            <span className="text-sm font-semibold text-slate-900">
              Upload cargo photos
            </span>
            <span className="mt-1 text-xs text-slate-500">
              JPG, PNG or HEIC. Images are compressed before upload.
            </span>
          </label>

          {images.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-200"
                >
                  <img
                    src={image.previewUrl}
                    alt={`Cargo photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  {index === 0 && (
                    <div className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold text-slate-950 shadow-sm">
                      Main
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-white opacity-100 transition hover:bg-black/80 md:opacity-0 md:group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
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