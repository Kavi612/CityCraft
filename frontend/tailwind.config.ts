import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FBF7F0',
        surface: '#FFFFFF',
        border: '#E7E0D4',
        navy: {
          DEFAULT: '#1A2B48',
          muted: '#4A5568',
        },
        primary: {
          DEFAULT: '#D97706',
          hover: '#B45309',
          light: '#FEF3C7',
        },
        secondary: {
          DEFAULT: '#5B8A72',
          hover: '#4A7360',
          light: '#E4EDE8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '1rem',
      },
      boxShadow: {
        card: '0 2px 16px rgba(28, 25, 23, 0.07), 0 1px 4px rgba(28, 25, 23, 0.04)',
        'card-hover':
          '0 4px 24px rgba(28, 25, 23, 0.10), 0 2px 8px rgba(28, 25, 23, 0.05)',
      },
    },
  },
} satisfies Config
