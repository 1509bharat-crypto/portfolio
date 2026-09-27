import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      // Import .svg as a React component rather than a URL, so the icon can
      // take its colour from `currentColor` and its size from the type scale.
      // `icon: true` drops the file's own 48×48 and sets width/height to 1em.
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
              svgProps: { fill: "currentColor" },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
