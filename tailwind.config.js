
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html',
  './src/**/*.{html,js,ts,jsx,tsx}'],
  plugins: [
    require('daisyui'),
  ]
} 

// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [require('daisyui')],
// }

