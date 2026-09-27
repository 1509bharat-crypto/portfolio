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
  {
    // Links to `/` must be plain anchors here, which is what this rule exists
    // to prevent. The cover is a vendored HTML string whose six inline scripts
    // run as the document parses; a client-side navigation injects that markup
    // through React, which does not execute script tags, and the cover arrives
    // dead — no `ready` class, no scenes. It has to be a document load, so the
    // rule is off for the one route group that links to it.
    files: ["src/app/(pixel)/**/*.tsx"],
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
]);

export default eslintConfig;
