/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 This enables class-based dark mode
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f9fafb',
          100: '#1f2937',
          200: '#111827',
          300: '#0f172a',
          400: '#0a0f1c',
        },
      },
    },
  },
  plugins: [],
};
