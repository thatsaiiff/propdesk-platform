import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-claude-serif)", "Newsreader", "Lora", "Georgia", "serif"],
        sans: ["var(--font-claude-sans)", "Plus Jakarta Sans", "Inter", "-apple-system", "sans-serif"],
      },
      colors: {
        // Royal Blue Palette
        royal: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8", // Primary Royal Blue
          800: "#1e40af", // Deep Royal
          900: "#1e3a8a", // Midnight Royal
          950: "#0b132b",
        },
        // Metallic Champagne Gold Palette
        gold: {
          50: "#fffdf0",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#d4af37", // Pure Metallic Gold
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Deep Black Obsidian
        obsidian: {
          950: "#060911", // Deep Black/Navy
          900: "#0a0f1d",
          850: "#0f1629",
          800: "#151f38",
          700: "#1e2942",
        },
        claude: {
          bg: "#060911",
          surface: "#0e1424",
          surfaceElevated: "#151e36",
          surfaceGlass: "rgba(30, 58, 138, 0.08)",
          accent: "#2563eb",       // Royal Blue
          accentHover: "#1d4ed8",
          gold: "#d4af37",         // Champagne Gold
          goldHover: "#f59e0b",
          sand: "#F8FAFC",
          muted: "#94A3B8",
          border: "rgba(255, 255, 255, 0.1)",
          borderHighlight: "rgba(212, 175, 55, 0.35)",
        },
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      boxShadow: {
        "liquid-glass": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.2), inset 0 0 12px 0 rgba(212, 175, 55, 0.05), 0 12px 32px 0 rgba(0, 0, 0, 0.45)",
        "liquid-glass-prominent": "inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.35), inset 0 0 20px 0 rgba(37, 99, 235, 0.1), 0 20px 50px 0 rgba(0, 0, 0, 0.6)",
        "liquid-glass-gold": "inset 0 1.5px 2px 0 rgba(254, 240, 138, 0.4), 0 12px 32px -4px rgba(212, 175, 55, 0.35)",
        "liquid-glass-royal": "inset 0 1.5px 2px 0 rgba(191, 219, 254, 0.4), 0 12px 32px -4px rgba(37, 99, 235, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
