import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        birch: "#ECE8E0",
        forest: "#3C4A33",
        charcoal: "#161716",
        deepgreen: "#071208",
        moss: "#2F7D32",
        glow: "#65D46E",
        muted: "#9EA99B"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "ui-monospace", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
