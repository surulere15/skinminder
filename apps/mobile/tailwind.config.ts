import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        "bg-secondary": "#0a0a0a",
        surface: "#111111",
        "surface-elevated": "#1a1a1a",
        "surface-card": "rgba(255, 255, 255, 0.04)",
        border: "rgba(255, 255, 255, 0.08)",
        "border-light": "rgba(255, 255, 255, 0.12)",
        primary: "#c9a96e",
        "primary-light": "#dfc08a",
        "primary-dark": "#a08050",
        "primary-glow": "rgba(201, 169, 110, 0.15)",
        "primary-subtle": "rgba(201, 169, 110, 0.08)",
        text: "#ffffff",
        "text-secondary": "rgba(255, 255, 255, 0.7)",
        "text-tertiary": "rgba(255, 255, 255, 0.5)",
        "text-quaternary": "rgba(255, 255, 255, 0.3)",
        success: "#34d399",
        warning: "#fbbf24",
        error: "#f87171",
        info: "#60a5fa",
      },
      fontFamily: {
        display: ["SF Pro Display", "system-ui"],
        body: ["SF Pro Text", "system-ui"],
      },
    },
  },
  plugins: [],
} satisfies Config;
