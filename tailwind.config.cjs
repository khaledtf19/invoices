/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        width: "width",
        "max-height": "max-height",
      },
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
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },

        enterFromLeftKey: {
          from: {
            transform: "translateX(-95%)",
          },

          "75%": {
            transform: "translateX(3%)",
          },

          to: {
            transform: "translateX(0)",
          },
        },

        enterFromRightKey: {
          from: {
            transform: "translateX(95%)",
          },

          "60%": {
            transform: "translateX(-3%)",
          },

          to: {
            transform: "translateX(0)",
          },
        },
      },

      animation: {
        startAnimation: "startKey 300ms ease-in 1",
        opacityAnimation: "opacityKey 300ms linear 1 ",
        enterFromLeft: "enterFromLeftKey 500ms ease-in-out 1",
        enterFromRight: "enterFromRightKey 500ms ease-in-out 1",
      },
    },
  },
  plugins: [],
};
