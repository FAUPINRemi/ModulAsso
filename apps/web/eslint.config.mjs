import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  ...coreWebVitals,
  ...typescript,
  globalIgnores([".next/**", "out/**", "coverage/**", "next-env.d.ts"]),
  {
    // Un fichier ne dépasse pas environ 150 lignes.
    // Les apostrophes françaises sont partout dans les textes : la règle ne sert à rien ici.
    rules: {
      "react/no-unescaped-entities": "off",
      "max-lines": ["warn", { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },
]);
