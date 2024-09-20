/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode:'class',
  mode:'jit',
  theme: {
    extend: {
      colors:{
        primary:'#865ABF',
        secondary:'#B593E1',
        accent:'#9D66E1',
        background:'#F4F7F8',
        text:'#121613',
        text_white:'#F4F7F8',
        premiumBlack: '#121212',
      },
      fontFamily:{
        lato:['Lato']
      },
      boxShadow:{
        'custom':'0px 4px 10px rgba(0, 0, 0, 0.25)'
      }
    },
  },
  plugins: [
    function({addUtilities,theme}){
      addUtilities({
        '.placeholder-primary':{
          '::placeholder':{
            colors:theme('colors.primary')
          },
        },
          '.placeholder-white':{
            '::placeholder':{
              colors:theme('colors.background')
            },
          },
          '.custom-scrollbar': {
            '::-webkit-scrollbar': {
              width: '4px',
            },
            '::-webkit-scrollbar-thumb': {
              backgroundColor: theme('colors.primary'),
              borderRadius: '9999px',
            },
            '::-webkit-scrollbar-track': {
              backgroundColor: theme('colors.primary'),
            },
          },
      },)
    }
  ],
}

