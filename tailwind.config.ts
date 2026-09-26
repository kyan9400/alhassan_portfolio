import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "var(--font-arabic)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-arabic)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      },
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          2: "rgb(var(--accent-2) / <alpha-value>)",
          ink: "rgb(var(--accent-ink) / <alpha-value>)"
        },
        danger: "rgb(var(--danger) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        // transform + opacity only: compositor-friendly, no paint per frame on phones
        rise: {
          from: { opacity: "0", transform: "translate3d(0, 0.35em, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" }
        },
        wave: {
          "0%, 60%, 100%": { transform: "rotate(0deg)" },
          "10%, 30%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10deg)" }
        }
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        "spin-slow": "spin-slow 14s linear infinite",
        float: "float 6s ease-in-out infinite",
        rise: "rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        wave: "wave 2.4s ease-in-out 1s 2"
      }
    }
  },
  plugins: []
};

export default config;
