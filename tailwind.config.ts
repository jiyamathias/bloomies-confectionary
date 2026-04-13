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
        cream:       '#FAFAFE',
        blush:       '#E8DAFF',
        lilac:       '#C5B0E8',
        rose:        '#E8609A',
        'deep-rose': '#D03878',
        mauve:       '#9B7EC8',
        choc:        '#5B2D8E',
        'choc-2':    '#6B3D9E',
        warm:        '#FFFAF7',
        soft:        '#F0EBFF',
        gold:        '#9B7EC8',
        mid:         '#7B5EA7',
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
