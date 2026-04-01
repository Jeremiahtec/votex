/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'var(--color-border)',
        background: 'var(--color-bg)',
        foreground: 'var(--color-text)',
        muted: 'var(--color-muted)',
        primary: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#52525b',
          600: '#3f3f46',
          700: '#27272a',
          900: '#09090b',
        },
        surface: {
          base:     '#09090b',   /* zinc-950 */
          default:  '#18181b',   /* zinc-900 */
          elevated: '#27272a',   /* zinc-800 */
          border:   '#3f3f46',   /* zinc-700 */
        }
      },
      boxShadow: {
        'card':      '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':'0 0 0 1px rgba(255,255,255,0.3), 0 8px 32px rgba(0,0,0,0.5)',
        'btn':       '0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glow':      '0 0 20px rgba(255,255,255,0.1)',
        'saas':      '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 4px 12px -2px rgb(0 0 0 / 0.05)',
        'saas-lg':   '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 10px 25px -5px rgb(0 0 0 / 0.08)',
        'saas-dark': '0 4px 12px -2px rgb(0 0 0 / 0.5)',
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer':  'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                            to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:   { from: { backgroundPosition: '200% 0' },            to: { backgroundPosition: '-200% 0' } },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,255,255,0)' },
          '50%':      { boxShadow: '0 0 16px 4px rgba(255,255,255,0.1)' },
        }
      }
    },
  },
  plugins: [],
}
