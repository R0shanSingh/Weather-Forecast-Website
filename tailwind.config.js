/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/index.html"],
  theme: {
    extend: {
      backgroundImage: {
        'main-image' : "url('../images/bg.jpg')",
      }
    }
  },
  plugins: [],
}

