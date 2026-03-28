module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#0B1220',
          surface: '#111B2E',
          border: 'rgba(255,255,255,0.08)'
        },
        text: {
          primary: '#E6EDF7',
          muted: '#9FB0CC'
        },
        accent: {
          DEFAULT: '#6AA6FF'
        },
        success: {
          DEFAULT: '#34D399'
        },
        danger: {
          DEFAULT: '#F87171'
        }
      }
    }
  },
  plugins: []
}

