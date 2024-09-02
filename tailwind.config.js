
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html',
  './src/**/*.{html,js,ts,jsx,tsx}'],
  plugins: [
    require('daisyui'),
  ]
} 

module.exports = {
  //...
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#192F01",
          "secondary": "#FAE2D5",
          "accent": "#EADDFF",
          "neutral": "#F8EFEA",
          "base-100": "#ffffff",
        },
      },
    ],
  },
}

// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [require('daisyui')],
// }

