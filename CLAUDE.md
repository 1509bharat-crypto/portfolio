@AGENTS.md

# Portfolio

Personal portfolio for Bharat Bharat. Next.js 16 (App Router) · React 19 · TypeScript.

## Commands

```bash
npm run dev      # dev server, Turbopack (default in Next 16)
npm run build    # must pass before committing — it typechecks and prerenders every route
npm start        # serve the production build
npm run lint
npm run design   # contrast and overflow, headless, against a running server
```

## The one rule

**Content lives in `src/data/`, never in a component.** `cases.ts` and `profile.ts` are the two that
are wired up. The work tiles on the cover, every project page, `generateStaticParams`, the OG images
and the sitemap all derive from them. If a change requires editing a component to add content, the
data model is wrong — fix the data model instead.

Order in `cases.ts` is priority. The cover's four tiles come from the `FEATURED` list in
`src/app/(pixel)/page.tsx`; promoting a project means changing that list or moving its entry up.

## `src/pixel/` is vendored, not authored

This is the thing to understand before touching anything.

`/` is Bharat's own pixel-portrait page. He wrote it as one self-contained file —
`Pixel portrait landing page.html` at the repo root — and it is the source of truth. `src/pixel/` is
that file sliced up **verbatim** by `scripts/extract-pixel.mjs`: `pixel.css`, `scripts/01-intro.js …
06-scenes.js`, and `body.html` with a marker where each script stood.

**Never hand-edit anything under `src/pixel/`.** Fix the extractor and re-slice. One hand edit and
the directory stops being the source file and becomes a copy of it, and the next re-slice silently
reverts you.

Every intentional difference from the source lives in one place: the `EDITS` map in the extractor,
each with a comment saying why. Today that is four changes — scenes leave all at once instead of
staggering out, the portrait no longer dissolves on the way out, sound waits for the Enter button
rather than any click, and there is a beat of empty paper between scenes. `applyEdits` throws if an
edit's target string is missing, so a change to the source file fails the extract loudly instead of
quietly dropping a fix.

`(pixel)/page.tsx` re-emits all of it through a single `dangerouslySetInnerHTML`. The six scripts
coordinate through window globals (`__PAT`, `__blip`, `__s1`, `__go`, `__introDone`, `__splashDone`)
and rewrite the DOM *while the document parses* — splitting copy into per-word spans, prepending an
`<i>` to every scattered word, removing the intro and loader. As React components, hydration would
see every one of those as a mismatch and undo them. So: do not convert it to components, hooks,
`next/font`, `next/image` or Next's metadata icon handling, and do not restyle it. The
`suppressHydrationWarning` on the wrapper is load-bearing for the same reason — that subtree is not
React's to own.

Only two things on the page are generated: the four work tiles, from `cases.ts`, and the LinkedIn,
CV and email links, from `profile.ts`. Everything else is byte-identical to the source.

Two React components sit *over* the page and never touch it. Both read `document.body`'s class,
which `06-scenes.js` maintains, and both are in `src/components/`:

- **`PixelNav`** — the "Menu" button and its panel. On the cover it calls `window.__go(n)`; on a
  project page the same entries are links back to `/`.
- **`SceneLabel`** — names the scene you are on, positioned by measuring that scene's container.

## The project page

`/work/[slug]` is an editorial page, built from layouts Bharat referenced: a campaign timeline, two
Japanese editorial sites, a newspaper spread, a study poster. What they share is a **spine with
entries hung alternately off it**, small labels rather than big numerals, and far more empty paper
than content.

So: a title and its standfirst as two columns, then the decisions down a centre spine — square
markers on the line, a tick out to each one, `01`–`05` set small beside it — then figures, then the
stack and year in the corners over a rule. No challenge/approach/outcome scaffold and no process
walkthrough: the page shows *what was chosen* and leaves the reasoning to Bharat's own write-ups.

Two earlier versions of this got rejected for the same reason — they used a layout the references
do not have (a 64px headline on a page whose cover has no display type; four equal columns read left
to right). If you are changing this page, the references are the brief.

## Design rules

The cover sets them and the project pages follow.

1. **Nothing fades.** The cover is pixel art running at 8fps on a 125ms grid; every element is hard
   on or hard off, and there is not one `transition` in `pixel.css`. Anything added over it cuts in
   and out the same way. A 320ms fade on the scene label was immediately obvious as belonging to a
   different site.
2. **Timing is a multiple of 125ms.** Staggers step at 125ms, the beat between scenes is three of
   them. If you need a delay, pick one off that grid.
3. **Arriving is worth animating; leaving is not.** Scenes stagger in and cut out whole. Watching
   twenty words leave one at a time is just waiting.
4. **The page's own vocabulary.** Squares, not circles. Hairlines. Letterspaced uppercase for
   labels. Archivo at 400/500 and nothing else — no second family, no display sizes.
5. **One accent per thing, from the cover's palette.** The tile colours and `PixelNav`'s row colours
   come from the same eight hues the source file uses.
6. **AA everywhere.** `npm run design` checks contrast and horizontal overflow on every route, at
   five desktop and three narrow widths, in both colour schemes.
7. **Mobile may scroll**, and the spine moves to the left edge rather than staying centred. It is
   not a squeezed desktop.

## Gotchas

- **`params` is a Promise** (Next 16 removed sync access). `const { slug } = await params`.
- **`case.css` resets elements with `:where()`, and must keep doing so.** Written as `.cs p, .cs h1,
  .cs ol` the reset scored 0,1,1 and beat every single-class rule under it, so `margin: 0` silently
  won over each `.cs__*` margin and the whole page collapsed to one rhythm. `:where()` contributes
  no specificity, so the classes decide.
- **The spine's markers are drawn by the stops, not the list.** A border on the list only rules the
  first row, so any count that did not fill it left the last entry on a stub.
- **Unwritten copy is intentional.** A decision with no `body` renders as its title alone. Do not
  invent case study prose to fill it.
- **OG images are rendered by Satori, not a browser.** It supports a CSS subset: flex only, and any
  element with more than one child needs an explicit `display`. JSX counts each text fragment as a
  child, so `{a}, {b}` is three children — interpolate once instead.
- **`SceneLabel` measures at reveal time, not at transition time.** A scene is empty until its own
  contents start arriving, so measuring when the body class changes reads a zero-height box. It
  watches the scene's subtree and shows once that has been quiet for longer than one 125ms step —
  which is also why it does not restate any of the script's timings.
- **`next dev` rewrites the `AGENTS.md` block** at the top of this file's import. Commit that churn
  with your work rather than reverting it.

## Conventions

- Every interactive tile is a real `<button>` or `<a>` with a label — the design is dense and
  unlabelled marks read as nothing to a screen reader.
- Respect `prefers-reduced-motion`. The source file already does: `reduce` drops every stagger to
  zero delay. Anything new must too.
- The repo has **no Prettier config** and is not Prettier-formatted. Running `prettier --write` on a
  file reformats it to defaults (double quotes) and produces a large unrelated diff. Match the
  surrounding style by hand.

## Routes

`/` (the cover), `/work/[slug]`, and a 404. All prerendered. `sitemap.ts`, `robots.ts` and the
site-wide `opengraph-image.tsx` sit at the `src/app/` root, above the one route group.

## Dead code from the deck

Home used to be a horizontal deck of cards, at its own root layout with Tailwind and Motion. It was
deleted. What is left behind, unreachable from any route:

- `src/components/` — Backdrop, BentoCard, CaseDetail, Cursor, DotField, FogField, HelloCard,
  HorizontalDeck, Identity, LabGrid, LabView, Primitives, RotatingWord, SoundToggle, StoryDetail,
  ThemeToggle. Only `PixelNav` and `SceneLabel` are live.
- `src/data/` — `intro.ts`, `lab.ts`, `story.ts`. Kept deliberately: `/story` and `/lab` can come
  back in this style without retyping anything.
- `tailwindcss`, `@tailwindcss/postcss`, `motion`, `@material-symbols/svg-600` and `@svgr/webpack`
  in `package.json`, and the SVGR loader rule in `next.config.ts` — used only by the orphans above.

Deleting all of it is safe and has not been done yet because the content in the data files is worth
keeping. If you delete the components, take the dependencies with them.

## Not yet done

- Contact links in `src/data/profile.ts` are real: the email, the LinkedIn profile, a Google Drive
  CV. There is no `/public/resume.pdf` and nothing points at one.
- The cover's "More projects" scene has twenty tiles and none of them link anywhere.
- Five project pages are reachable only by URL — the cover's four tiles and the menu are the only
  links into `/work/`.
- Several decisions in `cases.ts` have titles but no body, and render as titles alone by design.
- No analytics.
