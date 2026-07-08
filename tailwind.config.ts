import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        google: {
          blue: "#1a73e8",
          blueHover: "#185abc",
          blueLight: "#e8f0fe",
          border: "#dadce0",
          text: "#3c4043",
          textLight: "#70757a",
        },
      },
      fontFamily: {
        sans: ['"Google Sans"', "Roboto", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
