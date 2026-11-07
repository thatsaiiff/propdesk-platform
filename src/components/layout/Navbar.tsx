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
  Menu, 
  X, 
  ChevronDown, 
  ShieldAlert, 
  Briefcase, 
  PlusCircle, 
  LogOut,
  Sparkles,
  Lock
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
    { label: "Mixed-Use", href: "/properties?category=MIXED_USE" },
    { label: "Industrial", href: "/properties?category=INDUSTRIAL" },
    { label: "Land / Plot", href: "/properties?category=LAND" },
  ];

  const handleRoleSelect = async (role: UserRoleType) => {
    setRoleDropdownOpen(false);
    await switchActiveRole(role);
  };

  return (
    <>
      {/* Top Demo Simulation Banner for reviewers */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-brand-600/30 text-brand-300 px-2 py-0.5 rounded font-medium text-[11px]">
              <Sparkles className="w-3 h-3" /> MVP Demo Mode
            </span>
            <span className="hidden sm:inline text-slate-400">
              Test platform roles & server-side authorization:
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => signOut()}
              className={`px-2 py-0.5 rounded text-[11px] transition-smooth ${
                !user ? "bg-white text-slate-900 font-semibold" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              Guest (No Sign-in)
            </button>
            <button
              onClick={() => quickLoginAs("arjun@example.demo")}
              className={`px-2 py-0.5 rounded text-[11px] transition-smooth ${
                user?.email === "arjun@example.demo" ? "bg-brand-500 text-white font-semibold" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              Buyer / Investor
            </button>
            <button
              onClick={() => quickLoginAs("builder@apexinfra.demo")}
              className={`px-2 py-0.5 rounded text-[11px] transition-smooth ${
                user?.email === "builder@apexinfra.demo" ? "bg-emerald-600 text-white font-semibold" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              Builder (JV Access)
            </button>
            <button
              onClick={() => quickLoginAs("rajesh@primeholdings.demo")}
              className={`px-2 py-0.5 rounded text-[11px] transition-smooth ${
                user?.email === "rajesh@primeholdings.demo" ? "bg-amber-600 text-white font-semibold" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              Owner / Submitter
            </button>
            <button
              onClick={() => quickLoginAs("admin@propdesk.demo")}
              className={`px-2 py-0.5 rounded text-[11px] transition-smooth ${
                isAdmin ? "bg-purple-600 text-white font-semibold" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              Admin Console
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-900 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold tracking-tight text-xl text-slate-900">PROPDESK</span>
                  <span className="block text-[10px] tracking-widest uppercase font-semibold text-brand-600 -mt-1">
                    Curated • India
                  </span>
                </div>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1 pl-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
                        isActive
                          ? "bg-slate-100 text-brand-700 font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* Builder JV Link - Protected & Dynamic */}
                {isBuilder ? (
                  <Link
                    href="/joint-ventures"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-smooth ${
                      pathname.startsWith("/joint-ventures")
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    Joint Ventures
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                      BUILDER
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/joint-ventures"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-600"
                    title="Joint Venture opportunities require Builder authorization"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Joint Ventures
                  </Link>
                )}
              </nav>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Submit Property Button */}
              <Link
                href="/submit-property"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-brand-600" />
                Submit Property
              </Link>

              {/* Saved Properties */}
              <Link
                href="/saved"
                className="p-2 text-slate-600 hover:text-slate-900 relative rounded-lg hover:bg-slate-100 transition-colors"
                title="Saved Properties"
              >
                <Heart className="w-5 h-5" />
                {favourites.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {favourites.length}
                  </span>
                )}
              </Link>

              {/* Admin Portal Link */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                  Admin
                </Link>
              )}

              {/* Auth / Account Profile */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px] font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="leading-tight">{user.name.split(" ")[0]}</div>
                      <div className="text-[10px] text-brand-700 uppercase font-bold tracking-wider">
                        {user.activeRole || "BUYER"}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {roleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                      <div className="p-2 border-b border-slate-100">
                        <div className="text-xs font-semibold text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                      </div>

                      {/* Active Role Switcher */}
                      <div className="py-2 px-2 border-b border-slate-100">
                        <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                          Switch Active Role
                        </div>
                        <div className="space-y-1">
                          {user.roles.map((r) => (
                            <button
                              key={r}
                              onClick={() => handleRoleSelect(r)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                                user.activeRole === r
                                  ? "bg-brand-50 text-brand-700 font-semibold"
                                  : "text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span>{r}</span>
                              {user.activeRole === r && (
                                <span className="text-[10px] bg-brand-200 text-brand-800 px-1.5 py-0.2 rounded font-bold">
                                  ACTIVE
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* User Account Links */}
                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setRoleDropdownOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          My Account & Roles
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setRoleDropdownOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-purple-700 hover:bg-purple-50"
                          >
                            <ShieldAlert className="w-4 h-4 text-purple-500" />
                            Admin Console
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            signOut();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50 text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white shadow-sm transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  Sign In
                </button>
              )}

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              <Link
                href="/joint-ventures"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-emerald-800 bg-emerald-50 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Joint Ventures
                </span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                  BUILDER ONLY
                </span>
              </Link>

              <Link
                href="/submit-property"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-800 bg-slate-100 font-semibold"
              >
                <PlusCircle className="w-4 h-4 text-brand-600" />
                Submit Property for Admin Review
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-purple-700 bg-purple-50 font-semibold"
                >
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  Staff Admin Console
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
