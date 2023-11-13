import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      primaryBlack: '#0d1321',
      white: '#FFFFFF',
      button1: '#1d2d44',
      darkGrey: '#1b263b',
      primaryGrey: '#0d1b2a',
      button2: '#6366f1',
      red1: '#e63946',
    },
  },
  plugins: [],
}
export default config
