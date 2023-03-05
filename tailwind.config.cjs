/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        startKey: {
          "0%": {
            transform: "translateY(-30%)",
          },
          "80%": {
            transform: "translateY(3%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },

        opacityKey: {
          "0%": {
            opacity: 0,
          },
          "50%": {
            opacity: 0.5,
          },
          "100%": {
            opacity: 1,
          },
        },
      },

      animation: {
        startAnimation: "startKey 300ms ease-in 1",
        opacityAnimation: "opacityKey 300ms linear 1 ",
      },
    },
  },
  plugins: [],
};
