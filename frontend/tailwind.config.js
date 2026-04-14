/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0a0a0a",
        border: "#1f2937",
        profit: "#10b981",
        loss: "#ef4444",
      }
    },
  },
  plugins: [],
}
