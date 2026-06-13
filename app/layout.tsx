import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "./components/SiteFooter";
import { Analytics } from "@vercel/analytics/next";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://naqlhub.com/"),

  title: "NaqlHub | Heavy Transport Marketplace Saudi Arabia",
  description:
    "Find trusted transport providers for heavy equipment, oversized cargo and industrial loads across Saudi Arabia.",

  alternates: {
    canonical: "https://naqlhub.com/",
  },

  icons: {
    icon: "/naqlhub-icon.svg",
    shortcut: "/naqlhub-icon.svg",
    apple: "/naqlhub-icon.svg",
  },

  openGraph: {
    title: "NaqlHub | Heavy Transport Marketplace Saudi Arabia",
    description:
      "Find trusted transport providers for heavy equipment, oversized cargo and industrial loads across Saudi Arabia.",
    url: "https://naqlhub.com/",
    siteName: "NaqlHub",
    locale: "en_SA",
    type: "website",
    images: [
      {
        url: "https://naqlhub.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NaqlHub",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NaqlHub | Heavy Transport Marketplace Saudi Arabia",
    description:
      "Find trusted transport providers for heavy equipment, oversized cargo and industrial loads across Saudi Arabia.",
    images: ["https://naqlhub.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}