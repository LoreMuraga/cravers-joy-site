/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        pink: {
          DEFAULT: 'var(--pink)',
          light: 'var(--pink-l)',
          dark: 'var(--pink-dark)',
        },
        mahogany: {
          DEFAULT: 'var(--mahogany)',
          light: 'var(--mahogany-light)',
          muted: 'var(--mahogany-muted)',
          soft: 'var(--mahogany-soft)',
        },
        gold: {
          DEFAULT: 'var(--gold)',
          light: 'var(--gold-light)',
          dark: 'var(--gold-dark)',
        },
        cream: {
          DEFAULT: 'var(--cream)',
          surface: 'var(--cream-surface)',
          card: 'var(--cream-card)',
          border: 'var(--cream-border)',
          soft: 'var(--cream-soft)',
        },
        blush: {
          DEFAULT: 'var(--pink)',
          light: 'var(--pink-l)',
          dark: 'var(--pink-dark)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}
