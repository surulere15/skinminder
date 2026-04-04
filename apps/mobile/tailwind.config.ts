import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8f7f4",
          100: "#efece5",
          200: "#ddd8cc",
          300: "#c7bfae",
          400: "#b0a18b",
          500: "#a18b6f",
          600: "#947961",
          700: "#7c6351",
          800: "#665246",
          900: "#55453c",
          950: "#2d231e",
        },
        skin: {
          rose: "#f4c2c2",
          ivory: "#fffff0",
          sand: "#c2b280",
          honey: "#ebc644",
          amber: "#ffbf00",
          bronze: "#cd7f32",
          espresso: "#3c1414",
        },
        surface: {
          DEFAULT: "#0A0A0A",
          elevated: "#141414",
          card: "#1a1a1a",
          border: "#2a2a2a",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
