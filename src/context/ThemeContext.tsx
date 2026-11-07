"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isAutoSunset: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "auto",
  resolvedTheme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
  isAutoSunset: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("auto");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  // Compute sunrise / sunset based on local time
  // Default: Day = 06:00 to 18:30 (Light Mode) | Night = 18:30 to 06:00 (Dark Mode)
  const getSunBasedTheme = (): "light" | "dark" => {
    const now = new Date();
    const currentHours = now.getHours() + now.getMinutes() / 60;
    // 6:00 AM to 6:30 PM is daytime (light mode)
    return currentHours >= 6 && currentHours < 18.5 ? "light" : "dark";
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("propdesk_theme") as ThemeMode | null;
    const initialTheme: ThemeMode = saved === "light" || saved === "dark" || saved === "auto" ? saved : "auto";
    setThemeState(initialTheme);

    const active = initialTheme === "auto" ? getSunBasedTheme() : initialTheme;
    setResolvedTheme(active);

    if (active === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem("propdesk_theme", mode);

    const active = mode === "auto" ? getSunBasedTheme() : mode;
    setResolvedTheme(active);

    if (active === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("auto");
    } else {
      setTheme("dark");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        isAutoSunset: theme === "auto",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
