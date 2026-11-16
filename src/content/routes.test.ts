import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { STATIC_ROUTES } from './routes';
import { POSTS } from './posts';

const APP = join(process.cwd(), 'src', 'app');

function pageFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return pageFiles(full);
    return name === 'page.tsx' ? [full] : [];
  });
}

const routeOf = (file: string) => '/' + relative(APP, file).split(sep).slice(0, -1).join('/');
const pages = pageFiles(APP).map(f => ({ file: f, route: routeOf(f).replace(/^\/$/, '/') }));
const staticPages = pages.filter(p => !p.route.includes('['));

describe('site map and pages', () => {
  it('lists every static page in the sitemap and nothing that does not exist', () => {
    expect(staticPages.map(p => (p.route === '/' ? '/' : p.route)).sort()).toEqual(STATIC_ROUTES.map(r => r.path).sort());
  });

  it('gives every static page its own metadata with a canonical path matching its route', () => {
    for (const p of staticPages) {
      const meta = readFileSync(p.file, 'utf8').match(/pageMetadata\(\{[\s\S]*?\}\)/)?.[0] ?? '';
      // Product and service pages take their path from content/*; the rest declare it inline.
      const declared = meta.match(/path: '([^']+)'/)?.[1] ?? meta.match(/path: (\w+)\.path/)?.[1];
      expect(declared, p.route).toBeTruthy();
      if (declared?.startsWith('/')) expect(declared, p.file).toBe(p.route);
    }
  });

  it('has exactly one h1 per page source (directly or through PageHero/LegalPage)', () => {
    for (const p of staticPages) {
      const src = readFileSync(p.file, 'utf8');
      const h1s = (src.match(/<h1[\s>]/g) ?? []).length + (src.match(/<(PageHero|LegalPage|HeroSection|ServicePage)[\s/>]/g) ?? []).length;
      expect(h1s, p.route).toBe(1);
    }
  });

  it('uses unique blog slugs and titles', () => {
    expect(new Set(POSTS.map(p => p.slug)).size).toBe(POSTS.length);
    expect(new Set(POSTS.map(p => p.title)).size).toBe(POSTS.length);
  });
});
