import type { Metadata } from "next";
import LegalMarkdownPage from "@/app/components/LegalMarkdownPage";

export const metadata: Metadata = {
  title: "Privacy Policy | NaqlHub",
  description:
    "Learn how NaqlHub collects, uses, stores, and protects personal information.",
  alternates: {
    canonical: "https://naqlhub.com/privacy",
  },
};

export default function PrivacyPage() {
  return <LegalMarkdownPage fileName="privacy.md" />;
}
