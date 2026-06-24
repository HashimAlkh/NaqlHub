"use client";

import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { ChevronDown, MapPin } from "lucide-react";
import {
  findSaudiCities,
  getSaudiCityName,
  normalizeSaudiCity,
} from "@/app/lib/saudiCities";
import { getTranslations, type Locale } from "@/app/i18n";
import { createTransportJob, updateTransportJob } from "./actions";
import SaudiPhoneInput from "@/app/components/SaudiPhoneInput";

export type TransportJobFormInitialValues = {
  id?: string | null;
  title?: string | null;
  cargo_type?: string | null;
  vehicle_type?: string | null;
  weight_kg?: number | null;
  budget_sar?: number | null;
  length_m?: number | null;
  width_m?: number | null;
  height_m?: number | null;
  origin_city?: string | null;
  destination_city?: string | null;
  pickup_date?: string | null;
  urgency?: string | null;
  description?: string | null;
  contact_name?: string | null;
  whatsapp_number?: string | null;
  image_urls?: string[] | null;
};

export type TransportJobContactDefaults = {
  contact_name?: string | null;
  whatsapp_number?: string | null;
};

const MAX_IMAGES = 5;
const MAX_IMAGE_WIDTH = 1600;
const IMAGE_QUALITY = 0.78;
type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

const selectClassName =
  "mt-1 h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-11 text-slate-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100";

function StyledSelect({
  children,
  defaultValue,
  name,
  required = false,
}: {
  children: ReactNode;
  defaultValue: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <select
        name={name}
        defaultValue={defaultValue}
        className={selectClassName}
        required={required}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}

function CityAutocomplete({
  defaultValue,
  locale,
  name,
  placeholder,
}: {
  defaultValue: string;
  locale: Locale;
  name: string;
  placeholder: string;
}) {
  const [value, setValue] = useState(() => getSaudiCityName(defaultValue, locale));
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestions = useMemo(() => {
    return findSaudiCities(value, locale);
  }, [locale, value]);

  function selectCity(city: { en: string; ar: string }) {
    setValue(city[locale]);
    setActiveIndex(-1);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (!suggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % suggestions.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(
        (current) =>
          current <= 0 ? suggestions.length - 1 : current - 1
      );
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectCity(suggestions[activeIndex]);
    }
  }

  return (
    <div className="relative">
      <MapPin
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400"
      />
      <input type="hidden" name={name} value={normalizeSaudiCity(value)} />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          setValue(event.target.value);
          setActiveIndex(-1);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-controls={`${name}-suggestions`}
        aria-expanded={isOpen && suggestions.length > 0}
        aria-activedescendant={
          activeIndex >= 0 ? `${name}-suggestion-${activeIndex}` : undefined
        }
        className="mt-1 h-12 w-full rounded-2xl border border-slate-200 bg-white py-2 pl-11 pr-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
        required
      />

      {isOpen && suggestions.length > 0 && (
        <ul
          id={`${name}-suggestions`}
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg"
        >
          {suggestions.map((city, index) => (
            <li
              key={city.en}
              id={`${name}-suggestion-${index}`}
              role="option"
              aria-selected={index === activeIndex}
            >
              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectCity(city);
                }}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-amber-50 ${
                  index === activeIndex ? "bg-amber-50" : ""
                }`}
              >
                <MapPin className="h-4 w-4 shrink-0 text-amber-500" />
                  {city[locale]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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

function SubmitButton({
  submitting,
  isEditing,
  labels,
}: {
  submitting: boolean;
  isEditing: boolean;
  labels: ReturnType<typeof getTranslations>["form"];
}) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="w-full rounded-2xl bg-amber-400 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {submitting
        ? isEditing
          ? labels.savingChanges
          : labels.submitting
        : isEditing
          ? labels.saveChanges
          : labels.submit}
    </button>
  );
}

export default function CreateListingForm({
  initialDraft,
  contactDefaults,
  locale = "en",
}: {
  initialDraft?: TransportJobFormInitialValues | null;
  contactDefaults?: TransportJobContactDefaults | null;
  locale?: Locale;
  mode?: string;
  readonly?: boolean;
  manageToken?: string;
}) {
  const translations = getTranslations(locale);
  const t = translations.form;
  const isEditing = Boolean(initialDraft?.id);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    () => initialDraft?.image_urls || []
  );
  const remainingImageSlots = useMemo(
    () => Math.max(0, MAX_IMAGES - images.length - existingImageUrls.length),
    [existingImageUrls.length, images.length]
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
          : t.imageProcessError
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

  function removeExistingImage(url: string) {
    setExistingImageUrls((current) => current.filter((item) => item !== url));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.delete("images");
    formData.set("remaining_image_urls", JSON.stringify(existingImageUrls));
    images.forEach((image) => {
      formData.append("images", image.file);
    });

    try {
      const result = isEditing
        ? await updateTransportJob(formData)
        : await createTransportJob(formData);
      window.location.href = result.redirectTo || "/create-listing/success";
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error && error.message === "Invalid Saudi mobile number"
          ? translations.auth.invalidSaudiPhone
          : t.saveError
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
    weight_kg: "45",
    budget_sar: "1200",
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
      {initialDraft?.id && (
        <input type="hidden" name="job_id" value={initialDraft.id} />
      )}
      <input
        type="hidden"
        name="remaining_image_urls"
        value={JSON.stringify(existingImageUrls)}
      />
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
        <h2 className="text-lg font-semibold text-slate-900">{t.cargoDetails}</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="ms-label">{t.jobTitle}</label>
            <input
              name="title"
              type="text"
              defaultValue={initialDraft?.title || ""}
              placeholder={t.jobTitlePlaceholder}
              className="ms-input mt-1"
              required
            />
          </div>

          <div>
            <label className="ms-label">{t.cargoType}</label>
            <StyledSelect
              name="cargo_type"
              defaultValue={initialDraft?.cargo_type || ""}
              required
            >
              <option value="">{t.selectCargo}</option>
              <option value="heavy_equipment">{translations.types.heavyEquipment}</option>
              <option value="industrial_cargo">{translations.types.industrial}</option>
              <option value="oversized_load">{translations.types.oversized}</option>
              <option value="construction_materials">
                {translations.types.construction}
              </option>
              <option value="containers">{translations.alerts.containers}</option>
              <option value="other">{translations.alerts.other}</option>
            </StyledSelect>
          </div>

          <div>
            <label className="ms-label">{t.requiredVehicle}</label>
            <StyledSelect
              name="vehicle_type"
              defaultValue={initialDraft?.vehicle_type || ""}
              required
            >
              <option value="">{t.selectVehicle}</option>
              <option value="lowbed_trailer">{translations.types.lowbed}</option>
              <option value="flatbed_trailer">{translations.types.flatbed}</option>
              <option value="extendable_trailer">{translations.types.extendable}</option>
              <option value="crane_truck">{translations.types.craneTruck}</option>
              <option value="container_truck">{translations.types.containerTruck}</option>
              <option value="not_sure">{translations.alerts.notSure}</option>
            </StyledSelect>
          </div>

          <div>
            <label className="ms-label">{t.weight}</label>
            <input
              name="weight_kg"
              type="number"
              min={0.001}
              step="0.001"
              defaultValue={
                initialDraft?.weight_kg != null
                  ? initialDraft.weight_kg / 1000
                  : ""
              }
              placeholder="45"
              className="ms-input mt-1"
              required
            />
          </div>

          <div>
            <label className="ms-label">{t.budget}</label>
            <input
              name="budget_sar"
              type="number"
              min={0}
              defaultValue={initialDraft?.budget_sar ?? ""}
              placeholder="1200"
              className="ms-input mt-1"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{t.photos}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {t.photosDescription}
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {existingImageUrls.length + images.length}/{MAX_IMAGES}
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
              {t.uploadPhotos}
            </span>
            <span className="mt-1 text-xs text-slate-500">
              {t.uploadHint}
            </span>
          </label>

          {(existingImageUrls.length > 0 || images.length > 0) && (
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
              {existingImageUrls.map((url, index) => (
                <div
                  key={url}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-200"
                >
                  <img
                    src={url}
                    alt={`Existing cargo photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  {index === 0 && (
                    <div className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold text-slate-950 shadow-sm">
                      {t.main}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-white opacity-100 transition hover:bg-black/80 md:opacity-0 md:group-hover:opacity-100"
                  >
                    {t.remove}
                  </button>
                </div>
              ))}

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

                  {existingImageUrls.length === 0 && index === 0 && (
                    <div className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold text-slate-950 shadow-sm">
                      {t.main}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-white opacity-100 transition hover:bg-black/80 md:opacity-0 md:group-hover:opacity-100"
                  >
                    {t.remove}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">{t.dimensions}</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="ms-label">{t.length}</label>
            <input
              name="length_m"
              type="number"
              step="0.01"
              min={0}
              defaultValue={initialDraft?.length_m ?? ""}
              placeholder="12.5"
              className="ms-input mt-1"
            />
          </div>

          <div>
            <label className="ms-label">{t.width}</label>
            <input
              name="width_m"
              type="number"
              step="0.01"
              min={0}
              defaultValue={initialDraft?.width_m ?? ""}
              placeholder="3.2"
              className="ms-input mt-1"
            />
          </div>

          <div>
            <label className="ms-label">{t.height}</label>
            <input
              name="height_m"
              type="number"
              step="0.01"
              min={0}
              defaultValue={initialDraft?.height_m ?? ""}
              placeholder="4.1"
              className="ms-input mt-1"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">{t.route}</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="ms-label">{t.origin}</label>
            <CityAutocomplete
              name="origin_city"
              defaultValue={initialDraft?.origin_city || ""}
              locale={locale}
              placeholder={getSaudiCityName("Riyadh", locale)}
            />
          </div>

          <div>
            <label className="ms-label">{t.destination}</label>
            <CityAutocomplete
              name="destination_city"
              defaultValue={initialDraft?.destination_city || ""}
              locale={locale}
              placeholder={getSaudiCityName("Jeddah", locale)}
            />
          </div>

          <div>
            <label className="ms-label">{t.pickupDate}</label>
            <input
              name="pickup_date"
              type="date"
              defaultValue={initialDraft?.pickup_date || ""}
              className="ms-input mt-1 min-h-[52px] appearance-none text-slate-900"
              required
            />
          </div>

          <div>
            <label className="ms-label">{t.urgency}</label>
            <StyledSelect
              name="urgency"
              defaultValue={initialDraft?.urgency || "normal"}
              required
            >
              <option value="normal">{translations.types.normal}</option>
              <option value="urgent">{translations.types.urgent}</option>
              <option value="flexible">{translations.types.flexible}</option>
            </StyledSelect>
          </div>
        </div>
      </section>

      <section>
        <label className="ms-label">{t.description}</label>
        <textarea
          name="description"
          rows={5}
          defaultValue={initialDraft?.description || ""}
          placeholder={t.descriptionPlaceholder}
          className="ms-input mt-1 min-h-[130px]"
          required
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">
          {t.contactDetails}
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="ms-label">{t.contactName}</label>
            <input
              name="contact_name"
              type="text"
              defaultValue={
                isEditing
                  ? initialDraft?.contact_name || ""
                  : contactDefaults?.contact_name || ""
              }
              placeholder={t.contactNamePlaceholder}
              className="ms-input mt-1"
              required
            />
          </div>

          <div>
            <label className="ms-label">{t.whatsapp}</label>
            <SaudiPhoneInput
              name="whatsapp_number"
              defaultValue={
                isEditing
                  ? initialDraft?.whatsapp_number || ""
                  : contactDefaults?.whatsapp_number || ""
              }
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
            {t.legal}
          </span>
        </label>
      </section>

      <SubmitButton submitting={submitting} isEditing={isEditing} labels={t} />
    </form>
  );
}
