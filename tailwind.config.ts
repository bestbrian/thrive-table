import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/pages/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['var(--font-jakarta-sans)', 'sans-serif'],
      },
      colors: {
        thrive: {
          purple: '#674263',
          pink: '#f7cee3',
        },
      },
    },
  },
  plugins: [],
};

export default config;
