/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        titan: {
          bg: '#070a12',
          surface: '#0d1322',
          card: '#111827',
          cardBorder: '#1f293d',
          cardHover: '#162238',
          cyan: '#06b6d4',
          cyanLight: '#22d3ee',
          cyanGlow: 'rgba(6, 182, 212, 0.25)',
          emerald: '#10b981',
          emeraldLight: '#34d399',
          emeraldGlow: 'rgba(16, 185, 129, 0.25)',
          amber: '#f59e0b',
          amberLight: '#fbbf24',
          amberGlow: 'rgba(245, 158, 11, 0.25)',
          crimson: '#ef4444',
          purple: '#a855f7',
          slate: '#64748b',
          slateLight: '#94a3b8',
          textMuted: '#94a3b8',
          textDim: '#475569',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-purple': '0 0 25px -3px rgba(168, 85, 247, 0.45)',
        'terminal': 'inset 0 0 30px rgba(6, 182, 212, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'beacon': 'beacon 2s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        beacon: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        }
      }
    },
  },
  plugins: [],
}
