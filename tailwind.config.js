/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary:'#5ba1d6',
        danger:'#b91c1c'
      }
    },
  },
  plugins: [],
}

// 4694d6