/**
 * Design rule checker.
 *
 * The rules in CLAUDE.md ("Design rules") are only real if something enforces
 * them. This drives headless Chrome over the built site and fails the run when
 * a rule is broken.
 *
 * Keep this file in step with the rules it checks. When home moved from the
 * bento to the horizontal deck, rule 1 was rewritten but this was not, and the
 * run reported forty failures for behaviour that had become the design — which
 * is how a checker stops being run at all. The even-inset assertion was
 * dropped at the same time: it keyed off `.frame`, which the deck does not
 * have, so it had silently degraded to a no-op.
 *
 *   npm run design              # against http://localhost:3000
 *   BASE=http://localhost:4321 npm run design
 *
 * Requires Google Chrome and a running server.
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME =
  process.env.CHROME ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE ?? 'http://localhost:3000';
const PORT = 9455;

/** Every route that must obey the rules. */
const ROUTES = ['/', '/work/lisa-mona', '/story', '/lab', '/lab/de-wacht', '/nope'];

/** Rule 3 — word budgets. Home carries the pitch, so it gets more room. */
const WORD_BUDGET = { '/': 160, default: 120 };
const BLOCK_BUDGET = 25;

/** Widths the rules are checked at. */
const DESKTOP = [1280, 1440, 1728, 1920, 2560];
const NARROW = [390, 768, 1024];

const failures = [];
const fail = (route, rule, detail) => failures.push({ route, rule, detail });

const chrome = spawn(
  CHROME,
  ['--headless', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
   `--remote-debugging-port=${PORT}`, '--user-data-dir=/tmp/cdp-design-check', 'about:blank'],
  { stdio: 'ignore' },
);

let target;
for (let i = 0; i < 60 && !target; i++) {
  try {
    target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json())
      .find((t) => t.type === 'page');
  } catch {}
  if (!target) await sleep(250);
}
if (!target) {
  console.error('Could not start Chrome.');
  process.exit(2);
}

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
};
const send = (method, params = {}) => {
  const i = ++id;
  ws.send(JSON.stringify({ id: i, method, params }));
  return new Promise((r) => pending.set(i, r));
};
const evaluate = async (expression) =>
  (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }))
    .result?.result?.value;
const device = (w, h, mobile = false) =>
  send('Emulation.setDeviceMetricsOverride', {
    width: w, height: h, deviceScaleFactor: 1, mobile, screenWidth: w, screenHeight: h,
  });
const scheme = (v) =>
  send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: v }] });
const goto = async (path) => {
  await send('Page.navigate', { url: BASE + path });
  await sleep(1100);
};

await send('Page.enable');
await send('Runtime.enable');

const PROBE = `(() => {
  const words = (t) => (t || '').trim().split(/\\s+/).filter(Boolean).length;
  const scrollers = [...document.querySelectorAll('*')].filter((el) => {
    const cs = getComputedStyle(el);
    return el.scrollHeight > el.clientHeight + 2 && /auto|scroll/.test(cs.overflowY);
  }).map((el) => String(el.className || el.tagName).split(' ')[0] + ' +' + (el.scrollHeight - el.clientHeight) + 'px');

  let longest = { words: 0, text: '' };
  for (const el of document.querySelectorAll('p, .storyline, .lisa-sub, .claim, .idstory')) {
    const w = words(el.textContent);
    if (w > longest.words) longest = { words: w, text: el.textContent.trim().slice(0, 60) };
  }

  // Contrast of every text style against its painted background.
  const lum = (c) => {
    const p = c.match(/[\\d.]+/g).slice(0, 3).map(Number).map((v) => {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  // Backgrounds can be translucent (a selected map item is an accent tint over
  // the card). Reading the tint's own RGB would score it as solid blue, so
  // composite each layer over the one behind it.
  const parse = (c) => { const p = c.match(/[\\d.]+/g).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const bgOf = (el) => {
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (!c || /rgba?\\(0, 0, 0, 0\\)/.test(c)) continue;
      const p = parse(c);
      if (p.a <= 0) continue;
      layers.push(p);
      if (p.a >= 1) break;
    }
    let out = { r: 255, g: 255, b: 255 };
    for (let i = layers.length - 1; i >= 0; i--) {
      const l = layers[i];
      out = {
        r: l.r * l.a + out.r * (1 - l.a),
        g: l.g * l.a + out.g * (1 - l.a),
        b: l.b * l.a + out.b * (1 - l.a),
      };
    }
    return 'rgb(' + out.r + ',' + out.g + ',' + out.b + ')';
  };
  const bad = [];
  for (const el of document.querySelectorAll('p, span, a, b, h1, h2, h3, button, li, div')) {
    if (!el.childNodes.length) continue;
    const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!direct) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.6) continue;
    const size = parseFloat(cs.fontSize);
    const need = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700) ? 3 : 4.5;
    const r = ratio(cs.color, bgOf(el));
    if (r < need) bad.push(String(el.className || el.tagName).split(' ')[0] + ' ' + r.toFixed(2) + ':1 @' + size + 'px');
  }

  // Rule 1 is about one card being in focus, not about the absence of scroll:
  // the deck's whole mechanism is vertical scroll driving horizontal travel.
  const snapContainer = [...document.querySelectorAll('html, body, .hdeck, .hdeck__track')]
    .map((el) => getComputedStyle(el).scrollSnapType)
    .find((t) => t && t !== 'none') ?? 'none';
  const snapStops = [...document.querySelectorAll('*')]
    .filter((el) => { const a = getComputedStyle(el).scrollSnapAlign; return a && a !== 'none'; }).length;

  const vw = window.innerWidth;
  return JSON.stringify({
    // "Words on screen" means what a reader sees at once. On the deck that is
    // one card, not all seven, so the budget applies to the heaviest single
    // card; everywhere else the page is the view. Screen-reader-only text is
    // excluded either way — innerText includes it, since it is clipped rather
    // than hidden.
    totalWords: (() => {
      const srOnly = (root) =>
        [...root.querySelectorAll('.sr-only')]
          .reduce((n, el) => n + words(el.textContent), 0);
      const cards = [...document.querySelectorAll('.hcard')];
      if (cards.length) {
        return Math.max(
          ...cards.map((c) => words(c.innerText) - srOnly(c)),
        );
      }
      return words(document.body.innerText) - srOnly(document);
    })(),
    overflowX: document.documentElement.scrollWidth - vw,
    internalScrollers: scrollers,
    longest,
    contrast: [...new Set(bad)].slice(0, 8),
    deck: { cards: document.querySelectorAll('.hcard').length, snapStops, snapContainer },
  });
})()`;

for (const mode of ['light', 'dark']) {
  await scheme(mode);

  for (const width of DESKTOP) {
    await device(width, 900);
    for (const route of ROUTES) {
      await goto(route);
      const r = JSON.parse(await evaluate(PROBE));
      const tag = `${route} @${width} ${mode}`;

      // Rule 1 — one card in focus. The deck is scroll-driven by design, so
      // there is no assertion about scroll height; what has to hold is that
      // every card is a snap stop, so exactly one can ever be centred. Detail
      // views are editorial pages and scroll freely.
      if (route === '/') {
        if (!r.deck.cards) fail(tag, 'one-card-in-focus', 'deck rendered no cards');
        if (!/mandatory/.test(r.deck.snapContainer)) {
          fail(tag, 'one-card-in-focus', `snap is "${r.deck.snapContainer}", expected mandatory`);
        }
        if (r.deck.cards !== r.deck.snapStops) {
          fail(tag, 'one-card-in-focus', `${r.deck.cards} cards but ${r.deck.snapStops} snap stops`);
        }
      }

      // Rule 3 — word budgets.
      const budget = WORD_BUDGET[route] ?? WORD_BUDGET.default;
      if (r.totalWords > budget) fail(tag, 'word-budget', `${r.totalWords} words > ${budget}`);
      if (r.longest.words > BLOCK_BUDGET) fail(tag, 'block-budget', `${r.longest.words}w "${r.longest.text}"`);

      // Rule 7 — contrast.
      if (r.contrast.length) fail(tag, 'contrast-AA', r.contrast.join(', '));

      // Standing invariants. The deck translates its track rather than
      // overflowing the document, so this still has to hold at every width.
      if (r.overflowX > 0) fail(tag, 'no-h-overflow', `${r.overflowX}px`);
    }
  }

  // Narrow widths may scroll (rule 2) but must never overflow sideways.
  for (const width of NARROW) {
    await device(width, 900, width < 500);
    for (const route of ROUTES) {
      await goto(route);
      const r = JSON.parse(await evaluate(PROBE));
      const tag = `${route} @${width} ${mode}`;
      if (r.overflowX > 0) fail(tag, 'no-h-overflow', `${r.overflowX}px`);
      if (r.contrast.length) fail(tag, 'contrast-AA', r.contrast.join(', '));
    }
  }
}

ws.close();
chrome.kill();

const checks = ROUTES.length * (DESKTOP.length + NARROW.length) * 2;
if (failures.length === 0) {
  console.log(`\n  Design rules: PASS  (${checks} route/width/theme combinations)\n`);
  process.exit(0);
}
console.log(`\n  Design rules: ${failures.length} violation(s)\n`);
for (const f of failures) console.log(`  ✗ [${f.rule}] ${f.route}\n      ${f.detail}`);
console.log('');
process.exit(1);
