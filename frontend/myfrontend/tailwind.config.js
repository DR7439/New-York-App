/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      height: {
        "screen-no-nav":
          "calc(100vh - 48px)",
      }
    },
    fontFamily:{
      'roboto': ['Roboto', 'sans-serif']
    }
  },
  plugins: [],
}

