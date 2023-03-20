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
        200: '#171717',
        400: '#131313',
        900: '#000000',
      },
      grey: {
        100: '#B1B1B1',
        200: '#AAAAAA',
        300: '#939393',
        400: '#545454',
        500: '#393939',
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
        TitilliumWeb: ['Titillium Web', 'sans-serif'],
      }
    },
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