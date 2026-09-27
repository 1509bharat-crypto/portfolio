#!/usr/bin/env node
/**
 * Slices `Pixel portrait landing page.html` into `src/pixel/`.
 *
 * Bharat's requirement for that page is that it stay exactly as he made it,
 * so nothing under `src/pixel/` is ever written by hand: it is cut out of the
 * source file by this script and left byte-for-byte unchanged. If something
 * in there is wrong, fix it here and re-run:
 *
 *     node scripts/extract-pixel.mjs
 *
 * What comes out:
 *   pixel.css                 the single <style> block
 *   scripts/01-…-06-….js      the six inline scripts, in document order
 *   body.html                 the body markup, with markers where each script
 *                             stood, where the four work tiles stood, and
 *                             where the three link hrefs stood
 *   head.json                 the favicon and font <link>s
 *   work-tile.original.html   the original tiles, kept only to diff against
 *
 * `src/app/(pixel)/page.tsx` fills those markers — the tiles from `cases.ts`,
 * the links from `profile.ts` — and emits everything else untouched.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'Pixel portrait landing page.html');
const OUT = path.join(ROOT, 'src/pixel');

const html = readFileSync(SRC, 'utf8');
mkdirSync(path.join(OUT, 'scripts'), { recursive: true });

// 1. The stylesheet.
const css = html.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/^\n/, '');
writeFileSync(path.join(OUT, 'pixel.css'), css);

// 2. Head bits the layout has to reproduce.
//
// The favicon's href is an inline SVG data URI, so it contains `>` of its
// own. Matching with [^>]* truncates it at the first one and silently leaves
// a blank 15x15 box; this alternation steps over quoted values instead.
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
const favicon = head.match(/<link rel="icon"(?:[^>"]|"[^"]*")*>/)[0];
const fontHref = head.match(
  /<link href="(https:\/\/fonts\.googleapis\.com[^"]*)"/,
)[1];
writeFileSync(
  path.join(OUT, 'head.json'),
  JSON.stringify({ favicon, fontHref }, null, 1) + '\n',
);

// 3. The six scripts, each to its own file, each leaving a marker behind so
//    it can be put back exactly where it was.
/**
 * Every difference between src/pixel/scripts and the source file, in one
 * place. Each is an exact substring swap, asserted below, so a change to the
 * source that moves the code fails the extract loudly rather than silently
 * dropping the edit.
 *
 * Keyed to exact strings rather than regexes over `*125`, because the same
 * arithmetic drives the entry cascades and half the animation loops.
 */
const EDITS = {
  intro: [
    // Leave all at once. Arriving staggered reads as something assembling;
    // leaving staggered just makes you wait through it.
    [
      "g.forEach(w=>w.classList.remove('on'));B()},(n+1)*125));setTimeout(done,(r.length+2)*125)",
      "g.forEach(w=>w.classList.remove('on'));B()},0));setTimeout(done,125)",
    ],
  ],
  portrait: [
    // The about copy, leaving scene one.
    [
      "if(n===r.length-1&&done)done()},n*125))}",
      "if(n===r.length-1&&done)done()},0))}",
    ],
    // The portrait goes at once, and only fades in.
    //
    // It dissolved out over 1500ms on the way to every other scene, which is
    // 1500ms of watching a face disappear before anything else can begin.
    // Arriving is the part worth animating; leaving is not. `show` keeps its
    // 2000ms fade untouched.
    [
      "hideLines(fin);if(reduce){cutNow=0;fin()}else animCut(0,1500,fin)},",
      "hideLines(fin);cutNow=0;fin()},",
    ],
  ],
  trail: [
    // Sound starts on Enter, not on any click.
    //
    // This listener unlocked the audio context on any pointerdown anywhere,
    // so with sound previously switched on, blips began while the welcome
    // letter was still being read. The Enter button calls __audioUnlock()
    // itself, so gating this on the intro being finished loses nothing: it
    // still resumes a context the browser suspends later.
    [
      "addEventListener('pointerdown',()=>{if(!muted){unlock();if(ac&&ac.state==='suspended')ac.resume()}},{passive:true});",
      "addEventListener('pointerdown',()=>{if(!muted&&window.__introDone){unlock();if(ac&&ac.state==='suspended')ac.resume()}},{passive:true});",
    ],
  ],
  scenes: [
    // hideWords
    [
      "if(n===r.length-1&&done)done()},reduce?0:n*125))};",
      "if(n===r.length-1&&done)done()},0))};",
    ],
    // hideTL
    [
      "document.body.classList.remove('s3');done&&done()}},reduce?0:(n+1)*125))};",
      "document.body.classList.remove('s3');done&&done()}},0))};",
    ],
    // hideWork, both its tiles and its intro lines
    [
      "b.classList.remove('on');B();tick()},reduce?0:n*125));rg.forEach((g,n)=>setTimeout(()=>{g.forEach(w=>w.classList.remove('on'));B();tick()},reduce?0:(r.length+n)*125))};",
      "b.classList.remove('on');B();tick()},0));rg.forEach((g,n)=>setTimeout(()=>{g.forEach(w=>w.classList.remove('on'));B();tick()},0))};",
    ],
    // hideMore
    [
      "document.body.classList.remove('s5');done&&done()}},reduce?0:n*125))};",
      "document.body.classList.remove('s5');done&&done()}},0))};",
    ],
    // A beat of empty paper between one scene and the next.
    //
    // Nothing on this page has a CSS transition — every element is hard on or
    // hard off — so with `show` called straight out of `hide`'s callback the
    // incoming scene began on the same frame the outgoing one vanished, and
    // the two read as one overlapping move. Three of the page's own 125ms
    // beats of nothing separate them.
    //
    // `sceneout` fires as the transition starts, so anything drawn over the
    // page (the scene label) can leave with the content rather than hang over
    // the empty beat.
    [
      'busy=true;S[scene].hide(()=>S[to].show(()=>{scene=to;setDir(scene===S.length-1?-1:1);busy=false}))};',
      "busy=true;dispatchEvent(new Event('sceneout'));S[scene].hide(()=>setTimeout(()=>S[to].show(()=>{scene=to;setDir(scene===S.length-1?-1:1);busy=false}),reduce?0:375))};",
    ],
  ],
};

function applyEdits(name, js) {
  for (const [from, to] of EDITS[name] ?? []) {
    if (!js.includes(from)) {
      throw new Error(
        `${name}: edit target not found, has the source changed?\n  ${from.slice(0, 70)}…`,
      );
    }
    js = js.replace(from, to);
  }
  return js;
}

const names = ['intro', 'loader', 'portrait', 'trail', 'mark', 'scenes'];
let body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
let n = 0;
body = body.replace(/<script>([\s\S]*?)<\/script>/g, (_, js) => {
  const file = `${String(n + 1).padStart(2, '0')}-${names[n]}.js`;
  let body = js.replace(/^\n/, '');
  // The scenes script keeps `go(n)` private, so nothing outside it can move
  // between scenes. The menu needs to. This publishes the existing function
  // and changes no behaviour — it is the one line in src/pixel/ that is not
  // verbatim, and it is added here rather than by hand so re-running still
  // reproduces the directory exactly.
  body = applyEdits(names[n], body);

  if (names[n] === 'scenes') {
    const close = body.lastIndexOf('})();');
    if (close < 0) throw new Error('scenes script: no closing IIFE to hook');
    body =
      body.slice(0, close) +
      'window.__go=go;\n' +
      body.slice(close);
  }
  writeFileSync(path.join(OUT, 'scripts', file), body);
  n++;
  return `<!--script:${file}-->`;
});
if (n !== names.length) {
  throw new Error(`expected ${names.length} scripts, found ${n}`);
}

// 4. The work tiles and the three hrefs become markers. Everything else in
//    the body stays byte-identical.
const grid = body.match(/<ul class="wk-grid">([\s\S]*?)<\/ul>/);
writeFileSync(path.join(OUT, 'work-tile.original.html'), grid[1]);
body = body
  .replace(grid[0], '<ul class="wk-grid"><!--work-tiles--></ul>')
  .replace('href="#linkedin"', 'href="<!--href:linkedin-->"')
  .replace('href="#cv"', 'href="<!--href:cv-->"')
  .replace(
    'href="mailto:1509bharat@gmail.com"',
    'href="<!--href:email-->"',
  );
writeFileSync(path.join(OUT, 'body.html'), body);

console.log(`pixel.css   ${css.length} bytes`);
console.log(`scripts     ${n} (${names.join(', ')})`);
console.log(`body.html   ${body.length} bytes`);
console.log(`favicon     ${favicon.length} chars`);
console.log(`font        ${fontHref}`);
