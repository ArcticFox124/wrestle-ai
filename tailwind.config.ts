import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wrestle: {
          dark: "#0b0f19",
          card: "#111827",
          border: "#1f2937",
          red: "#ef4444",
          green: "#22c55e",
          blue: "#3b82f6",
          gold: "#eab308",
        },
      },
    },
  },
  plugins: [],
};
export default config;
