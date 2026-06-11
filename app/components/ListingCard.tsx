import Link from "next/link";
import Image from "next/image";
import { HomeIcon } from "app/components/icons";
import { equipmentMeta } from "@/app/lib/equipmentMeta";
import {
  Users,
  MapPin,
  CalendarDays,
} from "lucide-react";

type Props = {
  id: string;
  title: string;
city: string;
country?: string | null;
price: number;
  availableFrom: string;
  availableTo: string;
  href: string;
  distanceKm?: number | null;
  housingType?: string | null;
  furnished?: boolean | null;
  wifi?: boolean | null;
  imageUrl?: string | null;
  rooms?: number | null;
  sizeSqm?: number | null;
  parking?: boolean | null;
  washingMachine?: boolean | null;
};

function isWohnung(housingType?: string | null) {
  return (housingType || "").toLowerCase().includes("wohnung");
}

function CardInner({
  title,
  city,
  country,
  price,
  availableFrom,
  availableTo,
  housingType,
  wifi,
  imageUrl,
  rooms,
  sizeSqm,
  parking,
  washingMachine,
}: Omit<Props, "id" | "href">) {
  const wohnung = isWohnung(housingType);
  const currencyLabel = country === "Schweiz" ? "CHF" : "€";

  return (
    <>
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {housingType ? (
          <div className="absolute right-3 top-3 z-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/95 px-3.5 py-1.5 text-teal-700 shadow-md backdrop-blur">
              {wohnung ? (
                <HomeIcon className="h-4 w-4" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              <span className="text-xs font-semibold">
                {wohnung ? "Wohnung" : "WG"}
              </span>
            </div>
          </div>
        ) : null}

        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={title}
              width={1200}
              height={800}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100 text-sm text-slate-500">
            Bild folgt
          </div>
        )}

        {(rooms || sizeSqm) && (
          <div className="absolute bottom-3 left-3 z-20">
            <div className="rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-slate-700 shadow-md backdrop-blur">
              {rooms ? `${rooms} Zimmer` : ""}
              {rooms && sizeSqm ? " · " : ""}
              {sizeSqm ? `${sizeSqm} m²` : ""}
            </div>
          </div>
        )}
      </div>

      <div className="p-3">
      <div className="mt-0.5 flex flex-col text-xs text-slate-500">
  <div className="flex items-center gap-1.5">
    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
    <span>
  {city}
  {country ? `, ${country}` : ""}
</span>
  </div>
        <div className="mt-1.5 mb-1 line-clamp-2 min-h-[38px] text-[0.95rem] font-semibold leading-snug text-slate-900">
  {title}
</div>
  <div className="mt-1.5 flex items-center gap-1.5">
    <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
    <span>
      {availableFrom} – {availableTo}
    </span>
  </div>
</div>

       <div className="my-2.5 h-px bg-slate-200" />

        <div className="flex items-end justify-between gap-4">
          <div className="flex gap-2">
            {wifi && (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-700">
                {(() => {
                  const Icon = equipmentMeta.wifi.icon;
                  return <Icon size={15} />;
                })()}
              </div>
            )}

            {washingMachine && (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-700">
                {(() => {
                  const Icon = equipmentMeta.washing_machine.icon;
                  return <Icon size={15} />;
                })()}
              </div>
            )}

            {parking && (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-700">
                {(() => {
                  const Icon = equipmentMeta.parking.icon;
                  return <Icon size={15} />;
                })()}
              </div>
            )}
          </div>

          <div className="shrink-0 text-right">
            <div className="text-xl font-semibold leading-none text-slate-900">
              {price} {currencyLabel}
            </div>
            <div className="mt-1 text-xs text-slate-500">/ Monat</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ListingCard(props: Props) {
  const hasValidId =
    typeof props.id === "string" &&
    props.id.trim() !== "" &&
    props.id !== "undefined" &&
    props.id !== "null";



  const baseClass =
  "ms-card relative block w-full max-w-[340px] overflow-hidden p-0 transition hover:border-slate-300 hover:shadow-md";

  if (!hasValidId) {
    return (
      <div
        className={`${baseClass} cursor-not-allowed opacity-60`}
        aria-disabled="true"
      >
        <CardInner {...props} />
      </div>
    );
  }

  return (
    <Link
      href={props.href}
      className={baseClass}
      aria-label={`Inserat öffnen: ${props.title} in ${props.city}`}
    >
      <CardInner {...props} />
    </Link>
  );
}