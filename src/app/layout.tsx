import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PropDesk — Curated Indian Real Estate Discovery Platform",
  description:
    "Mobile-first, premium Indian real-estate discovery with curated inventory, inquiry-led pricing, and builder joint venture opportunities. Browse verified listings across India.",
  keywords: [
    "Indian Real Estate",
    "Curated Properties Mumbai",
    "Commercial Real Estate Bengaluru",
    "Luxury Apartments Delhi NCR",
    "Joint Ventures Builder India",
    "Inquiry-Led Real Estate",
  ],
  authors: [{ name: "PropDesk Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased bg-slate-50 text-slate-900`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
