/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Puedes agregar colores personalizados para la marca de Doña María
        brand: {
          light: "#ffedd5", // Un naranja muy clarito
          DEFAULT: "#f97316", // El naranja clásico de Tailwind
          dark: "#c2410c", // Un tono más quemado tipo madera
        },
      },
    },
  },
  plugins: [],
};
