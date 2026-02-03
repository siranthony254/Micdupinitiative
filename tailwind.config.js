/** @type {import('tailwindcss').Config} */
const repoName = "mui-web";

module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: "class",
  prefix: repoName ? `${repoName}-` : "", // optional if needed
};
