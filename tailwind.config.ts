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
        brand: {
          50: "#f3f6ff",
          100: "#e6edff",
          200: "#c2d3ff",
          300: "#9cb8ff",
          400: "#6b8dff",
          500: "#3b62ff",
          600: "#2c4bd1",
          700: "#1f36a3",
          800: "#142475",
          900: "#0b1547"
        }
      },
      boxShadow: {
        "glow-brand": "0 10px 30px -15px rgba(59, 98, 255, 0.5)"
      }
    }
  },
  plugins: []
};

export default config;
