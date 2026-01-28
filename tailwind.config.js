/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'flash-red': 'flashRed 1s infinite',
        'pulse-border': 'pulseBorder 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        flashRed: {
          '0%, 100%': { backgroundColor: 'rgba(220, 38, 38, 0.1)' },
          '50%': { backgroundColor: 'rgba(153, 27, 27, 0.3)' },
        },
        pulseBorder: {
          '0%, 100%': { borderColor: 'rgba(234, 179, 8, 0.5)' },
          '50%': { borderColor: 'rgba(234, 179, 8, 1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: [],
}