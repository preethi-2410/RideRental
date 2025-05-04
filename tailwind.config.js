/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        'primary-dark': '#2563EB',
        accent: '#F59E0B',
      },
      keyframes: {
        modalSlideDown: {
          '0%': { transform: 'translateY(-10%) scale(0.95)', opacity: 0 },
          '100%': { transform: 'translateY(0) scale(1)', opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        modalSlideDown: 'modalSlideDown 0.3s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed-slow': 'float 8s ease-in-out 4s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-slow-reverse': 'spin 8s linear infinite reverse',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'bounce-slow-delayed': 'bounce 3s ease-in-out 1.5s infinite',
        'pulse-delayed': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 1s infinite',
      }
    },
  },
  plugins: [],
} 