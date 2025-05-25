/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wallet: {
           DEFAULT: '#6366F1',       // primary brand
          light: '#A5B4FC',         // light variant
          dark: '#4F46E5',          // for dark mode accents
          accent: '#C7D2FE',        // for hover, outlines, etc.
        },
        background: {
          light: '#F9FAFB',
          dark: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
    },
  },
  plugins: [],
}

