import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: "#C9A452", light: "#E8C87A", dark: "#96783A", faint: "rgba(201,164,82,0.08)" },
        ink: { DEFAULT: "#F2EDE4", secondary: "#9B9590", muted: "#5A5650" },
        surface: { deep: "#06070A", primary: "#0C0D12", card: "#13141A", hover: "#191A22" },
        navy: "#1B3A6B",
        success: "#2D6A4F",
        danger: "#9B2335",
        warning: "#B45309",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        marquee: "marquee 35s linear infinite",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        shimmer: { "0%,100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
      boxShadow: {
        gold: "0 0 30px rgba(201,164,82,0.18)",
        "gold-sm": "0 0 12px rgba(201,164,82,0.12)",
        card: "0 1px 3px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
