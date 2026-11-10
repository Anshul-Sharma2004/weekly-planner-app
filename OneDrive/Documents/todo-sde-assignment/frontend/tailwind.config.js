/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        creamBase: '#FFF8EF',
        frostMint: '#F1F7F7',
        frostAqua: '#B0D7D8',
        mistTeal: '#D5E5E5',
        slateSage: '#5D6B6B',
        softRose: '#F7CBCA',
        blushPetal: '#F2D2D4',
        roseDust: '#C88A93',
        plumBerry: '#7A535A',
        deepEspresso: '#3A2A2D',
        warmOat: '#DDD3D3',
      },
      boxShadow: {
        softGlass: '0 8px 30px 0 rgba(122, 83, 90, 0.08)',
        blushGlow: '0 4px 20px 0 rgba(200, 138, 147, 0.25)',
      },
    },
  },
  plugins: [],
}