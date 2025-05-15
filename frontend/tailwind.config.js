/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  safelist: ['input', 'btn'],
  theme: {
    extend: {},
  },
  plugins: [],
};

