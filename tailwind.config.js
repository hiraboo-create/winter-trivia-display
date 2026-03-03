/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1A3A5C',
        'ice-blue': '#5B9BD5',
        gold: '#C9A84C',
        'light-grey': '#CBD5E1',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'cursive'],
      },
    },
  },
  plugins: [],
}
