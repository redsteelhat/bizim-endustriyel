import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bizim Endüstriyel | Profesyonel Hırdavat ve Endüstriyel Tedarik",
    template: "%s | Bizim Endüstriyel",
  },
  description:
    "Elektrikli el aletlerinden bağlantı elemanlarına profesyonel hırdavat ürünleri, toplu alım teklifleri ve uzman ürün desteği.",
  keywords: [
    "endüstriyel hırdavat",
    "nalbur ürünleri",
    "elektrikli el aletleri",
    "el aletleri",
    "bağlantı elemanları",
    "kurumsal tedarik",
  ],
  openGraph: {
    title: "Bizim Endüstriyel | İşiniz Durmasın",
    description:
      "Profesyonel hırdavat, sarf malzemeleri ve doğru ürün desteği tek noktada.",
    type: "website",
    locale: "tr_TR",
    siteName: "Bizim Endüstriyel",
  },
  twitter: {
    card: "summary",
    title: "Bizim Endüstriyel | İşiniz Durmasın",
    description:
      "Profesyonel hırdavat ve endüstriyel tedarikte hızlı çözüm.",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#111718",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
