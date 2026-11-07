"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole, UserPreferences } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  requestOtp: (email: string) => Promise<{ success: boolean; message?: string; isNewUser?: boolean; demoCodeHint?: string; error?: string; cooldownSeconds?: number }>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; user?: User; isNewUser?: boolean; error?: string }>;
  updateOnboarding: (data: {
    name?: string;
    phone?: string;
    roles?: UserRole[];
    preferences?: UserPreferences;
    isOnboarded?: boolean;
  }) => Promise<{ success: boolean; user?: User; error?: string }>;
  signOut: () => Promise<void>;
  quickLoginAs: (demoEmail: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const requestOtp = async (email: string) => {
    try {
      const res = await fetch("/api/auth/email-otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch {
      return { success: false, error: "Network connection error" };
    }
  };

  const verifyOtp = async (email: string, code: string) => {
    try {
      const res = await fetch("/api/auth/email-otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true, user: data.user, isNewUser: data.isNewUser };
      }
      return { success: false, error: data.error || "Verification failed" };
    } catch {
      return { success: false, error: "Network error during verification" };
    }
  };

  const updateOnboarding = async (data: {
    name?: string;
    phone?: string;
    roles?: UserRole[];
    preferences?: UserPreferences;
    isOnboarded?: boolean;
  }) => {
    try {
      const res = await fetch("/api/me/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true, user: result.user };
      }
      return { success: false, error: result.error || "Failed to update profile" };
    } catch {
      return { success: false, error: "Network error updating onboarding" };
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
    } catch {}
    setUser(null);
  };

  const quickLoginAs = async (demoEmail: string) => {
    await verifyOtp(demoEmail, "123456");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        requestOtp,
        verifyOtp,
        updateOnboarding,
        signOut,
        quickLoginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
