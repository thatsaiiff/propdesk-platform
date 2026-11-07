import React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">PROPDESK</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              India&apos;s curated real-estate discovery and advisory platform. Curated inventory, inquiry-led pricing, and role-aware discovery for buyers, tenants, owners, brokers, and developers.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Admin-Curated Inventory</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Property Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/properties?category=RESIDENTIAL" className="hover:text-white transition-colors">
                  Residential Apartments & Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?category=COMMERCIAL" className="hover:text-white transition-colors">
                  Commercial Offices & Retail
                </Link>
              </li>
              <li>
                <Link href="/properties?category=MIXED_USE" className="hover:text-white transition-colors">
                  Residential-cum-Commercial
                </Link>
              </li>
              <li>
                <Link href="/properties?category=INDUSTRIAL" className="hover:text-white transition-colors">
                  Industrial Sheds & Logistics
                </Link>
              </li>
              <li>
                <Link href="/properties?category=LAND" className="hover:text-white transition-colors">
                  Commercial & Plot Land Parcels
                </Link>
              </li>
              <li>
                <Link href="/joint-ventures" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Joint Ventures (Builder Only)
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating Model & Pricing Policy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Pricing Transparency Policy
            </h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-3">
              Unlike open portals where arbitrary or obsolete rates are shown, PropDesk maintains private, admin-verified pricing schedules. Our advisory desk provides certified pricing and documentation upon contextual inquiry.
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400">
              <strong className="text-slate-200 block mb-1">Target Response Time</strong>
              Submissions receive initial pricing and availability response within business hours.
            </div>
          </div>

          {/* Contact & Submissions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Platform Desk
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Pan-India Desk: Mumbai • Bengaluru • Delhi NCR • Pune • Hyderabad</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>advisory@propdesk.demo</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+91 80000 00000 (Central Desk)</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-900">
              <Link
                href="/submit-property"
                className="inline-block text-xs font-medium text-brand-400 hover:text-brand-300"
              >
                Are you an Owner or Mandated Broker? Submit your property &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PropDesk Discovery Platform. All rights reserved. Demo baseline.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">Strictly no public prices</span>
            <span>•</span>
            <span className="text-slate-600">Admin-controlled publication</span>
            <span>•</span>
            <span className="text-slate-600">Builder-exclusive JV</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
