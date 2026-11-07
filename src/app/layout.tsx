import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
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
  title: "PropDesk — Institutional Bank Auction & Commercial Real Estate Platform",
  description:
    "India's dedicated institutional desk for Bank-Auctioned/NPA distress assets and curated commercial real estate. Direct mandate intake, title verification, and discrete closing.",
  keywords: [
    "Bank Auction Properties India",
    "SARFAESI DRT Real Estate",
    "Commercial Real Estate Mumbai",
    "Office Space Bengaluru",
    "NPA Property Acquisition",
    "Commercial Land Parcels India",
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--text-primary)] antialiased selection:bg-royal-600/30 selection:text-white relative overflow-x-hidden transition-colors duration-300">
        {/* Royal Blue & Gold ambient lighting orbs behind the liquid glass layer */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[15%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-royal-600/12 via-royal-800/8 to-transparent blur-[140px] opacity-75 transform-gpu" />
          <div className="absolute top-[35%] right-[-8%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-gold-600/10 via-amber-500/5 to-transparent blur-[160px] opacity-70 transform-gpu" />
          <div className="absolute bottom-[5%] left-[-10%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-royal-700/10 via-gold-500/5 to-transparent blur-[150px] opacity-60 transform-gpu" />
        </div>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
