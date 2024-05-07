/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./api/templates/**/*.html",
    "./api/static/**/*.js",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-animated"),
    require("tailwindcss-intersect"),
    require("flowbite/plugin")
  ]
}