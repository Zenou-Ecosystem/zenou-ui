/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#052F5F',
        secondary: '#F1A208',
        grayColor: '#475569'
      },
    },
  },
  plugins: [],
}
