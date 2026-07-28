/**
 * Tailwind CSS v4 s'installe désormais comme un simple plugin PostCSS.
 * Aucun `tailwind.config.ts` n'est nécessaire : le thème est déclaré
 * directement en CSS via la directive `@theme` (voir src/styles/globals.css).
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
