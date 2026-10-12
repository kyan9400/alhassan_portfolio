import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./mdx-components.tsx", "./content/**/*.mdx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "var(--font-arabic)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-arabic)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "Cascadia Mono", "Liberation Mono", "monospace"]
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
      // One type scale for display headings and lead paragraphs (fluid, clamped).
      fontSize: {
        display: ["clamp(2.5rem, 1rem + 6vw, 6rem)", { lineHeight: "0.98", letterSpacing: "-0.04em" }],
        h2: ["clamp(2rem, 1.1rem + 3.6vw, 4rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        h3: ["clamp(1.375rem, 1.1rem + 0.9vw, 1.75rem)", { lineHeight: "1.2" }],
        lead: ["clamp(1.0625rem, 1rem + 0.35vw, 1.25rem)", { lineHeight: "1.6" }]
      },
      borderRadius: {
        "4xl": "2rem"
      },
      keyframes: {
        // transform + opacity only: compositor-friendly, no paint per frame on phones
        rise: {
          from: { opacity: "0", transform: "translate3d(0, 0.35em, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" }
        }
      },
      animation: {
        rise: "rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both"
      }
    }
  },
  plugins: []
};

export default config;
