/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    extend: {
      fontFamily: {
        'gotham-rounded-bold': ['"Gotham Rounded Bold"', 'sans-serif'],
        'gotham-rounded-medium': ['"Gotham Rounded Medium"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};