import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-claude-serif",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-claude-sans",
});

export const metadata: Metadata = {
  title: "PropDesk — Curated Indian Real Estate Discovery Platform",
  description:
    "Mobile-first, modern real-estate discovery with curated inventory, inquiry-led pricing, and builder joint venture opportunities. Browse verified listings across India.",
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
    <html
      lang="en"
      className={`h-full ${newsreader.variable} ${plusJakarta.variable} font-sans`}
    >
      <body className="min-h-full flex flex-col bg-[#08080A] text-[#EDE8E1] antialiased selection:bg-[#CC785C]/30 selection:text-white relative overflow-x-hidden">
        {/* Ambient liquid lighting orbs behind the glass layer */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#CC785C]/10 via-[#D97706]/5 to-transparent blur-[140px] opacity-70 transform-gpu" />
          <div className="absolute top-[40%] right-[-5%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-blue-600/8 via-indigo-500/5 to-transparent blur-[160px] opacity-60 transform-gpu" />
          <div className="absolute bottom-[5%] left-[-10%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#CC785C]/8 via-purple-600/5 to-transparent blur-[150px] opacity-50 transform-gpu" />
        </div>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
