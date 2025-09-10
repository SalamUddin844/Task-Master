/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937',    // dark gray / main color
        secondary: '#4B5563',  // medium gray / accent
        accent: '#FBBF24',     // yellow / highlights
        light: '#F3F4F6',      // light background
        dark: '#111827',       // dark background
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        128: '32rem', // example custom spacing
        144: '36rem',
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        'custom-light': '0 2px 15px rgba(0,0,0,0.05)',
        'custom-dark': '0 2px 15px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
