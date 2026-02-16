/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1A1A2E',
          navy: '#16213E',
          mid: '#0F3460',
          amber: '#E8B04B',
          teal: '#4ECDC4',
          coral: '#FF6B6B',
          lavender: '#B8B8D1',
          text: '#F5F5F0',
          muted: '#A0A0A0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
