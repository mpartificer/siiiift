/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
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

