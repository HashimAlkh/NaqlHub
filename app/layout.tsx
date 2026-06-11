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
  metadataBase: new URL("https://med-stay.de/"),

  title: "medstay – Wohnungen für PJ, Famulatur & Pflegepraktikum",
  description:
    "Finde passende Wohnungen für dein PJ, deine Famulatur oder dein Pflegepraktikum – speziell für Medizinstudierende.",
  
  alternates: {
    canonical: "https://med-stay.de/",
  },
  icons: {
    icon: "/medstay-icon.svg",
    shortcut: "/medstay-icon.svg",
    apple: "/medstay-icon.svg",
  },

  openGraph: {
    title: "medstay",
    description: "Wohnungen für PJ, Famulatur & Pflegepraktikum.",
    url: "https://med-stay.de/",
    siteName: "medstay",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "https://med-stay.de/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "medstay",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "medstay",
    description: "Wohnungen für PJ, Famulatur & Pflegepraktikum.",
    images: ["https://med-stay.de/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
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
