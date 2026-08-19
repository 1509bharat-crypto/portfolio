@AGENTS.md

# Portfolio

Personal portfolio for Bharat Bharat. Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Motion 13.

## Commands

```bash
npm run dev      # dev server, Turbopack (default in Next 16)
npm run build    # must pass before committing — it typechecks and prerenders every route
npm start        # serve the production build
npm run lint
```

## The one rule

**Content lives in `src/data/`, never in a component.** `cases.ts`, `lab.ts`, `story.ts`, `profile.ts`.
The grid tiles, detail views, map column, `generateStaticParams`, OG images and the sitemap all derive from those arrays. If a change requires editing a component to add content, the data model is wrong — fix the data model instead.

Priority is list order in `cases.ts`: first entry takes the flagship tile, the next two get their own tiles, `rank: 'other'` entries become rows in the "other case studies" tile. Promoting a story means moving its entry up.

## The wireframe owns the skeleton; the site owns the finish

`wireframes/bento-wireframe.html` is the locked layout — grid areas, priority order, interaction model. Change the skeleton there first, then port.

The *visual* layer has deliberately moved past it (design pass): the palette, type scale and radii in `src/app/globals.css` are the current truth and the wireframe's values are stale. Don't "fix" the site back to match the wireframe's colours or type sizes.

Three things live in exactly one place. Use them; don't inline alternatives:

- **Type scale, colour ramp, radii** — the `:root` token block in `globals.css`. No raw hex or px font sizes in components.
- **Motion** — `src/lib/motion.ts`. Import `springCrisp` / `springLayout` / `easeOut` rather than writing new spring constants.
- **Wireframe primitives** — `src/components/Primitives.tsx`.

## Gotchas

- **A case study renders in two places.** `src/components/CaseDetail.tsx` is used by both the overlay on `/` and the standalone `/work/[slug]` page. Edit it once; never fork the two.
- **Unwritten copy is intentional.** A `Block` with no `body` renders as wireframe bars. That is the design while a story is unwritten — do not invent case study prose to fill it.
- **`params` is a Promise** (Next 16 removed sync access). `const { slug } = await params`.
- **OG images are rendered by Satori, not a browser.** It supports a CSS subset: flex only, and any element with more than one child needs an explicit `display`. JSX counts each text fragment as a child, so `{a}, {b}` is three children — interpolate once instead.
- **Motion `layoutId`s must stay paired.** `case-title-${slug}` sits on both the grid tile and the detail heading; renaming one side silently kills the shared-element morph rather than erroring.
- **Overlays go `position: fixed` below 1100px.** They're absolutely positioned inside the card above that. Any change to `.focusview` / `.labview` needs checking at both sides of that breakpoint.
- **The URL is driven by `history.pushState`, not the router.** `BentoCard` keeps `/work/<slug>` and `/lab` in the address bar without navigating, and a `popstate` listener syncs state back. A cold load of those URLs hits the real route instead. Both paths must keep working.
- **`next dev` rewrites the `AGENTS.md` block** at the top of this file's import. Commit that churn with your work rather than reverting it.

## Conventions

- Every interactive tile is a real `<button>` or `<a>` with an `aria-label` — the design is dense and unlabelled icons read as nothing to a screen reader.
- Respect `prefers-reduced-motion`: components read `useReducedMotion()` and drop to `duration: 0`. New animation must do the same.
- Every text style must clear WCAG AA (4.5:1, or 3:1 at large sizes). `--line-strong` is a *border* value and fails as text — use `--numeral` for quiet type.
- Case study slots (`slot: true`) are `noindex` until they have real content.

## Routes

Every route is prerendered. `/` is the bento card; `/story`, `/work/[slug]` and `/lab` also open as overlays from it, and exist as standalone pages for direct links. `/lab/[slug]` is page-only — the lab log is a navigation, not a nested overlay.

## Not yet done

- **Contact links in `src/data/profile.ts` are placeholders** — the email, LinkedIn URL and `/public/resume.pdf` all need real values before launch. `resume.pdf` does not exist yet, so that button currently 404s.
- Case studies 03–05 and every `Block` body are unwritten by design; they render as bars.
- No analytics.
