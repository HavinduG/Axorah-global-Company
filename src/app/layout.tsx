import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Axorah | Modern Creative Web Design Agency",
  description: "Axorah is a premium, high-converting web design and development agency crafting stunning user experiences and digital products.",
  keywords: ["web design", "creative agency", "UI/UX", "ecommerce", "Next.js", "frontend development", "digital presence"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://axorah.com",
    title: "Axorah | Modern Creative Web Design Agency",
    description: "Axorah is a premium, high-converting web design and development agency crafting stunning user experiences and digital products.",
    siteName: "Axorah",
  },
  twitter: {
    card: "summary_large_image",
    title: "Axorah | Modern Creative Web Design Agency",
    description: "Axorah is a premium, high-converting web design and development agency crafting stunning user experiences and digital products.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
