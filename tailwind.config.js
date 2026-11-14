/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ev: {
          blue: '#00D2FF',
          teal: '#00F5D4',
          dark: '#0B1120',
          slate: '#0F172A',
          card: '#1E293B',
          surface: '#151F32',
          border: '#334155',
          accent: '#38BDF8',
          green: '#10B981',
          amber: '#F59E0B',
          red: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px rgba(0, 210, 255, 0.35)',
        'glow-teal': '0 0 25px rgba(0, 245, 212, 0.35)',
        'glow-sm': '0 0 10px rgba(0, 210, 255, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radar 2s ease-out infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
