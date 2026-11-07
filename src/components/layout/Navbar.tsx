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
      {/* Top Demo Simulation Bar */}
      <div className="bg-[#131209] text-[#9B9B9B] caption-4 py-2 px-4 border-b border-[#272727]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#272727] text-white px-2.5 py-0.5 rounded-full caption-3 border border-[#313131]">
              <Sparkles className="w-3 h-3 text-amber-400" /> Demo Evaluation
            </span>
            <span className="hidden sm:inline caption-4 text-[#9B9B9B]">
              Simulate role authorization and private pricing schedules:
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => signOut()}
              className={`px-2.5 py-1 rounded-lg caption-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                !user ? "bg-white text-black font-semibold shadow-sm" : "bg-[#181818] hover:bg-[#272727] text-white border border-[#272727]"
              }`}
            >
              Guest (Anonymous)
            </button>
            <button
              onClick={() => quickLoginAs("arjun@example.demo")}
              className={`px-2.5 py-1 rounded-lg caption-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                user?.email === "arjun@example.demo" ? "bg-blue-600 text-white font-semibold" : "bg-[#181818] hover:bg-[#272727] text-white border border-[#272727]"
              }`}
            >
              Buyer / Investor
            </button>
            <button
              onClick={() => quickLoginAs("builder@apexinfra.demo")}
              className={`px-2.5 py-1 rounded-lg caption-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                user?.email === "builder@apexinfra.demo" ? "bg-emerald-600 text-white font-semibold" : "bg-[#181818] hover:bg-[#272727] text-white border border-[#272727]"
              }`}
            >
              Builder (JV View)
            </button>
            <button
              onClick={() => quickLoginAs("rajesh@primeholdings.demo")}
              className={`px-2.5 py-1 rounded-lg caption-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                user?.email === "rajesh@primeholdings.demo" ? "bg-amber-600 text-white font-semibold" : "bg-[#181818] hover:bg-[#272727] text-white border border-[#272727]"
              }`}
            >
              Owner Mandate
            </button>
            <button
              onClick={() => quickLoginAs("admin@propdesk.demo")}
              className={`px-2.5 py-1 rounded-lg caption-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isAdmin ? "bg-purple-600 text-white font-semibold" : "bg-[#181818] hover:bg-[#272727] text-white border border-[#272727]"
              }`}
            >
              Super Admin
            </button>
          </div>
        </div>
      </div>

      {/* Floating Modern Header per B7 */}
      <header className="sticky top-3 z-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-[#181818]/90 backdrop-blur-xl border border-[#272727] rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold tracking-tight text-lg text-white">PROPDESK</span>
                <span className="block caption-5 tracking-widest uppercase text-[#9B9B9B] -mt-1 font-semibold">
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
                    className={`px-3 py-1.5 rounded-lg body-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? "bg-[#272727] text-white font-medium"
                        : "text-[#9B9B9B] hover:text-white hover:bg-[#1F1F1F]"
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg body-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    pathname.startsWith("/joint-ventures")
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                      : "text-emerald-400 hover:bg-emerald-950/50"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Joint Ventures</span>
                  <span className="bg-emerald-900 text-emerald-200 caption-4 px-1.5 py-0.2 rounded font-bold">
                    BUILDER
                  </span>
                </Link>
              ) : (
                <Link
                  href="/joint-ventures"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg body-5 text-[#666666] hover:text-[#9B9B9B] transition-colors duration-300"
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
              className="hidden sm:inline-flex items-center gap-1.5 py-2 px-3 rounded-xl button-sm bg-[#272727] hover:bg-[#313131] text-white border border-[#313131] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Submit Property</span>
            </Link>

            <Link
              href="/saved"
              className="p-2 text-[#9B9B9B] hover:text-white relative rounded-xl hover:bg-[#1F1F1F] transition-colors duration-300"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {favourites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white caption-5 font-bold flex items-center justify-center">
                  {favourites.length}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1.5 py-2 px-3 rounded-xl button-sm bg-purple-950/80 text-purple-200 border border-purple-800 hover:bg-purple-900 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="inline-flex items-center gap-2 py-1.5 px-3 rounded-xl bg-[#272727] border border-[#313131] hover:bg-[#313131] text-white body-5 transition-all duration-300"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center caption-4 font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="leading-tight caption-2 text-white font-medium">{user.name.split(" ")[0]}</div>
                    <div className="caption-5 text-blue-400 uppercase font-bold tracking-wider">
                      {user.activeRole || "BUYER"}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#9B9B9B]" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#181818] rounded-2xl shadow-2xl border border-[#272727] p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-[#272727]">
                      <div className="body-4 text-white">{user.name}</div>
                      <div className="caption-2 text-[#9B9B9B] truncate">{user.email}</div>
                    </div>

                    <div className="py-2 px-2 border-b border-[#272727]">
                      <div className="caption-4 uppercase text-[#666666] tracking-wider mb-2 font-bold">
                        Switch Active Role
                      </div>
                      <div className="space-y-1">
                        {user.roles.map((r) => (
                          <button
                            key={r}
                            onClick={() => handleRoleSelect(r)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg body-5 flex items-center justify-between transition-colors ${
                              user.activeRole === r
                                ? "bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30"
                                : "text-[#9B9B9B] hover:text-white hover:bg-[#1F1F1F]"
                            }`}
                          >
                            <span>{r}</span>
                            {user.activeRole === r && (
                              <span className="caption-5 bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
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
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg body-5 text-[#9B9B9B] hover:text-white hover:bg-[#1F1F1F]"
                      >
                        <User className="w-4 h-4 text-[#666666]" />
                        <span>Account & Roles</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setRoleDropdownOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-lg body-5 text-purple-300 hover:bg-purple-950/40"
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
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg body-5 text-red-400 hover:bg-red-950/30 text-left"
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
                className="py-2 px-3 rounded-xl button-sm bg-white hover:bg-[#e0e0e0] text-black transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle with Animated Icons per B7 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#9B9B9B] hover:text-white rounded-xl hover:bg-[#1F1F1F] transition-all duration-300"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Full-Height Mobile Navigation Panel per B7 */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-[#181818]/95 backdrop-blur-2xl border-t border-[#272727] p-6 space-y-6 z-50 overflow-y-auto animate-in fade-in duration-300">
            <div className="grid grid-cols-1 gap-2 pb-6 border-b border-[#272727]">
              {navLinks.map((link, idx) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className="px-4 py-3 rounded-xl title-3 text-[#9B9B9B] hover:text-white hover:bg-[#1F1F1F] animate-in slide-in-from-bottom-3 duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-3">
              <Link
                href="/joint-ventures"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl title-4 bg-emerald-950/60 text-emerald-300 border border-emerald-800 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Joint Ventures
                </span>
                <span className="caption-4 bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-bold">
                  BUILDER ONLY
                </span>
              </Link>

              <Link
                href="/submit-property"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl title-4 bg-[#272727] text-white font-semibold border border-[#313131]"
              >
                <PlusCircle className="w-4 h-4 text-blue-400" />
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
