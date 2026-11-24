import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AS. TOUR TRAVEL - Biro Perjalanan & Sewa Armada Terpercaya",
  description:
    "Pusat layanan perjalanan wisata nusantara, wisata religi, gathering outbound perusahaan, dan rental bus pariwisata terpercaya oleh AS. TOUR TRAVEL (Pimpinan: Al-Djaat Siyah Maghrib).",
  keywords: [
    "AS Tour Travel",
    "Paket Wisata",
    "Sewa Bus Pariwisata",
    "Wisata Religi",
    "Outbound Gathering",
    "Travel Jawa Timur",
    "Sewa HiAce",
  ],
  authors: [{ name: "UN(FOUR)TUNATELY - Sistem Informasi UISI" }],
};

const GOOGLE_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link rel="stylesheet" href={GOOGLE_FONT_URL} />
      </head>
      <body className="min-h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-sky-200 selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
