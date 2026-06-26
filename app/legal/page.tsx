import type { Metadata } from "next";
import LegalMarkdownPage from "@/app/components/LegalMarkdownPage";

export const metadata: Metadata = {
  title: "Legal Notice | NaqlHub",
  description:
    "Legal notice and operator information for NaqlHub, the transport marketplace for Saudi Arabia.",
  alternates: {
    canonical: "https://naqlhub.com/legal",
  },
};

export default function LegalPage() {
  return <LegalMarkdownPage fileName="legal-notice.md" titleOverride="Legal Information" />;
}
