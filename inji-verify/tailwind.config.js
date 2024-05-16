/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        base: "var(--iv-font-base)"
      },
      colors: {
        primary: "var(--iv-primary-color)"
      }
    },
  },
  plugins: [],
}
