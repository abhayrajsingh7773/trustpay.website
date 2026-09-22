/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        surface: '#111114',
        'surface-2': '#18181d',
        border: '#1f1f26',
        'border-light': '#2a2a35',
        risk: {
          low: '#22c55e',
          medium: '#f59e0b',
          high: '#ef4444',
        },
        accent: '#ef4444',
        'accent-dim': '#991b1b',
        muted: '#6b7280',
        subtle: '#374151',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'gauge-fill': 'gauge 1.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
