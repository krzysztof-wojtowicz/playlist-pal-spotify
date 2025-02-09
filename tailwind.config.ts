import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      text: "#fcfcfc",
      background: "#0f0f0f",
      primary: "#1DB954",
      secondary: "#262626",
      accent: "#8c8c8c",
      darker: "#173721",
    },
  },
  plugins: [],
};
export default config;
