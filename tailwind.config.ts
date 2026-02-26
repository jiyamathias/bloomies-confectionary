import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:  { DEFAULT: '#fdf8f2', 2: '#f7ede0', 3: '#ecdcca' },
        cocoa:  { DEFAULT: '#241409', 2: '#3d2210', 3: '#7a4a2e' },
        gold:   { DEFAULT: '#c8913a', 2: '#e6c06a', 3: '#f5e4c0' },
        rose:   '#bf4f49',
        dark:   '#120a03',
      },
      fontFamily: {
        playfair:  ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        dm:        ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'gold-sm':  '0 4px 14px rgba(200,145,58,.22)',
        'gold-md':  '0 8px 32px rgba(200,145,58,.30)',
        'gold-lg':  '0 12px 48px rgba(200,145,58,.45)',
        'dark-sm':  '0 2px 12px rgba(36,20,9,.07)',
        'dark-md':  '0 8px 32px rgba(36,20,9,.10)',
        'dark-lg':  '0 24px 64px rgba(36,20,9,.14)',
        'green-lg': '0 8px 28px rgba(37,211,102,.38)',
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg,#c8913a,#e6c06a)',
        'cocoa-gradient': 'linear-gradient(135deg,#241409,#3d2210)',
        'wa-gradient':    'linear-gradient(135deg,#1aad4a,#25D366)',
      },
      // Animation utility classes — keyframes are defined in globals.css
      // so they are always emitted and never tree-shaken by Tailwind.
      animation: {
        'marquee':   'marquee 32s linear infinite',
        'orb':       'orbPulse 4.5s ease-in-out infinite',
        'bobble':    'bobble 2.3s ease-in-out infinite',
        'mob-slide': 'mobSlide .3s cubic-bezier(.16,1,.3,1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
