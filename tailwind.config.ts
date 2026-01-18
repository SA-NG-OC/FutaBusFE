import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // 🔑 Enable class-based dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./feature/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors từ shared/constants/colors.ts
        primary: '#D83E3E',
        'primary-dark': '#8B1A1A',
        secondary: '#F5EFE1',
        'secondary-dark': '#ECDDC0',
        background: '#EAEAEA',
      },
    },
  },
  plugins: [],
};

export default config;
