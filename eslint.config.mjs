import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Bharat's pixel page, vendored byte-for-byte by scripts/extract-pixel.mjs.
    // It is never hand-edited, so warnings about it are unactionable.
    "src/pixel/**",
  ]),
]);

export default eslintConfig;
