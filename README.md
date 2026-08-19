# Portfolio

Personal portfolio site for Bharat Bharat, product designer in Amsterdam. Current live site: [bharatbharat.co](https://bharatbharat.co).

## Concept

A single bento card, everything scannable at a glance, minimal scrolling.

- Name, availability, what I'm doing now and contact live in their own bento tile — no floating bar above the card. Inside a case study, the story or a lab log, the same block sits at the foot of the map column.
- The card leads with the pitch at display size, then the work band in strict priority order: case study 01 (flagship) → 02 → 03 → other case studies → lab.
- Clicking a case study opens one case study per view with a mini map of all of them.
- The lab is a full card grid of experiment boxes that expand in place.
- Modular by design: each tile is one component fed by one data entry, so adding a case study is one entry.

## Progress

- `wireframes/bento-wireframe.html`: the locked interactive wireframe. Open it in a browser and click around.
- The site is built: Next.js 16 (App Router), TypeScript, Tailwind v4, Motion. Run `npm run dev`.
  - `/` is the bento card. Case studies and the lab open as overlays, so the URL updates without a navigation.
  - `/work/[slug]` and `/lab` are real prerendered pages for direct links, sharing and SEO.
  - Responsive: four-column bento above 1100px, two columns to 760px, a single stack below that.
- Visual design pass done, staying inside the wireframe language: neutral ramp with a single blueprint accent, one type scale (mono labels, tabular numerals, tightening display tracking), and a shared motion vocabulary — tiles stagger in, bars draw from the left, the lab reflows around an expanded box, the availability dot breathes. All text clears WCAG AA in both themes.
- Every route is built: `/` (the bento card), `/story`, `/work/[slug]`, `/lab`, `/lab/[slug]`, a styled 404, plus generated OG images, sitemap and robots. 22 prerendered routes.
- Next: real case study writing, and imagery to replace the placeholders.

## Reference projects

Selected work lives in these repos:

- [session-culture](https://github.com/1509bharat-crypto/session-culture): landing site for Session Culture, a creative collective in Amsterdam
- [Mona](https://github.com/1509bharat-crypto/Mona): AI powered employee experience platform
- [echo-digital-legacy](https://github.com/1509bharat-crypto/echo-digital-legacy): digital legacy platform (Next.js 14, TypeScript, Tailwind, Framer Motion)
- [cineco](https://github.com/1509bharat-crypto/cineco): AI powered personal movie curator with conversational interface
- [lisa-asset-manager](https://github.com/1509bharat-crypto/lisa-asset-manager): asset library with Figma plugin integration
- [monitor-dashboard](https://github.com/1509bharat-crypto/monitor-dashboard): monitoring dashboard with Material Design 3
- [visualiser-theme-customiser](https://github.com/1509bharat-crypto/visualiser-theme-customiser): data visualization dashboard for survey and research analytics
