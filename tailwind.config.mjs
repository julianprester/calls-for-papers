import daisyui from "daisyui"
import typography from "@tailwindcss/typography"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./www/**/*.{html,js,njk}"],
  theme: {
    extend: {},
  },
  plugins: [
    typography,
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
