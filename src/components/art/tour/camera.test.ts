import { describe, expect, it } from 'vitest';
import { horizonLine, viewProjection, type Vec3 } from '../terrain-gl';
import { contrast, horizonGlow, labelInk, lens, palette } from './camera';
import { nightRange } from './layout';

const steps = Array.from({ length: 101 }, (_, i) => i / 100);

describe('dusk palette', () => {
  it('is day at 0 and the noche ground at 1', () => {
    expect(palette(0).paper.map(v => Math.round(v * 255))).toEqual([246, 248, 251]);
    expect(palette(1).paper.map(v => Math.round(v * 255))).toEqual([10, 20, 40]);
  });

  it('never goes grey: every frame after the first few percent is visibly blue', () => {
    for (const n of steps.filter(n => n >= 0.05)) {
      const [r, , b] = palette(n).paper;
      expect(b - r, `night ${n}`).toBeGreaterThanOrEqual(0.08);
    }
  });

  it('passes through the blue dusk key at 0.5', () => {
    expect(palette(0.5).paper.map(v => Math.round(v * 255))).toEqual([0x1a, 0x2e, 0x52]);
  });

  it('keeps label text readable on every paper colour (worst case at the black/white crossover)', () => {
    for (const n of steps) {
      const paper = palette(n).paper, ink: Vec3 = labelInk(paper);
      expect(contrast(paper, ink), `night ${n}`).toBeGreaterThanOrEqual(4.1);
    }
  });
});

describe('horizon glow', () => {
  it('is off by day, full at dusk and faint at night', () => {
    expect(horizonGlow(0)).toBe(0);
    for (const n of [0.35, 0.5, 0.55]) expect(horizonGlow(n)).toBeGreaterThan(0.95);
    expect(horizonGlow(0.7)).toBeGreaterThan(0.6);
    expect(horizonGlow(1)).toBeCloseTo(0.25);
  });
});

describe('horizonLine', () => {
  it('lands where the lens puts the horizon, level and banked', () => {
    for (const [aspect, horizon] of [[1.6, 0.3], [0.46, 0.35], [1.6, 0.5]]) {
      const { cam, shift } = lens(aspect, horizon, 0.2);
      const vp = viewProjection({ eye: [10, 5, 10], heading: [0.6, 0, 0.8], ...cam, roll: 0 }, aspect, 48, shift), [a, b, c] = horizonLine(vp)!;
      expect(a).toBeCloseTo(0, 5);
      expect(-c / b).toBeCloseTo(1 - 2 * horizon, 4);
      const banked = horizonLine(viewProjection({ eye: [10, 5, 10], heading: [0.6, 0, 0.8], ...cam, roll: 0.09 }, aspect, 48, shift))!;
      expect(Math.abs(banked[0])).toBeGreaterThan(0.01);
      expect(banked[1]).toBeGreaterThan(0);
    }
  });
});

describe('night ramp', () => {
  it('finishes before the first interlude is centred, at 1440x900 and on a phone', () => {
    for (const [vh, dayEnd, top, h] of [[900, 627, 900, 936], [844, 560, 1100, 726]]) {
      const [start, end] = nightRange(dayEnd, vh, { top, bottom: top + h }), centred = top + (h - vh) / 2;
      expect(start).toBeLessThan(end);
      expect(end).toBeLessThanOrEqual(centred);
    }
  });

  it('never collapses when the interlude starts almost right after the copy', () => {
    const [start, end] = nightRange(500, 900, { top: 600, bottom: 1500 });
    expect(end - start).toBeGreaterThanOrEqual(900 * 0.15);
  });
});
