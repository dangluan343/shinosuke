import type { Config } from "tailwindcss";
import { colors, fontSize, spacing, borderRadius } from "./src/tokens";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: colors,
      fontSize: fontSize,
      spacing: spacing,
      borderRadius: borderRadius,
      fontFamily: {
        "display-lg": ["var(--font-bricolage)", "sans-serif"],
        "display-lg-mobile": ["var(--font-bricolage)", "sans-serif"],
        "headline-md": ["var(--font-bricolage)", "sans-serif"],
        "headline-sm": ["var(--font-bricolage)", "sans-serif"],
        "body-lg": ["var(--font-jakarta)", "sans-serif"],
        "body-md": ["var(--font-jakarta)", "sans-serif"],
        caption: ["var(--font-jakarta)", "sans-serif"],
        "label-bold": ["var(--font-space)", "sans-serif"],
      },
      boxShadow: {
        hard: "4px 4px 0px 0px #1e1b18",
        "hard-lg": "8px 8px 0px 0px #1e1b18",
        "hard-xl": "12px 12px 0px 0px #1e1b18",
        "hard-white": "6px 6px 0px 0px #ffffff",
      },
      borderWidth: {
        "3": "3px",
      },
      keyframes: {
        "shin-bounce": {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-10px) rotate(2deg)" },
        },
      },
      animation: {
        "shin-bounce": "shin-bounce 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

