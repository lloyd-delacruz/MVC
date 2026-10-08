import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
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
          blue: "#1e50b4",
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
        card: "0 2px 6px rgba(30, 80, 180, 0.16), 0 8px 24px rgba(30, 80, 180, 0.18)",
        // Static by client request — identical to `card`, so the shadow does not change on hover.
        cardHover: "0 2px 6px rgba(30, 80, 180, 0.16), 0 8px 24px rgba(30, 80, 180, 0.18)",
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
        navProgress: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(300%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out both",
        navProgress: "navProgress 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
