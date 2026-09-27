import { readFileSync } from 'node:fs';
import path from 'node:path';
import { cases } from '@/data/cases';
import { profile } from '@/data/profile';
import { SceneLabel } from '@/components/SceneLabel';

/**
 * The pixel portrait cover, served as the home page.
 *
 * This is deliberately not a tree of React components. The source page is six
 * inline scripts that coordinate through window globals and custom events,
 * and that rewrite the DOM as they run — splitting copy into per-word spans,
 * prepending a pixel to every scattered word, removing the intro once it has
 * been read. React hydration would treat every one of those as a mismatch and
 * undo it. So the markup, the stylesheet and all six scripts are sliced out of
 * the source file by `extract.mjs`, vendored unchanged under `src/pixel/`, and
 * emitted here as one block of HTML that React is told not to look inside.
 * The scripts land in the initial document in their original positions and
 * run at parse time, exactly as they do in the file.
 *
 * Three things are generated rather than copied, and only these three: the
 * four work tiles, which come from `cases.ts`, and the LinkedIn, CV and email
 * links, which come from `profile.ts`. Everything else is byte-identical.
 */

const ROOT = path.join(process.cwd(), 'src/pixel');
const read = (file: string) => readFileSync(path.join(ROOT, file), 'utf8');

/**
 * The four cases that take the four tiles, in order. The source page had four
 * tiles — Robin Jr., Adecco and Uber, Epiphany RBC (which is LISA), Mona —
 * so this is the same four subjects, in `cases.ts` priority order. Adding a
 * fifth here means a fifth tile, and the grid is designed for four.
 */
const FEATURED = ['lisa', 'robin-jr', 'mona', 'adecco-uber'] as const;

/**
 * Each tile's pattern index and two inks, as designed in the source. These are
 * visual assignments, not data, so they stay with the tile position rather
 * than travelling with the case.
 */
const TILE = [
  { p: 20, a: '#E63312', b: '#F07D1C' },
  { p: 10, a: '#1F4DB7', b: '#2FA8D8' },
  { p: 4, a: '#6B3FA0', b: '#D63A8E' },
  { p: 8, a: '#D63A8E', b: '#F07D1C' },
];

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Same markup as the source's tiles, with the caption and line from data. */
function tiles() {
  return FEATURED.map((slug, i) => {
    const c = cases.find((x) => x.slug === slug);
    if (!c) throw new Error(`pixel cover: no case with slug "${slug}"`);
    const t = TILE[i];
    const caption = c.year ? `${c.title}, ${c.year}` : c.title;
    // Wrapped in an anchor so the work scene is a way into the projects
    // rather than a picture of them. The <li> keeps its class, data
    // attributes and canvas child, which is all `06-scenes.js` looks for.
    return (
      `<li class="wb" data-p="${t.p}" data-a="${t.a}" data-b="${t.b}">` +
      `<a class="wb__a" href="/work/${esc(c.slug)}">` +
      `<canvas width="45" height="30" aria-hidden="true"></canvas>` +
      `<p class="c">${esc(caption)}</p>` +
      `<p class="d">${esc(c.tagline)}</p>` +
      `</a></li>`
    );
  }).join('');
}

const link = (label: string) => {
  const l = profile.links.find((x) => x.label === label);
  if (!l) throw new Error(`pixel cover: profile has no "${label}" link`);
  return esc(l.href);
};

export default function Home() {
  let html = read('body.html');
  // Scripts back into the exact positions they were cut from.
  html = html.replace(
    /<!--script:([\w.-]+)-->/g,
    (_, file: string) => `<script>${read(`scripts/${file}`)}</script>`,
  );
  html = html
    .replace('<!--work-tiles-->', tiles())
    .replace('<!--href:linkedin-->', link('LinkedIn'))
    .replace('<!--href:cv-->', link('Resume'))
    .replace('<!--href:email-->', link('Email'));

  // `display: contents` so the wrapper has no box of its own: the source's
  // elements are children of <body> in every way that matters to their CSS.
  //
  // `suppressHydrationWarning` states the contract rather than hiding a bug:
  // the scripts inside this subtree rewrite it while the document is still
  // parsing — 01-intro.js alone inserts the speaker canvas and splits the copy
  // into per-word spans — so by the time React hydrates, the DOM legitimately
  // no longer matches the `__html` it was given. React never patches a
  // `dangerouslySetInnerHTML` difference, so without this it renders correctly
  // and logs a diff at every dev reload. This subtree is not React's to own.
  return (
    <>
      <div
        style={{ display: 'contents' }}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {/* A sibling of the vendored page, never inside it. */}
      <SceneLabel />
    </>
  );
}
