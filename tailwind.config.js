/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#8B2252', // borgonia
          primaryLight: '#a13364',
          primaryDark: '#6d183f',
        },
        background: {
          primary: '#FDFAF9', // crema
          card: '#FFFFFF',
        },
        accent: {
          pink: '#F2C4D0', // rosa suave
          purple: '#534AB7', // lutea
          rose: '#C0527A', // ovulacion
          peach: '#FDFAF9', // folicular
        },
        text: {
          primary: '#1A0A10',
          secondary: '#7A4A5A',
        },
        success: '#0F6E56',
        warning: '#C4892A',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
}
