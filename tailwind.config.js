/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:      '#081525',
        teal:      '#00C4CC',
        magenta:   '#E0197D',
        purple:    '#6B3CC8',
        'mid-blue':'#1A3A6C',
        'light-grey': '#CBD5E1',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'cursive'],
      },
    },
  },
  plugins: [],
}
