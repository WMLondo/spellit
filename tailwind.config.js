/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : "class",
  content: [
    "./app/**/*.{html,js,jsx,ts,tsx,mdx}",
    "./components/**/*.{html,js,jsx,ts,tsx,mdx}",
    "./utils/**/*.{html,js,jsx,ts,tsx,mdx}",
    "./*.{html,js,jsx,ts,tsx,mdx}",
    "./src/**/*.{html,js,jsx,ts,tsx,mdx}",
  ],
  presets: [require("nativewind/preset")],
  important: "html",
};
