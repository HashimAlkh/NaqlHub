import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-8 grid gap-8 md:grid-cols-3 text-sm text-slate-600 items-center">
        
        {/* Brand */}
        <div className="flex flex-col">
          <div className="text-base font-semibold text-slate-900">
            med<span className="text-teal-600">stay</span>
          </div>
          <p className="mt-1 text-sm">
            Unterkünfte von Medizinstudierenden – für Medizinstudierende.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          <Link href="/about" className="hover:text-slate-900">Über medstay</Link>
          <Link href="/contact" className="hover:text-slate-900">Kontakt</Link>
        </div>

        {/* Rechtliches */}
        <div className="flex flex-col gap-2">
          <Link href="/impressum" className="hover:text-slate-900">Impressum</Link>
          <Link href="/datenschutz" className="hover:text-slate-900">Datenschutz</Link>
          <Link href="/agb" className="hover:text-slate-900">AGB</Link>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} medstay
      </div>
    </footer>
  );
}