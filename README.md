# Portfolio

Personal portfolio site for Bharat Bharat, product designer in Amsterdam. Current live site: [bharatbharat.co](https://bharatbharat.co).

## Concept

A horizontal deck of viewport-sized cards. Super minimal, only necessary content.

- The landing card is the pitch alone, 70% of the viewport on a transparent ground.
- Vertical scroll drives horizontal travel through the deck in strict priority order: pitch → 01 (flagship) → 02 → 03 → other case studies → lab → contact.
- Full-height snap stops keep exactly one card in focus; neighbours dim and dissolve at the edges.
- The whole track zooms out in proportion to scroll speed and springs back when you stop.
- Clicking a card opens the full case study (or lab log) as its own view, with left and right arrows and a position counter to page through the set.
- Modular by design: each card is one component fed by one data entry, so adding a case study is one entry.

## Progress

- `wireframes/bento-wireframe.html`: the locked interactive wireframe. Open it in a browser and click around.
- The site is built: Next.js 16 (App Router), TypeScript, Tailwind v4, Motion. Run `npm run dev`.
  - `/` is the bento card. Case studies and the lab open as overlays, so the URL updates without a navigation.
  - `/work/[slug]` and `/lab` are real prerendered pages for direct links, sharing and SEO.
  - Responsive: four-column bento above 1100px, two columns to 760px, a single stack below that.
- Visual design pass done, staying inside the wireframe language: neutral ramp with a single blueprint accent, one type scale (mono labels, tabular numerals, tightening display tracking), and a shared motion vocabulary — tiles stagger in, bars draw from the left, the lab reflows around an expanded box, the availability dot breathes. All text clears WCAG AA in both themes.
- Every route is built: `/` (the bento card), `/story`, `/work/[slug]`, `/lab`, `/lab/[slug]`, a styled 404, plus generated OG images, sitemap and robots. 22 prerendered routes.
- Next: real case study writing, and imagery to replace the placeholders.

## Design rules

Simple, minimal, informative — carried by typography, motion and visuals rather than copy. One view on desktop, no scrolling; mobile may scroll or use different interactions. Full list in `CLAUDE.md`; `npm run design` checks the enforceable ones across every route, width and theme.

## Reference projects

Selected work lives in these repos:

- [session-culture](https://github.com/1509bharat-crypto/session-culture): landing site for Session Culture, a creative collective in Amsterdam
- [Mona](https://github.com/1509bharat-crypto/Mona): AI powered employee experience platform
- [echo-digital-legacy](https://github.com/1509bharat-crypto/echo-digital-legacy): digital legacy platform (Next.js 14, TypeScript, Tailwind, Framer Motion)
- [cineco](https://github.com/1509bharat-crypto/cineco): AI powered personal movie curator with conversational interface
- [lisa-asset-manager](https://github.com/1509bharat-crypto/lisa-asset-manager): asset library with Figma plugin integration
- [monitor-dashboard](https://github.com/1509bharat-crypto/monitor-dashboard): monitoring dashboard with Material Design 3
- [visualiser-theme-customiser](https://github.com/1509bharat-crypto/visualiser-theme-customiser): data visualization dashboard for survey and research analytics
