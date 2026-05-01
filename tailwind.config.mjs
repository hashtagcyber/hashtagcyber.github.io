import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a365d',
        secondary: '#7f1d1d',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-headings': '#1a365d',
            '--tw-prose-links': '#1a365d',
            a: {
              color: '#1a365d',
              '&:hover': { color: '#2c5282' },
            },
            h1: { color: '#1a365d' },
            h2: { color: '#1a365d' },
            h3: { color: '#1a365d' },
          },
        },
      },
    },
  },
  plugins: [typography],
};
