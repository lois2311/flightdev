import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Ratchet against generic "AI slop" patterns. Budgets may only go DOWN: when a count drops, lower its
// budget in the same commit. Raising one needs a stated reason in the PR.
// ponytail: regex counts over source text, not a real AST lint; good enough to stop regressions.
const BUDGET: Record<string, { re: RegExp; max: number }> = {
  'two-tone heading (accent span inside a title)': { re: /<span className="text-(cielo|cielo-claro|voltaje)">/g, max: 1 }, // FleetTrack Pro wordmark
  'cursor-following spotlight': { re: /Spotlight/g, max: 0 },
  'decorative pulse dot': { re: /fdPulse|animate-pulse/g, max: 0 },
  'auto-scrolling marquee': { re: /marquee/g, max: 0 },
  'gradient text': { re: /bg-clip-text|text-transparent/g, max: 0 },
  'scroll reveal': { re: /data-reveal/g, max: 0 },
  'arrow glyph in links': { re: /→/g, max: 0 },
  'em dash': { re: /—/g, max: 0 },
  '"no es X, es Y" contrast': { re: /no es [^.<]{1,40}, es |, no [a-záéíóúñ ]{3,30}\.|no (solo|sólo) /gi, max: 2 }, // legal terms + one real buying tip
  '"a la medida" filler': { re: /a la medida/gi, max: 12 }, // Colombian search keyword: SEO metadata, blog and service content only
  'three equal columns': { re: /(?:md|lg):grid-cols-3\b/g, max: 1 }, // FleetSchema: literally three actors
  'magnetic / tilt / shine pointer effects': { re: /data-(magnet|tilt|shine)/g, max: 0 },
  'masked headline reveal': { re: /MaskLines|data-mask/g, max: 0 },
};

const SRC = join(process.cwd(), 'src');
const files = (readdirSync(SRC, { recursive: true }) as string[])
  .filter(f => /\.(tsx?|css)$/.test(f) && !/\.test\.ts$/.test(f))
  // Comments are for developers; the ratchet polices what visitors see and what the markup does.
  .map(f => ({ f, text: readFileSync(join(SRC, f), 'utf8').replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '') }));

describe('AI-slop ratchet', () => {
  for (const [name, { re, max }] of Object.entries(BUDGET)) {
    it(`${name} stays within budget (${max})`, () => {
      const hits = files.flatMap(({ f, text }) => (text.match(re) ?? []).map(() => f));
      expect(hits.length, `found in: ${[...new Set(hits)].join(', ')}`).toBeLessThanOrEqual(max);
    });
  }
});
