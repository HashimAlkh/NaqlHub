import type { Metadata } from "next";
import LegalMarkdownPage from "@/app/components/LegalMarkdownPage";

export const metadata: Metadata = {
  title: "Terms of Service | NaqlHub",
  description:
    "Read the NaqlHub Terms of Service for using the transport marketplace in Saudi Arabia.",
  alternates: {
    canonical: "https://naqlhub.com/terms",
  },
};

export default function TermsPage() {
  return <LegalMarkdownPage fileName="terms.md" />;
}
