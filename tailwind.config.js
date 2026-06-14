/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bbe0ff',
          300: '#8bcdff',
          400: '#54b0ff',
          500: '#2b8fff',
          600: '#146ff5',
          700: '#0d59e1',
          800: '#1148b6',
          900: '#143f8f',
          950: '#0c2761',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#38d97a',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        neon: {
          blue: '#00d4ff',
          green: '#00ff88',
          purple: '#a855f7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
