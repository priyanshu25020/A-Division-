/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36abf7',
          500: '#0c8ee9',
          600: '#0270c7',
          700: '#0359a1',
          800: '#074c85',
          900: '#0c406e',
          950: '#082849',
        },
        ldrp: {
          navy: '#1e3a8a',
          blue: '#2563eb',
          accent: '#0284c7',
          gold: '#f59e0b',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 3px -1px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px -5px rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
}
