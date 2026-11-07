import React from "react";
import Link from "next/link";
import { Landmark, ShieldCheck, Mail, Phone, MapPin, Gavel, Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-32 relative border-t border-slate-200/50 dark:border-white/[0.08] bg-slate-100/80 dark:bg-[#060911]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl liquid-glass bg-royal-950 text-white flex items-center justify-center font-bold border border-royal-500/30">
                <Landmark className="w-4 h-4 text-gold-400" />
              </div>
              <span className="font-claude-serif text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                PropDesk<span className="text-gold-500 font-serif">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Institutional real estate transaction desk enlisting bank-auctioned distress assets (SARFAESI/DRT) and owner-mandated commercial real estate across India. Private pricing schedules and end-to-end closing.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 liquid-glass-pill px-3 py-1 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Underwritten Mandates</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-slate-900 dark:text-slate-100 font-bold mb-4 font-claude-sans">
              Asset Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/properties?subtype=Bank+Auction" className="hover:text-royal-600 dark:hover:text-gold-400 transition-colors flex items-center gap-1.5 font-medium">
                  <Gavel className="w-3.5 h-3.5 text-gold-500" />
                  Bank Auctions & NPA Recovery
                </Link>
              </li>
              <li>
                <Link href="/properties?category=COMMERCIAL" className="hover:text-royal-600 dark:hover:text-gold-400 transition-colors flex items-center gap-1.5 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-royal-500" />
                  Grade A Offices & Commercial
                </Link>
              </li>
              <li>
                <Link href="/properties?category=LAND" className="hover:text-royal-600 dark:hover:text-gold-400 transition-colors">
                  Commercial Land & Freehold Plots
                </Link>
              </li>
              <li>
                <Link href="/properties?category=INDUSTRIAL" className="hover:text-royal-600 dark:hover:text-gold-400 transition-colors">
                  Industrial Warehousing & Logistics
                </Link>
              </li>
              <li>
                <Link href="/joint-ventures" className="text-emerald-600 dark:text-emerald-400 hover:underline transition-colors font-medium">
                  Builder Joint Ventures (Restricted)
                </Link>
              </li>
            </ul>
          </div>

          {/* Pricing Policy */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-slate-900 dark:text-slate-100 font-bold mb-4 font-claude-sans">
              Zero Public Price Policy
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Unlike open portals with speculative rates, PropDesk maintains private, admin-verified pricing schedules to protect asset prestige. Certified valuations and bank reserve schedules are shared upon qualified inquiry.
            </p>
            <div className="liquid-glass rounded-xl p-3 text-xs text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-white/[0.08]">
              <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">Response Time Target:</strong>
              Inquiries receive verified pricing dossiers within business hours.
            </div>
          </div>

          {/* Contact & Submissions */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider text-slate-900 dark:text-slate-100 font-bold mb-4 font-claude-sans">
              Institutional Desk
            </h4>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-royal-600 dark:text-gold-400 shrink-0 mt-0.5" />
                <span>Pan India Operations: Mumbai, Bengaluru, Delhi NCR, Pune, Hyderabad</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-royal-600 dark:text-gold-400 shrink-0" />
                <span>desk@propdesk.demo</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-royal-600 dark:text-gold-400 shrink-0" />
                <span>+91 80000 00000 (Central Desk)</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-white/[0.08]">
              <Link
                href="/submit-property"
                className="text-xs text-royal-600 dark:text-gold-400 hover:underline transition-colors inline-block font-bold"
              >
                Bank, Institution, or Owner? Enlist asset with admins &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200/40 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PropDesk Discovery & Inquiry Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/properties" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Catalog</Link>
            <span className="text-slate-300 dark:text-white/10">•</span>
            <span>Zero Public Prices</span>
            <span className="text-slate-300 dark:text-white/10">•</span>
            <span>Bank SARFAESI Mandates</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
