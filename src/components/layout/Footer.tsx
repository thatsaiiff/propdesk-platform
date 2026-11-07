import React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-32 relative border-t border-white/[0.08] bg-[#08080A]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl liquid-glass text-[#EDE8E1] flex items-center justify-center font-bold border border-white/20">
                <Building2 className="w-4 h-4 text-[#CC785C]" />
              </div>
              <span className="font-claude-serif text-xl font-semibold tracking-tight text-[#EDE8E1]">
                PropDesk<span className="text-[#CC785C]">.</span>
              </span>
            </div>
            <p className="text-xs text-[#A39E96] leading-relaxed">
              Curated Indian real estate discovery & discreet advisory platform. Inquiry-led pricing schedules, certified title records, and builder-only joint ventures.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-emerald-400 liquid-glass-pill px-3 py-1 rounded-full border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Curated Mandates</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-[#EDE8E1] font-bold mb-4 font-claude-sans">
              Inventory Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A39E96]">
              <li>
                <Link href="/properties?category=RESIDENTIAL" className="hover:text-[#EDE8E1] transition-colors duration-300">
                  Residential Apartments & Signature Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?category=COMMERCIAL" className="hover:text-[#EDE8E1] transition-colors duration-300">
                  Grade A Offices & High Street Retail
                </Link>
              </li>
              <li>
                <Link href="/properties?category=MIXED_USE" className="hover:text-[#EDE8E1] transition-colors duration-300">
                  Mixed Use Towers & Integrated Hubs
                </Link>
              </li>
              <li>
                <Link href="/properties?category=INDUSTRIAL" className="hover:text-[#EDE8E1] transition-colors duration-300">
                  Industrial Logistics & PEB Sheds
                </Link>
              </li>
              <li>
                <Link href="/properties?category=LAND" className="hover:text-[#EDE8E1] transition-colors duration-300">
                  Commercial & Freehold Land Parcels
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
            <h4 className="text-[11px] uppercase tracking-wider text-[#EDE8E1] font-bold mb-4 font-claude-sans">
              Pricing Integrity Standard
            </h4>
            <p className="text-xs text-[#A39E96] leading-relaxed mb-3">
              Unlike open listing portals where speculative rates circulate, PropDesk maintains private, admin-verified pricing schedules. Certified valuations and title documents are shared upon qualified inquiry.
            </p>
            <div className="liquid-glass rounded-xl p-3 text-xs text-[#A39E96] border border-white/[0.08]">
              <strong className="text-[#EDE8E1] block mb-0.5">Response Time Target:</strong>
              Submissions receive verified pricing details within business hours.
            </div>
          </div>

          {/* Contact & Submissions */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-[#EDE8E1] font-bold mb-4 font-claude-sans">
              Advisory Desk
            </h4>
            <ul className="space-y-3 text-xs text-[#A39E96]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#CC785C] shrink-0 mt-0.5" />
                <span>Pan India Operations: Mumbai, Bengaluru, Delhi NCR, Pune, Hyderabad</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#CC785C] shrink-0" />
                <span>advisory@propdesk.demo</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#CC785C] shrink-0" />
                <span>+91 80000 00000 (Central Desk)</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-white/[0.08]">
              <Link
                href="/submit-property"
                className="text-xs text-[#CC785C] hover:text-[#D9886D] transition-colors inline-block font-semibold"
              >
                Owner or Mandated Broker? Submit asset for review &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-[#706D67] gap-4">
          <p>© {new Date().getFullYear()} PropDesk Discovery Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/properties" className="hover:text-[#A39E96] transition-colors">Catalogue</Link>
            <span className="text-white/10">•</span>
            <span className="text-[#A39E96]">Zero Public Prices</span>
            <span className="text-white/10">•</span>
            <span className="text-[#A39E96]">Builder Protected JV</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
