import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#001a35",
          800: "#002242",
          700: "#0a3055",
          600: "#1a4373",
        },
        brand: {
          red: "#c91f1a",
          redDark: "#a01612",
          redSoft: "#fef2f1",
          redBorder: "#f3c8c5",
        },
        cream: {
          50: "#faf6f0",
          100: "#f5efe5",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-body)", "DM Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.06)",
        cardHover: "0 4px 8px rgba(15, 23, 42, 0.06), 0 12px 28px rgba(15, 23, 42, 0.1)",
        portrait: "0 30px 60px -20px rgba(10, 20, 40, 0.45)",
      },
      maxWidth: {
        container: "1200px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
