"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRoleType } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  favourites: string[];
  refreshUser: () => Promise<void>;
  requestOtp: (email: string) => Promise<{ success: boolean; message?: string; demoCodeHint?: string; error?: { message: string } }>;
  verifyOtp: (email: string, code: string) => Promise<boolean>;
  switchActiveRole: (role: UserRoleType) => Promise<boolean>;
  addRole: (role: UserRoleType) => Promise<boolean>;
  signOut: () => Promise<void>;
  quickLoginAs: (demoEmail: string) => Promise<void>;
  toggleFavourite: (propertyId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<string[]>([]);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        // Load favourites
        const favRes = await fetch("/api/me/favourites");
        const favData = await favRes.json();
        if (favData.success) {
          setFavourites(favData.favourites || []);
        }
      } else {
        setUser(null);
        setFavourites([]);
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
    const res = await fetch("/api/auth/email-otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.json();
  };

  const verifyOtp = async (email: string, code: string) => {
    const res = await fetch("/api/auth/email-otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (data.success && data.user) {
      await refreshUser();
      return true;
    }
    return false;
  };

  const switchActiveRole = async (role: UserRoleType) => {
    const res = await fetch("/api/me/active-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (data.success) {
      await refreshUser();
      return true;
    }
    return false;
  };

  const addRole = async (role: UserRoleType) => {
    const res = await fetch("/api/me/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (data.success) {
      await refreshUser();
      return true;
    }
    return false;
  };

  const signOut = async () => {
    await fetch("/api/auth/sign-out", { method: "POST" });
    setUser(null);
    setFavourites([]);
  };

  const quickLoginAs = async (demoEmail: string) => {
    await verifyOtp(demoEmail, "123456");
  };

  const toggleFavourite = async (propertyId: string) => {
    if (!user) {
      // Local optimistic toggle for guests
      setFavourites(prev =>
        prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
      );
      return;
    }

    try {
      const res = await fetch("/api/me/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });
      const data = await res.json();
      if (data.success) {
        setFavourites(prev =>
          data.isFavourite ? [...prev, propertyId] : prev.filter(id => id !== propertyId)
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        favourites,
        refreshUser,
        requestOtp,
        verifyOtp,
        switchActiveRole,
        addRole,
        signOut,
        quickLoginAs,
        toggleFavourite,
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
