// tailwind.config.js
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}", // Include Next.js pages
    "./src/components/**/*.{js,ts,jsx,tsx}", // Include Next.js components
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "576px", // => @media (min-width: 576px) { ... }
      md: "767px", // => @media (min-width: 767px) { ... }
      lg: "992px", // => @media (min-width: 992px) { ... }
      xl: "1200px", // => @media (min-width: 1200px) { ... }
      xxl: "1400px", // => @media (min-width: 1400px) { ... }
    },
    extend: {
      backgroundImage: {
        "refer-card-gradient":
          "radial-gradient(62.8% 100% at 49.84% 0%, #FFE9BF 0%, #FFE582 100%)",
        "card-gradient": "linear-gradient(180deg, #F9F9F9 0%, #F9F9F9 100%)",
        "dark-card-gradient":
          "linear-gradient(180deg, #161618 0%, #161618 100%)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        "cus-1": "0px 1px 2px 0px #0000000D",
      },
      height: {
        unset: "unset",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
