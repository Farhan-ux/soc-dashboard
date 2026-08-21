/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'soc-bg': '#0a0e17',
        'soc-panel': '#0f1520',
        'soc-border': '#1a2535',
        'soc-cyber': '#00f0ff',
        'soc-green': '#00ff88',
        'soc-red': '#ff2d55',
        'soc-amber': '#ffb800',
        'soc-purple': '#a855f7',
        'soc-text': '#c8d6e5',
        'soc-muted': '#4a5568',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
