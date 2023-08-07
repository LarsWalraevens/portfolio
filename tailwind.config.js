/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{html,js,tsx,ts}", "./src/components/**/*.{html,js,tsx,ts}"],
  theme: {
    colors: {
      white: {
        100: '#FFFFFF',
        200: '#E2E2E2',
      },
      black: {
        100: '#39393A',
        200: '#262525',
        300: '#171717',
        400: '#121212',
        900: '#000000',
      },
      grey: {
        100: '#D7D7D7',
        200: '#B1B1B1',
        300: '#AAAAAA',
        400: '#939393',
        500: '#545454',
        600: '#393939',
      },
      blue: {
        100: '#CEDAF3',
        400: '#3C8AE5',
      },
      green: {
        100: '#D1E7DD',
        400: '#00E2B8',
        600: '#256245',
      },
      red: {
        100: '#F8D7DA',
        500: '#C5162E',
      },
      yellow: {
        100: '#FFF3CD',
        300: '#D8A915',
        600: '#725A11',
      }
    },
    fontSize: {
      sm: '0.9rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
    extend: {
      fontFamily: {
        Marcellus: ['Marcellus', 'sans-serif'],
        secondary: ['Titillium Web', 'sans-serif'],
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