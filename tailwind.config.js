module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        // Colores inspirados en vuejs.org modo dark
        background: {
          DEFAULT: '#ffffff', // claro
          dark: '#181818',    // fondo principal dark
        },
        surface: {
          DEFAULT: '#f6f6f7',
          dark: '#232324',    // tarjetas y paneles dark
        },
        primary: {
          DEFAULT: '#00cba9', // verde agua
          dark: '#3eaf7c',    // verde Vue dark
        },
        accent: {
          DEFAULT: '#0396a6', // azul corporativo
          dark: '#448aff',    // azul Vue dark
        },
        text: {
          DEFAULT: '#015059', // texto principal
          dark: '#ffffff',    // texto principal dark
        },
        muted: {
          DEFAULT: '#6b7280', // gris Tailwind
          dark: '#bdbdbd',    // gris claro dark
        },
        border: {
          DEFAULT: '#e5e7eb', // gris claro
          dark: '#2c2c32',    // borde dark
        },
      },
    },
  },
  plugins: [],
};
