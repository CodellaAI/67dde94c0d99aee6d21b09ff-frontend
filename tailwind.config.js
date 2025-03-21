
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        reddit: {
          orange: '#FF4500',
          red: '#F74300',
          blue: '#0079D3',
          lightgray: '#F6F7F8',
          gray: '#DAE0E6',
          darkgray: '#1A1A1B',
          hover: '#1A1A1B08'
        }
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
}
