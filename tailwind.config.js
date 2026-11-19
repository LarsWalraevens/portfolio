/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{html,js,tsx,ts}", "./src/components/**/*.{html,js,tsx,ts}"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      // Design tokens ("set in iron"): ink-black surfaces, bone text, one oxblood accent.
      ink: '#0B0B0C',
      surface: '#121214',
      raised: '#18181B',
      line: '#26262A',
      line2: '#3A3A40',
      bone: '#ECE8E1',
      muted: '#A19D96',
      faint: '#8A867F',
      accent: {
        DEFAULT: '#A3202A',
        hover: '#C42B36',
      },
      // Legacy scales, remapped onto the tokens so older markup stays on-palette.
      white: {
        100: '#ECE8E1',
        200: '#D6D1C8',
      },
      black: {
        100: '#3A3A40',
        200: '#26262A',
        300: '#121214',
        400: '#0B0B0C',
        500: '#0B0B0C',
        900: '#000000',
      },
      grey: {
        100: '#C9C5BE',
        200: '#B5B1AA',
        300: '#A19D96',
        400: '#8A867F',
        500: '#6B6862',
        600: '#3A3A40',
      },
    },
    fontSize: {
      sm: '0.9rem',
      base: '1rem',
      medium: '1.125rem',
      large: '1.2rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
    extend: {
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        animatedgradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      animation: {
        gradient: 'animatedgradient 6s ease infinite alternate',
      },
    },
    // screens: {
    //   'sm': '640px', // => @media (min-width: 640px) { ... }
    //   'md': '768px', // => @media (min-width: 768px) { ... }
    //   'lg': '1024px', // => @media (min-width: 1024px) { ... }
    //   'xl': '1280px', // => @media (min-width: 1280px) { ... }
    // }
    // screens: {
    //     'sm': '392px',
    //     'md': '692px',
    //     'lg': '902px',
    // },
    // $sm-width: 392px;
    // $md-width: 692px;
    // $lg-width: 902px;
    // $xl-width: 1460px;
    // $xxl-width: 1960px;
  },
  plugins: [],
}