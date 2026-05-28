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
        "primary-deep": "#0A1628",
        "primary-ocean": "#0E3D52",
        "accent-teal": "#0E7490",
        "accent-gold": "#D97706",
        "neutral-light": "#F0F6FA",
        "text-primary": "#111827",
        "text-secondary": "#6B7280",
        success: "#059669",
        warning: "#D97706",
        danger: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Sora", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "wave": "wave 6s ease-in-out infinite",
        "float": "float 8s ease-in-out infinite",
        "ship": "ship 30s linear infinite",
        "plane": "plane 20s linear infinite",
        "marquee": "marquee 30s linear infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-20px) translateX(10px)" },
        },
        ship: {
          "0%": { transform: "translateX(-300px)" },
          "100%": { transform: "translateX(calc(100vw + 300px))" },
        },
        plane: {
          "0%": { transform: "translateX(-200px) translateY(0)" },
          "100%": { transform: "translateX(calc(100vw + 200px)) translateY(-30px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.08)",
        "teal-glow": "0 0 20px rgba(14,116,144,0.4)",
        "gold-glow": "0 0 20px rgba(217,119,6,0.4)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
