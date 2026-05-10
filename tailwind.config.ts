import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        dm:        ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // New Bloomies palette
        'lav-mist':   '#F3F0FA',
        'lavender':   '#A58CF4',
        'deep-purple':'#433075',
        'thistle':    '#E1D7F0',
        'purple-sage':'#6E6A8C',
        'soft-white': '#FAFAFA',
        'jet-black':  '#0D0D0D',
        // Legacy aliases kept for backward compat
        cream:        '#FAFAFA',
        blush:        '#E1D7F0',
        lilac:        '#A58CF4',
        mauve:        '#A58CF4',
        choc:         '#433075',
        'choc-2':     '#433075',
        soft:         '#F3F0FA',
        mid:          '#6E6A8C',
      },
      keyframes: {
        slideMarquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%':      { transform: 'translateX(-50%) translateY(-8px)' },
        },
      },
      animation: {
        'marquee':  'slideMarquee 28s linear infinite',
        'fade-up':  'fadeUp 0.65s ease forwards',
        'bob':      'bob 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
