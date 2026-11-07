"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRoleType } from "@/types";
import { 
  Building2, 
  Heart, 
  User, 
  ChevronDown, 
  ShieldAlert, 
  Briefcase, 
  PlusCircle, 
  LogOut,
  Sparkles,
  Lock,
  Menu,
  X
} from "lucide-react";
import AuthModal from "../auth/AuthModal";

export default function Navbar() {
  const pathname = usePathname();
  const { user, favourites, switchActiveRole, signOut, quickLoginAs } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const isBuilder = user?.roles?.includes("BUILDER") || (user?.staffRoles && user.staffRoles.length > 0);
  const isAdmin = user?.staffRoles && user.staffRoles.length > 0;

  const navLinks = [
    { label: "All Properties", href: "/properties" },
    { label: "Residential", href: "/properties?category=RESIDENTIAL" },
    { label: "Commercial", href: "/properties?category=COMMERCIAL" },
    { label: "Mixed Use", href: "/properties?category=MIXED_USE" },
    { label: "Industrial", href: "/properties?category=INDUSTRIAL" },
    { label: "Land & Plots", href: "/properties?category=LAND" },
  ];

  const handleRoleSelect = async (role: UserRoleType) => {
    setRoleDropdownOpen(false);
    await switchActiveRole(role);
  };

  return (
    <>
      {/* Top Demo Simulation Bar - Frosted Glass Strip */}
      <div className="bg-[#08080A]/80 backdrop-blur-md text-[#A39E96] text-xs py-2 px-4 border-b border-white/[0.08] relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 liquid-glass-pill text-[#EDE8E1] px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-white/[0.12]">
              <Sparkles className="w-3 h-3 text-[#CC785C]" /> Demo Persona Selector
            </span>
            <span className="hidden sm:inline text-xs text-[#A39E96]">
              Test real-estate role authorizations & discretion boundaries:
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => signOut()}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-300 font-medium ${
                !user 
                  ? "bg-[#EDE8E1] text-[#08080A] shadow-sm font-semibold" 
                  : "liquid-glass hover:border-white/30 text-[#EDE8E1]"
              }`}
            >
              Guest (Anonymous)
            </button>
            <button
              onClick={() => quickLoginAs("arjun@example.demo")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-300 font-medium ${
                user?.email === "arjun@example.demo" 
                  ? "liquid-glass-btn-accent text-white font-semibold" 
                  : "liquid-glass hover:border-white/30 text-[#EDE8E1]"
              }`}
            >
              Buyer / Investor
            </button>
            <button
              onClick={() => quickLoginAs("builder@apexinfra.demo")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-300 font-medium ${
                user?.email === "builder@apexinfra.demo" 
                  ? "bg-emerald-600/90 text-white border border-emerald-400/50 shadow-sm font-semibold" 
                  : "liquid-glass hover:border-white/30 text-[#EDE8E1]"
              }`}
            >
              Builder (JV View)
            </button>
            <button
              onClick={() => quickLoginAs("rajesh@primeholdings.demo")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-300 font-medium ${
                user?.email === "rajesh@primeholdings.demo" 
                  ? "bg-amber-600/90 text-white border border-amber-400/50 shadow-sm font-semibold" 
                  : "liquid-glass hover:border-white/30 text-[#EDE8E1]"
              }`}
            >
              Owner Mandate
            </button>
            <button
              onClick={() => quickLoginAs("admin@propdesk.demo")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-300 font-medium ${
                isAdmin 
                  ? "bg-purple-600/90 text-white border border-purple-400/50 shadow-sm font-semibold" 
                  : "liquid-glass hover:border-white/30 text-[#EDE8E1]"
              }`}
            >
              Super Admin
            </button>
          </div>
        </div>
      </div>

      {/* Floating Liquid Glass Header */}
      <header className="sticky top-3 z-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="liquid-glass-elevated rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between transition-all duration-500">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl liquid-glass text-[#EDE8E1] flex items-center justify-center font-bold border border-white/20 group-hover:scale-105 group-hover:border-[#CC785C]/60 transition-all duration-300">
                <Building2 className="w-5 h-5 text-[#CC785C]" />
              </div>
              <div>
                <span className="font-claude-serif font-semibold tracking-tight text-xl text-[#EDE8E1] flex items-center gap-1">
                  PropDesk<span className="text-[#CC785C] text-lg font-serif">.</span>
                </span>
                <span className="block text-[10px] tracking-widest uppercase text-[#A39E96] -mt-1 font-semibold">
                  Curated India
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 pl-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                      isActive
                        ? "liquid-glass text-white font-medium border-white/25 shadow-sm"
                        : "text-[#A39E96] hover:text-[#EDE8E1] hover:bg-white/[0.04]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Protected Builder JV link */}
              {isBuilder ? (
                <Link
                  href="/joint-ventures"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                    pathname.startsWith("/joint-ventures")
                      ? "bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 shadow-sm font-medium"
                      : "text-emerald-400 hover:bg-emerald-950/40"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Joint Ventures</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-semibold border border-emerald-500/30">
                    BUILDER
                  </span>
                </Link>
              ) : (
                <Link
                  href="/joint-ventures"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#706D67] hover:text-[#A39E96] transition-colors duration-300"
                  title="Restricted to Builder Accounts"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Joint Ventures</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/submit-property"
              className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl text-xs font-semibold liquid-glass hover:border-white/30 text-[#EDE8E1] transition-all duration-300 active:scale-[0.98]"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#CC785C]" />
              <span>Submit Property</span>
            </Link>

            <Link
              href="/saved"
              className="p-2 text-[#A39E96] hover:text-[#EDE8E1] relative rounded-xl hover:bg-white/[0.05] transition-colors duration-300"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {favourites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#CC785C] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {favourites.length}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold bg-purple-950/60 text-purple-200 border border-purple-500/40 hover:bg-purple-900/60 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin</span>
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="inline-flex items-center gap-2 py-1.5 px-3 rounded-xl liquid-glass text-[#EDE8E1] text-xs font-medium transition-all duration-300 hover:border-white/30"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#CC785C] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="leading-tight text-xs text-[#EDE8E1] font-medium">{user.name.split(" ")[0]}</div>
                    <div className="text-[10px] text-[#CC785C] uppercase font-bold tracking-wider">
                      {user.activeRole || "BUYER"}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#A39E96]" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 liquid-glass-elevated rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-white/[0.08]">
                      <div className="text-sm font-semibold text-[#EDE8E1]">{user.name}</div>
                      <div className="text-xs text-[#A39E96] truncate">{user.email}</div>
                    </div>

                    <div className="py-2 px-2 border-b border-white/[0.08]">
                      <div className="text-[10px] uppercase text-[#706D67] tracking-wider mb-2 font-bold">
                        Switch Active Role
                      </div>
                      <div className="space-y-1">
                        {user.roles.map((r) => (
                          <button
                            key={r}
                            onClick={() => handleRoleSelect(r)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                              user.activeRole === r
                                ? "liquid-glass text-[#CC785C] font-semibold border-[#CC785C]/40"
                                : "text-[#A39E96] hover:text-[#EDE8E1] hover:bg-white/[0.05]"
                            }`}
                          >
                            <span>{r}</span>
                            {user.activeRole === r && (
                              <span className="text-[10px] bg-[#CC785C]/20 text-[#CC785C] px-1.5 py-0.2 rounded font-bold border border-[#CC785C]/40">
                                ACTIVE
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/account"
                        onClick={() => setRoleDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-[#A39E96] hover:text-[#EDE8E1] hover:bg-white/[0.05]"
                      >
                        <User className="w-4 h-4 text-[#706D67]" />
                        <span>Account & Roles</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setRoleDropdownOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-purple-300 hover:bg-purple-950/40"
                        >
                          <ShieldAlert className="w-4 h-4 text-purple-400" />
                          <span>Admin Console</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-red-400 hover:bg-red-950/30 text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="py-1.5 px-4 rounded-xl text-xs font-semibold liquid-glass-btn-accent text-white transition-all duration-300 active:scale-[0.98]"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#A39E96] hover:text-[#EDE8E1] rounded-xl hover:bg-white/[0.05] transition-all duration-300"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-[#08080A]/95 backdrop-blur-3xl border-t border-white/[0.1] p-6 space-y-6 z-50 overflow-y-auto animate-in fade-in duration-300">
            <div className="grid grid-cols-1 gap-2 pb-6 border-b border-white/[0.08]">
              {navLinks.map((link, idx) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className="px-4 py-3 rounded-xl text-base text-[#A39E96] hover:text-[#EDE8E1] hover:bg-white/[0.05] animate-in slide-in-from-bottom-3 duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-3">
              <Link
                href="/joint-ventures"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm bg-emerald-950/60 text-emerald-300 border border-emerald-600/40 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Joint Ventures
                </span>
                <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                  BUILDER ONLY
                </span>
              </Link>

              <Link
                href="/submit-property"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm liquid-glass text-[#EDE8E1] font-semibold border-white/20"
              >
                <PlusCircle className="w-4 h-4 text-[#CC785C]" />
                Submit Property for Admin Review
              </Link>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
