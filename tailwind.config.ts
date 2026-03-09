import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1F6FFF",
          charcoal: "#1F2328",
          gray: "#F4F6F8",
          white: "#FFFFFF",
          border: "#D7DDE4",
          muted: "#5C6670",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
