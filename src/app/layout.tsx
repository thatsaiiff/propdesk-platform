import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "PropDesk — Real Estate. Reimagined.",
  description:
    "A Tinder-like property discovery platform combined with a trusted real estate service provider. Verified properties, bank auctions, commercial mandates and joint ventures across India.",
  keywords: [
    "Indian Real Estate",
    "Tinder for Real Estate",
    "Curated Properties Mumbai",
    "Commercial Real Estate Bengaluru",
    "Joint Ventures Builder India",
    "Disputed Properties Discount",
  ],
  authors: [{ name: "PropDesk Discovery Desk" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full font-sans"
    >
      <body className="min-h-full flex flex-col bg-[#060911] text-white antialiased selection:bg-amber-400/30 selection:text-white relative overflow-x-hidden">
        {/* Ambient background glow */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-royal-600/10 via-amber-500/5 to-transparent blur-[140px] opacity-70 transform-gpu" />
          <div className="absolute top-[40%] right-[-5%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-blue-600/10 via-purple-500/5 to-transparent blur-[160px] opacity-60 transform-gpu" />
        </div>
        <AuthProvider>
          <main className="flex-1 flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
