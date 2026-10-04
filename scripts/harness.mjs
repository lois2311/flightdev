// Harness: sweeps the page like a user scrolling and records the guide plane + screenshots.
//   npm run build && node scripts/harness.mjs [--w=1280 --h=800] [--shots]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const arg = (k, d) => (process.argv.find(a => a.startsWith(`--${k}=`))?.split('=')[1] ?? d);
const W = +arg('w', 1280), H = +arg('h', 800), STEP = +arg('step', 30), PORT = 4179;
const out = 'harness/out'; mkdirSync(out, { recursive: true });

const srv = spawn('npx', ['vite', 'preview', '--port', PORT, '--strictPort'], { shell: true, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 2500));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, locale: 'es-CO' });
const errors = [];
page.on('pageerror', e => errors.push(e.message)); page.on('console', m => m.type() === 'error' && errors.push(m.text()));
await page.goto(`http://localhost:${PORT}/`); await page.waitForTimeout(2500);

const read = () => page.evaluate(() => {
  const p = document.querySelector('[data-plane-pos]'), f = document.querySelector('[data-plane-fly]');
  const r = p.getBoundingClientRect();
  return { sy: Math.round(scrollY), x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2),
    s: +(+gsap_get(f, 'scale')).toFixed(2), rot: Math.round(gsap_get(f, 'rotation')) };
  function gsap_get(el, k) { const m = new DOMMatrix(getComputedStyle(el).transform); return k === 'scale' ? Math.hypot(m.a, m.b) : Math.atan2(m.b, m.a) * 180 / Math.PI; }
});

const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const rows = [];
for (let y = 0; y <= max; y += STEP) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(45); rows.push(await read()); }
// worst per-sample jump = jerk detector (one sample ≈ STEP px of scroll)
let worst = { d: 0 };
rows.forEach((r, i) => { if (i) { const d = Math.hypot(r.x - rows[i - 1].x, r.y - rows[i - 1].y); if (d > worst.d) worst = { d: Math.round(d), at: r.sy }; } });
writeFileSync(`${out}/path-${W}.json`, JSON.stringify(rows));
console.log(`path ${W}x${H}: ${rows.length} samples, max scroll ${max}, worst jump ${worst.d}px @scroll ${worst.at}`);
console.log('errors:', errors.length ? errors : 'none');

if (process.argv.includes('--shots')) {
  await page.reload(); await page.waitForTimeout(2500);
  const marks = { hero: 0, vendra: '[data-fly=vendra-panel]', proceso: '[data-node]', consola: '[data-sys]', pie: 1e6 };
  for (const [name, t] of Object.entries(marks)) {
    const y = typeof t === 'number' ? t : await page.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return r.top + scrollY - innerHeight * 0.3; }, t);
    await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(2200);
    await page.screenshot({ path: `${out}/${W}-${name}.png` });
  }
}
await browser.close(); srv.kill(); process.exit(0);
