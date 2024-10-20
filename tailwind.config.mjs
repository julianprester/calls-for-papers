import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./www/**/*.{html,js,njk}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    daisyui,
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["night"],
        },
      }
    ],
  },
}
