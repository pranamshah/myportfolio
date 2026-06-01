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
        // Design system — light surface palette
        "surface": "#f9f9f9",
        "surface-dim": "#dadada",
        "surface-bright": "#f9f9f9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f4",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#45464d",
        "inverse-surface": "#2f3131",
        "inverse-on-surface": "#f0f1f1",
        "outline": "#76777d",
        "outline-variant": "#c6c6cd",
        "surface-tint": "#565e74",
        "surface-variant": "#e2e2e2",
        "primary": "#000000",
        "on-primary": "#ffffff",
        "primary-container": "#131b2e",
        "on-primary-container": "#7c839b",
        "inverse-primary": "#bec6e0",
        "secondary": "#735c00",
        "on-secondary": "#ffffff",
        "secondary-container": "#fed65b",
        "on-secondary-container": "#745c00",
        "tertiary": "#000000",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#171c1f",
        "on-tertiary-container": "#808488",
        // Dashboard dark theme — flat compat (was nested surface.*)
        "surface-deep": "#06070A",
        "surface-primary": "#0C0D12",
        "surface-card": "#13141A",
        "surface-hover": "#191A22",
        // Gold accent (old design compat)
        gold: { DEFAULT: "#C9A452", light: "#E8C87A", dark: "#96783A", faint: "rgba(201,164,82,0.08)" },
        // Light text (dashboard dark theme)
        ink: { DEFAULT: "#F2EDE4", secondary: "#9B9590", muted: "#5A5650" },
        navy: "#1B3A6B",
        success: "#2D6A4F",
        danger: "#9B2335",
        warning: "#B45309",
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Hanken Grotesk'", "system-ui", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        marquee: "marquee 35s linear infinite",
        float: "float 8s ease-in-out infinite",
        "float-subtle": "floatSubtle 8s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        shimmer: { "0%,100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(3deg)" },
          "50%": { transform: "translateY(-20px) rotate(1deg)" },
        },
        floatSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
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
