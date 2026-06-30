/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A202C",
          hover: "#2D3748",
          light: "#4A5568",
          dark: "#0D1117",
          muted: "rgba(26,32,44,0.06)",
          50: "#F7FAFC",
          100: "#EDF2F7",
          200: "#E2E8F0",
          300: "#CBD5E0",
          400: "#A0AEC0",
          500: "#718096",
          600: "#4A5568",
          700: "#2D3748",
          800: "#1A202C",
          900: "#0D1117",
        },
        accent: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
          light: "#FEF3C7",
          muted: "rgba(245,158,11,0.10)",
        },
        // TailAdmin brand colors
        brand: {
          DEFAULT: "#3C50E0",
          hover: "#2B3FC2",
          light: "#EEF1FD",
          muted: "rgba(60,80,224,0.08)",
        },
        success: {
          DEFAULT: "#22C55E",
          light: "#DCFCE7",
          dark: "#16A34A",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#FEE2E2",
          dark: "#DC2626",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
          dark: "#D97706",
        },
        info: {
          DEFAULT: "#3B82F6",
          light: "#DBEAFE",
          dark: "#2563EB",
        },
        sidebar: {
          DEFAULT: "#1C2434",
          hover: "#243044",
          active: "#3C50E0",
          text: "#95A3CC",
          "text-bright": "#FFFFFF",
          border: "#243044",
        },
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "Inter", "system-ui", "sans-serif"],
        heading: [
          "Plus Jakarta Sans",
          "Cabinet Grotesk",
          "system-ui",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        "card-hover":
          "0 4px 6px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)",
        "card-sm": "0 1px 2px rgba(0,0,0,0.05)",
        dashboard: "0 1px 3px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      fontSize: {
        "title-sm": ["1.125rem", { lineHeight: "1.5", fontWeight: "700" }],
        "title-md": ["1.25rem", { lineHeight: "1.4", fontWeight: "700" }],
        "title-lg": ["1.5rem", { lineHeight: "1.3", fontWeight: "800" }],
        "metric-lg": ["1.75rem", { lineHeight: "1.2", fontWeight: "800" }],
        "metric-xl": ["2rem", { lineHeight: "1.1", fontWeight: "800" }],
      },
    },
  },
  plugins: [],
};
