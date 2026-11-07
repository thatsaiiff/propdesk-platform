"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
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
  X,
  Sun,
  Moon,
  Sunset,
  Landmark
} from "lucide-react";
import AuthModal from "../auth/AuthModal";

export default function Navbar() {
  const pathname = usePathname();
  const { user, favourites, switchActiveRole, signOut, quickLoginAs } = useAuth();
  const { theme, resolvedTheme, setTheme, toggleTheme, isAutoSunset } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const isBuilder = user?.roles?.includes("BUILDER") || (user?.staffRoles && user.staffRoles.length > 0);
  const isAdmin = user?.staffRoles && user.staffRoles.length > 0;

  const navLinks = [
    { label: "All Inventory", href: "/properties" },
    { label: "Bank Auctions & NPA", href: "/properties?subtype=Bank+Auction" },
    { label: "Commercial & Land", href: "/properties?category=COMMERCIAL" },
  ];

  const handleRoleSelect = async (role: UserRoleType) => {
    setRoleDropdownOpen(false);
    await switchActiveRole(role);
  };

  return (
    <>
      {/* Top Demo Simulation Bar - Frosted Glass Strip */}
      <div className="bg-slate-900/90 dark:bg-[#060911]/90 backdrop-blur-md text-slate-300 dark:text-slate-400 text-xs py-2 px-4 border-b border-slate-200/20 dark:border-white/[0.08] relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 liquid-glass-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-royal-500/30 text-royal-600 dark:text-royal-300">
              <Sparkles className="w-3 h-3 text-gold-500 dark:text-gold-400" /> Demo Persona Selector
            </span>
            <span className="hidden sm:inline text-xs text-slate-300 dark:text-slate-400">
              Test institutional roles & permission boundaries:
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => signOut()}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-300 font-medium ${
                !user 
                  ? "bg-royal-600 text-white shadow-sm font-semibold" 
                  : "liquid-glass hover:border-royal-400/40 text-slate-200"
              }`}
            >
              Guest (Anonymous)
            </button>
            <button
              onClick={() => quickLoginAs("arjun@example.demo")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-300 font-medium ${
                user?.email === "arjun@example.demo" 
                  ? "bg-royal-600 text-white font-semibold shadow-sm" 
                  : "liquid-glass hover:border-royal-400/40 text-slate-200"
              }`}
            >
              Buyer / Investor
            </button>
            <button
              onClick={() => quickLoginAs("builder@apexinfra.demo")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-300 font-medium ${
                user?.email === "builder@apexinfra.demo" 
                  ? "bg-emerald-600 text-white border border-emerald-400/50 shadow-sm font-semibold" 
                  : "liquid-glass hover:border-emerald-400/40 text-slate-200"
              }`}
            >
              Builder (JV View)
            </button>
            <button
              onClick={() => quickLoginAs("rajesh@primeholdings.demo")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-300 font-medium ${
                user?.email === "rajesh@primeholdings.demo" 
                  ? "bg-gold-600 text-slate-950 border border-gold-400/60 shadow-sm font-bold" 
                  : "liquid-glass hover:border-gold-400/40 text-slate-200"
              }`}
            >
              Owner Mandate
            </button>
            <button
              onClick={() => quickLoginAs("admin@propdesk.demo")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-300 font-medium ${
                isAdmin 
                  ? "bg-purple-600 text-white border border-purple-400/50 shadow-sm font-semibold" 
                  : "liquid-glass hover:border-purple-400/40 text-slate-200"
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
              <div className="w-9 h-9 rounded-xl liquid-glass bg-royal-950/40 dark:bg-royal-950/80 text-white flex items-center justify-center font-bold border border-royal-500/30 group-hover:scale-105 group-hover:border-gold-400/60 transition-all duration-300 shadow-sm">
                <Landmark className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <span className="font-claude-serif font-bold tracking-tight text-xl text-slate-900 dark:text-slate-100 flex items-center gap-0.5">
                  PropDesk<span className="text-gold-500 dark:text-gold-400 font-serif">.</span>
                </span>
                <span className="block text-[10px] tracking-widest uppercase text-royal-600 dark:text-royal-400 -mt-1 font-bold">
                  Auctions & Commercial
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 pl-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/properties" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                      isActive
                        ? "liquid-glass text-royal-600 dark:text-royal-300 font-semibold border-royal-500/30 shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]"
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
                      : "text-emerald-500 hover:bg-emerald-500/10"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Joint Ventures</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-bold border border-emerald-500/30">
                    BUILDER
                  </span>
                </Link>
              ) : (
                <Link
                  href="/joint-ventures"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300"
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
            {/* Theme Toggle Button (Light / Dark / Auto Sunset) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl liquid-glass text-slate-700 dark:text-slate-200 hover:border-gold-400/40 transition-all duration-300 flex items-center gap-1.5 text-xs"
              title={`Active Theme: ${theme.toUpperCase()} (${resolvedTheme === "light" ? "Daylight Light" : "Sunset Dark"}). Click to switch.`}
              aria-label="Toggle theme mode"
            >
              {theme === "light" ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="hidden xl:inline text-[11px] font-medium">Light</span>
                </>
              ) : theme === "dark" ? (
                <>
                  <Moon className="w-4 h-4 text-royal-400" />
                  <span className="hidden xl:inline text-[11px] font-medium">Dark</span>
                </>
              ) : (
                <>
                  <Sunset className="w-4 h-4 text-gold-400 animate-pulse" />
                  <span className="hidden xl:inline text-[11px] font-medium">Auto (Sunset)</span>
                </>
              )}
            </button>

            {/* Enlist Property with Desk CTA */}
            <Link
              href="/submit-property"
              className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl text-xs font-semibold liquid-glass text-slate-800 dark:text-slate-100 border-gold-500/40 hover:border-gold-400 transition-all duration-300 active:scale-[0.98] shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 text-gold-500 dark:text-gold-400" />
              <span>Enlist Property</span>
            </Link>

            {/* Favourites */}
            <Link
              href="/saved"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white relative rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors duration-300"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {favourites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-royal-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {favourites.length}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold bg-purple-900/60 dark:bg-purple-950/60 text-purple-200 border border-purple-500/40 hover:bg-purple-900/80 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin</span>
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="inline-flex items-center gap-2 py-1.5 px-3 rounded-xl liquid-glass text-slate-800 dark:text-slate-100 text-xs font-medium transition-all duration-300 hover:border-royal-400/40"
                >
                  <div className="w-6 h-6 rounded-lg bg-royal-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="leading-tight text-xs font-semibold text-slate-800 dark:text-slate-100">{user.name.split(" ")[0]}</div>
                    <div className="text-[10px] text-royal-600 dark:text-gold-400 uppercase font-bold tracking-wider">
                      {user.activeRole || "BUYER"}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 liquid-glass-elevated rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-slate-200/20 dark:border-white/[0.08]">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                    </div>

                    <div className="py-2 px-2 border-b border-slate-200/20 dark:border-white/[0.08]">
                      <div className="text-[10px] uppercase text-slate-400 tracking-wider mb-2 font-bold">
                        Switch Active Role
                      </div>
                      <div className="space-y-1">
                        {user.roles.map((r) => (
                          <button
                            key={r}
                            onClick={() => handleRoleSelect(r)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                              user.activeRole === r
                                ? "liquid-glass text-royal-600 dark:text-gold-400 font-semibold border-royal-500/40"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                            }`}
                          >
                            <span>{r}</span>
                            {user.activeRole === r && (
                              <span className="text-[10px] bg-royal-500/20 text-royal-600 dark:text-gold-400 px-1.5 py-0.5 rounded font-bold border border-royal-500/40">
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
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Account & Roles</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setRoleDropdownOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-purple-400 hover:bg-purple-950/40"
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
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-red-500 hover:bg-red-500/10 text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="py-1.5 px-4 rounded-xl text-xs font-semibold liquid-glass-btn-royal transition-all duration-300 active:scale-[0.98]"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all duration-300"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 liquid-glass-elevated rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/joint-ventures"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] flex items-center justify-between"
              >
                <span>Joint Ventures</span>
                {isBuilder ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                    BUILDER
                  </span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-200/20 dark:border-white/[0.08] flex items-center justify-between">
              <span className="text-xs text-slate-500">Theme</span>
              <button
                onClick={toggleTheme}
                className="py-1 px-3 rounded-lg liquid-glass text-xs font-medium flex items-center gap-1.5"
              >
                {theme === "light" ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : theme === "dark" ? <Moon className="w-3.5 h-3.5 text-royal-400" /> : <Sunset className="w-3.5 h-3.5 text-gold-400" />}
                <span>{theme === "auto" ? "Auto Sunset" : theme.toUpperCase()}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200/20 dark:border-white/[0.08]">
              <Link
                href="/submit-property"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold liquid-glass-btn-gold flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Enlist Property with Desk</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
