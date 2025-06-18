// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
        'gradient-y': 'gradient-y 8s ease infinite',
        'gradient-xy': 'gradient-xy 10s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: 'left center' },
          '50%': { backgroundPosition: 'right center' },
        },
        'gradient-y': {
          '0%, 100%': { backgroundPosition: 'center top' },
          '50%': { backgroundPosition: 'center bottom' },
        },
        'gradient-xy': {
          '0%, 100%': { backgroundPosition: 'left top' },
          '50%': { backgroundPosition: 'right bottom' },
        },
      },
    },
  },
  plugins: [],
}
