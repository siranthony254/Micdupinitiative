/** @type {import('tailwindcss').Config} */
const repoName = "mui-web";

module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: "class",
  prefix: repoName ? `${repoName}-` : "", // optional if needed
};
