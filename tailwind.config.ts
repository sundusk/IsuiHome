import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ice: {
          50: "#f2f9ff",
          100: "#e4f2ff",
          200: "#c8e4ff",
          300: "#a7d4ff",
          400: "#7ec0ff",
          500: "#52a7ff",
          600: "#2f86f5",
          700: "#2469d2",
          800: "#2257aa",
          900: "#214a86"
        }
      },
      boxShadow: {
        frost: "0 12px 40px rgba(36, 105, 210, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
