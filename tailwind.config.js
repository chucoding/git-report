const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#070A12',
          surface: '#0D1426',
          border: 'rgba(255,255,255,0.09)'
        },
        text: {
          primary: '#EEF3FF',
          muted: '#A7B6D6'
        },
        accent: {
          DEFAULT: '#B8FF5A'
        },
        accent2: {
          DEFAULT: '#65D5FF'
        },
        success: {
          DEFAULT: '#34D399'
        },
        danger: {
          DEFAULT: '#F87171'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono]
      },
      boxShadow: {
        surface:
          '0 20px 70px rgba(0,0,0,0.55), 0 12px 30px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}

