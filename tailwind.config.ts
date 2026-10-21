import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#102a43", accent: "#1677c8", mist: "#eef4f8" } } },
  plugins: []
} satisfies Config;
