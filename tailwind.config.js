const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#F7F9FC',
          surface: '#FFFFFF',
          surface2: '#F1F5FF',
          border: 'rgba(15, 23, 42, 0.12)'
        },
        text: {
          primary: '#0B1220',
          muted: '#5B6B86'
        },
        primary: {
          DEFAULT: '#0EA5E9',
          foreground: '#062032'
        },
        secondary: {
          DEFAULT: '#84CC16',
          foreground: '#0B1B07'
        },
        accent: {
          DEFAULT: '#0EA5E9'
        },
        accent2: {
          DEFAULT: '#84CC16'
        },
        success: {
          DEFAULT: '#16A34A'
        },
        danger: {
          DEFAULT: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono]
      },
      boxShadow: {
        surface:
          '0 30px 70px rgba(2, 8, 23, 0.12), 0 10px 22px rgba(2, 8, 23, 0.08)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')]
}

