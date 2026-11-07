import React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#181818] text-[#9B9B9B] border-t border-[#272727] mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="title-2 text-white font-bold tracking-tight">PROPDESK</span>
            </div>
            <p className="body-6 text-[#9B9B9B] leading-relaxed">
              Curated Indian real estate discovery and advisory platform. Inquiry led pricing and role aware inventory for buyers, investors, and builders.
            </p>
            <div className="inline-flex items-center gap-2 caption-3 text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Curated Mandates</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="caption-3 uppercase tracking-wider text-white font-bold mb-4">
              Inventory Categories
            </h4>
            <ul className="space-y-2.5 body-5">
              <li>
                <Link href="/properties?category=RESIDENTIAL" className="hover:text-white transition-colors duration-300">
                  Residential Apartments and Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?category=COMMERCIAL" className="hover:text-white transition-colors duration-300">
                  Grade A Offices and High Street Retail
                </Link>
              </li>
              <li>
                <Link href="/properties?category=MIXED_USE" className="hover:text-white transition-colors duration-300">
                  Mixed Use Towers
                </Link>
              </li>
              <li>
                <Link href="/properties?category=INDUSTRIAL" className="hover:text-white transition-colors duration-300">
                  Industrial Logistics and PEB Sheds
                </Link>
              </li>
              <li>
                <Link href="/properties?category=LAND" className="hover:text-white transition-colors duration-300">
                  Commercial and Freehold Land Parcels
                </Link>
              </li>
              <li>
                <Link href="/joint-ventures" className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300 font-medium">
                  Joint Ventures (Builder Only)
                </Link>
              </li>
            </ul>
          </div>

          {/* Pricing Transparency Policy */}
          <div>
            <h4 className="caption-3 uppercase tracking-wider text-white font-bold mb-4">
              Pricing Integrity Standard
            </h4>
            <p className="body-6 text-[#9B9B9B] leading-relaxed mb-3">
              Unlike open listing portals where speculative rates circulate, PropDesk maintains private, admin verified pricing schedules. Certified valuations and title documents are shared upon qualified inquiry.
            </p>
            <div className="bg-[#1F1F1F] border border-[#272727] rounded-xl p-3 caption-4 text-[#9B9B9B]">
              <strong className="text-white block mb-0.5">Response Time Target:</strong>
              Submissions receive verified pricing details within business hours.
            </div>
          </div>

          {/* Contact & Submissions */}
          <div>
            <h4 className="caption-3 uppercase tracking-wider text-white font-bold mb-4">
              Advisory Desk
            </h4>
            <ul className="space-y-3 body-6 text-[#9B9B9B]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>Pan India Operations: Mumbai, Bengaluru, Delhi NCR, Pune, Hyderabad</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span>advisory@propdesk.demo</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>+91 80000 00000 (Central Desk)</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-[#272727]">
              <Link
                href="/submit-property"
                className="body-5 text-blue-400 hover:text-blue-300 transition-colors inline-block font-semibold"
              >
                Owner or Mandated Broker? Submit your asset for review &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#272727] flex flex-col sm:flex-row items-center justify-between caption-4 text-[#666666] gap-4">
          <p>© {new Date().getFullYear()} PropDesk Discovery Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#9B9B9B] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#9B9B9B] transition-colors">Terms of Service</Link>
            <span className="text-[#313131]">•</span>
            <span className="text-[#9B9B9B]">Zero Public Prices</span>
            <span className="text-[#313131]">•</span>
            <span className="text-[#9B9B9B]">Builder Protected JV</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
