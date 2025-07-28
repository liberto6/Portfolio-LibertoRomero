// tailwind.config.mjs
import flowbite from 'flowbite/plugin';

export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"
    ,"./node_modules/flowbite/**/*.js"],
  darkMode: 'class', // Usa 'class' para activar dark mode con una clase .dark
  theme: {
    extend: {
      colors: {
        primary: '#06b6d4',   // Cyan Tailwind
        secondary: '#1e40af', // Azul oscuro
        accent: '#f59e0b',    // Amarillo suave
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [flowbite],
};
