/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "var(--color-obsidian)",
        surface: "var(--color-surface)",
        'surface-2': "var(--color-surface-2)",
        border: "var(--color-border)",
        emerald: "var(--color-emerald)",
        gold: "var(--color-gold)",
        coral: "var(--color-coral)",
        'text-primary': "var(--color-text-primary)",
        'text-secondary': "var(--color-text-secondary)",
        'text-muted': "var(--color-text-muted)",
      },
      fontFamily: {
        display: ['"Clash Display"', '"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
