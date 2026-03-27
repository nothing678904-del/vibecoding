import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "[class='dark']"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        calm: "#06d6a0",
        moderate: "#118ab2",
        tense: "#ffd166",
        stressed: "#ef476f",
        critical: "#ff006e",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
