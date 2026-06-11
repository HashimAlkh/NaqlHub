"use client";

export default function DeactivateListingForm({ token }: { token: string }) {
  return (
    <form
      action="/api/deactivate-listing"
      method="POST"
      className="mt-8"
      onSubmit={(e) => {
        const ok = window.confirm(
          "Möchtest du dein Inserat wirklich deaktivieren? Es ist danach nicht mehr öffentlich sichtbar."
        );

        if (!ok) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="token" value={token} />

      <button
        type="submit"
        className="w-full rounded-2xl border border-red-200 bg-white px-5 py-3 font-medium text-red-700 hover:bg-red-50"
      >
        Inserat deaktivieren
      </button>
    </form>
  );
}