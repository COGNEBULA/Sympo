const { keyframes } = require('framer-motion');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
        "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes : {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
          zoom: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        drop: {
          '0%': { transform: 'translateY(-120px) rotate(0deg)', opacity: '0' },
          '60%': { transform: 'translateY(10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(0px) rotate(0deg)' },
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1.5deg)' },
          '50%': { transform: 'rotate(0deg)' },
          '75%': { transform: 'rotate(-1.5deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        zoom:   'zoom 0.5s   ease-in-out infinite', // adjust duration/easing as needed
        float : 'float 0.3s ease-in-out infinite ',
        lightFlow: "lightFlow 3s linear infinite",
        drop: 'drop 0.9s ease-out forwards',
        wave: 'wave 6s ease-in-out infinite',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'system-ui', 'sans-serif'],
        'rome': ['Times New Roman', 'ui-sans-serif', 'system-ui'],
        georama: ['Georama', 'sans-serif'],
      },
      backgroundSize: {
        "200": "200% 200%",
      },
    },
  },
  plugins: [],
};
