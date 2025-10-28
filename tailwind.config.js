/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: "#999999",
        purple: "#9B59B6",
        black: "#1A1E23",
        white: "#EFEFED",
      },
    },
  },
  plugins: [],
};
