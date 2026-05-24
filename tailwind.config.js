/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#0191FF",
        brand2: "#38B6FF",
        ink: "#1F2937",
        muted: "#7A8A9E",
        surface: "#F3F7FB"
      },
      boxShadow: {
        soft: "0 4px 12px rgba(26, 85, 130, 0.045)",
        insetBlue: "inset 0 1px 0 rgba(255,255,255,0.72), 0 6px 16px rgba(1,145,255,0.12)"
      }
    }
  },
  plugins: []
};
