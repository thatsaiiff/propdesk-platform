import type { Config } from "tailwindcss";

const config: Config = {
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
        claude: {
          bg: "#08080A",
          surface: "#111114",
          surfaceElevated: "#18181D",
          surfaceGlass: "rgba(255, 255, 255, 0.04)",
          accent: "#CC785C",       // Claude's signature terracotta / warm copper
          accentHover: "#D9886D",
          amber: "#D97706",
          amberHover: "#B45309",
          sand: "#E5DFD7",
          muted: "#96948F",
          border: "rgba(255, 255, 255, 0.1)",
          borderHighlight: "rgba(255, 255, 255, 0.22)",
        },
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc5fb",
          400: "#36a5f7",
          500: "#0c87eb",
          600: "#006bc9",
          700: "#0155a3",
          800: "#064886",
          900: "#0b3d6f",
          950: "#07264a",
        },
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      boxShadow: {
        "liquid-glass": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.2), inset 0 0 12px 0 rgba(255, 255, 255, 0.03), 0 12px 32px 0 rgba(0, 0, 0, 0.45)",
        "liquid-glass-prominent": "inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.35), inset 0 0 20px 0 rgba(255, 255, 255, 0.05), 0 20px 50px 0 rgba(0, 0, 0, 0.6)",
        "liquid-glass-hover": "inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.45), 0 24px 60px -12px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};
export default config;
