import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        signature: ['var(--font-dancing)', 'cursive'],
      },
      colors: {
        brand: {
          red: '#D40511', // Primary Brand Red
          redDark: '#A60000',
          yellow: '#FFCC00', // Warning / Accent
          yellowDark: '#E6B800',
          black: '#111111', // Deep Black
          gray: '#F3F4F6', // Light Background
          white: '#FFFFFF',
          green: '#008A00', // Success
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;