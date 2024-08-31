/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        128: "33.1rem",
        144: "36rem",
        160: "40rem",
      },
    },
  },
  plugins: [],
};
