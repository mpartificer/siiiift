/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#496354",
          "secondary": "#EBD2AD",
          "accent": "#EADDFF",
          "neutral": "#F2F2F2",
          "base-100": "#ffffff",
        },
      },
    ],
  },
}

