import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens map to CSS variables defined in globals.css.
        // The `<alpha-value>` placeholder lets Tailwind opacity modifiers
        // (bg-ink/10, text-paper/70, …) resolve against the HSL channels.
        paper: "hsl(var(--paper) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        ink: {
          DEFAULT: "hsl(var(--ink) / <alpha-value>)",
          soft: "hsl(var(--ink-soft) / <alpha-value>)",
          faint: "hsl(var(--ink-faint) / <alpha-value>)",
        },
        brass: {
          DEFAULT: "hsl(var(--brass) / <alpha-value>)",
          soft: "hsl(var(--brass-soft) / <alpha-value>)",
          wash: "hsl(var(--brass-wash) / <alpha-value>)",
        },
        ok: {
          DEFAULT: "hsl(var(--ok) / <alpha-value>)",
          wash: "hsl(var(--ok-wash) / <alpha-value>)",
        },
        due: {
          DEFAULT: "hsl(var(--due) / <alpha-value>)",
          wash: "hsl(var(--due-wash) / <alpha-value>)",
        },
        rule: "hsl(var(--rule) / <alpha-value>)",
        // shadcn-compatible aliases
        border: "hsl(var(--rule) / <alpha-value>)",
        input: "hsl(var(--rule) / <alpha-value>)",
        ring: "hsl(var(--brass) / <alpha-value>)",
        background: "hsl(var(--paper) / <alpha-value>)",
        foreground: "hsl(var(--ink) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--ink) / <alpha-value>)",
          foreground: "hsl(var(--paper) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--brass) / <alpha-value>)",
          foreground: "hsl(var(--surface) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--ink-faint) / <alpha-value>)",
          foreground: "hsl(var(--ink-soft) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--due) / <alpha-value>)",
          foreground: "hsl(var(--surface) / <alpha-value>)",
        },
      },
      fontFamily: {
        // Space Grotesk for structural/executive elements: KPIs, headers, metrics.
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        // Geist for continuous prose, labels, metadata.
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        // Geist Mono for wallet addresses, hashes, IDs.
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Vinotinto Executive Terminal type scale (semantic sizes, available
        // as text-display-lg / text-metric-val / etc. alongside Tailwind's
        // own defaults, which continuous prose keeps using).
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.03em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-sm": ["18px", { lineHeight: "26px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "600" }],
        "metric-val": ["28px", { lineHeight: "34px", letterSpacing: "-0.02em", fontWeight: "700" }],
      },
      borderRadius: {
        // Micro-border rigor: crisp, mostly-square corners, never a pill.
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      boxShadow: {
        float: "0 12px 40px -12px hsl(var(--ink) / 0.35)",
        lift: "0 2px 0 0 hsl(var(--rule))",
        // Luminescent accent: sharp ambient glow on hover/active focus.
        glow: "0 0 16px -2px hsl(var(--brass) / var(--glow-alpha))",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "rise-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "seal-in": {
          "0%": { opacity: "0", transform: "scale(0.92) rotate(-6deg)" },
          "60%": { opacity: "1", transform: "scale(1.04) rotate(2deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "rise-in": "rise-in 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "seal-in": "seal-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
