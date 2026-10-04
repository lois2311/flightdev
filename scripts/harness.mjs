// Harness: screenshots each section the way a visitor reaches it, plus any console/page errors.
//   npm run build && node scripts/harness.mjs [--w=1280 --h=800] [--url=http://… --out=dir] [--reduced]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const arg = (k, d) => (process.argv.find(a => a.startsWith(`--${k}=`))?.split('=').slice(1).join('=') ?? d);
const W = +arg('w', 1280), H = +arg('h', 800), PORT = 4179, out = arg('out', 'harness/out');
mkdirSync(out, { recursive: true });

const srv = arg('url') ? null : spawn('npx', ['vite', 'preview', '--port', PORT, '--strictPort'], { shell: true, stdio: 'ignore' });
if (srv) await new Promise(r => setTimeout(r, 2500));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, locale: 'es-CO', reducedMotion: process.argv.includes('--reduced') ? 'reduce' : 'no-preference' });
const errors = [];
page.on('pageerror', e => errors.push(e.message)); page.on('console', m => m.type() === 'error' && errors.push(m.text()));
await page.goto(arg('url', `http://localhost:${PORT}/`)); await page.waitForTimeout(4000);
await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });

// Scroll in steps so scroll-linked scenes and reveal observers fire as they would for a person.
const glide = async to => { const from = await page.evaluate(() => scrollY); for (let i = 1; i <= 12; i++) { await page.evaluate(v => scrollTo(0, v), from + (to - from) * i / 12); await page.waitForTimeout(60); } };
for (const id of ['top', 'vendra', 'vendra-pos', 'evolution', 'systems', 'brief']) {
  const y = await page.evaluate(id => {
    if (id === 'vendra-pos') { const s = document.querySelector('#vendra'); return s.offsetTop + s.offsetHeight - innerHeight; }
    const el = document.getElementById(id); return id === 'top' ? 0 : id === 'brief' ? 1e6 : el.getBoundingClientRect().top + scrollY - 40;
  }, id);
  await glide(y); await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}/${W}-${id}.png` });
}
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
console.log(`${W}x${H}: horizontal overflow ${overflow}px`);
console.log('errors:', errors.length ? errors : 'none');
await browser.close(); srv?.kill(); process.exit(0);
