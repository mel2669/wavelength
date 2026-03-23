import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "bricolage": ["var(--font-bricolage)", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "4xl": "72px",
      },
    },
  },
  plugins: [],
};

export default config;
