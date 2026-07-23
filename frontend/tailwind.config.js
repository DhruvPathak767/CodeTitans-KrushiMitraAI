/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
          400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
          800: '#166534', 900: '#14532d', 950: '#052e16',
        },
        soil: {
          50: '#faf6f0', 100: '#f3e9d8', 200: '#e6d2b0', 300: '#d4b27e',
          400: '#c08f4d', 500: '#a87330', 600: '#8c5a25', 700: '#6f4422',
          800: '#4a2d18', 900: '#2e1b0f',
        },
        sky: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a',
        },
        gold: {
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706',
        },
        emeraldDeep: '#064e3b',
      },
      boxShadow: {
        soft: '0 2px 20px -4px rgba(0,0,0,0.08)',
        glow: '0 0 40px -10px rgba(34,197,94,0.4)',
        'glow-sky': '0 0 40px -10px rgba(59,130,246,0.4)',
        'glow-gold': '0 0 40px -10px rgba(245,158,11,0.4)',
        'glow-strong': '0 0 50px 5px rgba(34,197,94,0.3)',
        card: '0 1px 3px rgba(0,0,0,0.05), 0 10px 30px -12px rgba(0,0,0,0.12)',
        'card-dark': '0 1px 3px rgba(0,0,0,0.3), 0 10px 30px -12px rgba(0,0,0,0.5)',
        'glass-hover': '0 20px 40px -15px rgba(34,197,94,0.2)',
      },
      backgroundImage: {
        'mesh-light': 'radial-gradient(at 20% 20%, rgba(34,197,94,0.14) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(59,130,246,0.12) 0px, transparent 50%), radial-gradient(at 80% 100%, rgba(168,115,48,0.12) 0px, transparent 50%)',
        'mesh-dark': 'radial-gradient(at 20% 20%, rgba(34,197,94,0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(59,130,246,0.15) 0px, transparent 50%), radial-gradient(at 80% 100%, rgba(168,115,48,0.10) 0px, transparent 50%)',
        'aurora-light': 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(59,130,246,0.1) 50%, rgba(245,158,11,0.1) 100%)',
        'aurora-dark': 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(59,130,246,0.15) 50%, rgba(245,158,11,0.08) 100%)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'spin-slow': { '100%': { transform: 'rotate(360deg)' } },
        pulseRing: { '0%': { transform: 'scale(0.8)', opacity: '0.6' }, '100%': { transform: 'scale(2)', opacity: '0' } },
        drift: { '0%': { transform: 'translateX(-5%)' }, '100%': { transform: 'translateX(105%)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        typing: { '0%,100%': { opacity: '0.2' }, '50%': { opacity: '1' } },
        laserScan: { '0%': { top: '0%' }, '50%': { top: '95%' }, '100%': { top: '0%' } },
        auroraDrift: { '0%,100%': { opacity: '0.5', transform: 'scale(1) rotate(0deg)' }, '50%': { opacity: '0.8', transform: 'scale(1.1) rotate(5deg)' } },
        sunbeam: { '0%,100%': { opacity: '0.2', transform: 'translateY(-2%)' }, '50%': { opacity: '0.4', transform: 'translateY(2%)' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
        'spin-slow': 'spin-slow 12s linear infinite',
        pulseRing: 'pulseRing 1.5s ease-out infinite',
        drift: 'drift 60s linear infinite',
        fadeIn: 'fadeIn 0.6s ease-out',
        typing: 'typing 1.2s ease-in-out infinite',
        laserScan: 'laserScan 2.5s ease-in-out infinite',
        auroraDrift: 'auroraDrift 15s ease-in-out infinite',
        sunbeam: 'sunbeam 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
