"use client";

type SortKey = "price_asc" | "price_desc";

export default function SortSelect({
  city,
  from,
  to,
  max_price,
  min_rooms,
  min_size,
  housing_type,
  sort,
}: {
  city: string;
  from: string;
  to: string;
  max_price: string;
  min_rooms: string;
  min_size: string;
  housing_type: string;
  sort: SortKey;
}) {
  return (
    <form method="get" className="mt-6 flex items-center justify-between">
      <input type="hidden" name="city" value={city} />
      <input type="hidden" name="from" value={from} />
      <input type="hidden" name="to" value={to} />
      <input type="hidden" name="max_price" value={max_price} />
      <input type="hidden" name="min_rooms" value={min_rooms} />
      <input type="hidden" name="min_size" value={min_size} />
      <input type="hidden" name="housing_type" value={housing_type} />

      <div className="text-sm text-slate-600">Sortieren ↑↓</div>

      <select
        name="sort"
        defaultValue={sort}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        <option value="price_asc">Preis ↑</option>
        <option value="price_desc">Preis ↓</option>
      </select>
    </form>
  );
}