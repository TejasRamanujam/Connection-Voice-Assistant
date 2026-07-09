import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Daylight face — warm chart paper
        paper: '#F2EDE0',
        'paper-deep': '#E9E2CF',
        'paper-line': 'rgba(28, 26, 21, 0.14)',
        'paper-grid': 'rgba(28, 26, 21, 0.07)',
        ink: {
          DEFAULT: '#1C1A15',
          mid: '#57534A',
          dim: '#8B8578',
        },
        // Signal accent — recorder pen
        signal: {
          DEFAULT: '#D9420B',
          deep: '#A83208',
          wash: 'rgba(217, 66, 11, 0.09)',
        },
        // Night face — the instrument in voice mode
        night: '#12100B',
        'night-raised': '#1C1912',
        'night-line': 'rgba(255, 176, 0, 0.18)',
        amber: {
          DEFAULT: '#FFB000',
          dim: '#B98410',
          faint: 'rgba(255, 176, 0, 0.55)',
        },
        bone: '#EFE9DA',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tele: '0.14em',
        wide2: '0.22em',
      },
      animation: {
        lamp: 'lamp 1.6s steps(2, jump-none) infinite',
        caret: 'caret 0.9s steps(2, jump-none) infinite',
        'entry-in': 'entry-in 0.45s cubic-bezier(0.19, 1, 0.22, 1) both',
        'deck-in': 'deck-in 0.5s cubic-bezier(0.19, 1, 0.22, 1) both',
        'sheet-in': 'sheet-in 0.4s cubic-bezier(0.19, 1, 0.22, 1) both',
        'fade-in': 'fade-in 0.35s ease both',
        'word-in': 'word-in 0.5s cubic-bezier(0.19, 1, 0.22, 1) both',
      },
      keyframes: {
        lamp: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.25' } },
        caret: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
        'entry-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'deck-in': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'sheet-in': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'word-in': {
          from: { opacity: '0', transform: 'translateY(0.35em) skewX(-6deg)' },
          to: { opacity: '1', transform: 'translateY(0) skewX(-6deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
