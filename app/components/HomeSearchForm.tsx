"use client";

import { useState } from "react";

function SelectField({
  name,
  defaultValue,
  children,
}: {
  name: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mt-1">
      <select
        name={name}
        defaultValue={defaultValue}
        className="ms-input appearance-none bg-white pr-10"
      >
        {children}
      </select>

      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
        ▼
      </div>
    </div>
  );
}

export default function HomeSearchForm({
  initialCity = "",
  initialFrom = "",
  initialTo = "",
  initialMaxPrice = "",
  initialMinRooms = "",
  initialMinSize = "",
  initialHousingType = "",
}: {
  initialCity?: string;
  initialFrom?: string;
  initialTo?: string;
  initialMaxPrice?: string;
  initialMinRooms?: string;
  initialMinSize?: string;
  initialHousingType?: string;
}) {
  const [open, setOpen] = useState(
    !!initialMaxPrice ||
      !!initialMinRooms ||
      !!initialMinSize ||
      !!initialHousingType
  );

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);

  return (
    <form action="/results" method="get" className="mt-4 grid gap-3 bg-white md:gap-4">
      <div>
        <label className="ms-label">Stadt</label>
        <input
          name="city"
          placeholder="z. B. Mannheim"
          className="ms-input mt-1"
          defaultValue={initialCity}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="ms-label">Von</label>
          <input
            name="from"
            type="date"
            placeholder="TT.MM.JJJJ"
            className="ms-date-input mt-1 "
            value={from}
            max={to || undefined}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div>
          <label className="ms-label">Bis</label>
          <input
            name="to"
            type="date"
            className="ms-date-input mt-1"
            placeholder="TT.MM.JJJJ"
            value={to}
            min={from || undefined}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-left text-sm font-semibold text-teal-700 hover:text-teal-800"
      >
        Erweiterte Suche {open ? "−" : "+"}
      </button>

      {open && (
        <div className="grid gap-3 rounded-2xl bg-slate-50 p-3 sm:grid-cols-2 md:p-4">
          <div>
            <label className="ms-label">Preis bis</label>
            <input
              name="max_price"
              type="number"
              placeholder="z. B. 700"
              className="ms-input mt-1"
              defaultValue={initialMaxPrice}
            />
          </div>

          <div>
            <label className="ms-label">Zimmer ab</label>
            <input
              name="min_rooms"
              type="number"
              placeholder="z. B. 1"
              className="ms-input mt-1"
              defaultValue={initialMinRooms}
            />
          </div>

          <div>
            <label className="ms-label">Größe ab</label>
            <input
              name="min_size"
              type="number"
              placeholder="m²"
              className="ms-input mt-1"
              defaultValue={initialMinSize}
            />
          </div>

          <div>
            <label className="ms-label">Typ</label>
            <SelectField name="housing_type" defaultValue={initialHousingType}>
              <option value="">Alle</option>
              <option value="apartment">Wohnung</option>
              <option value="room">WG</option>
            </SelectField>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="mt-1 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 md:mt-2"
      >
        Suchen
      </button>
    </form>
  );
}