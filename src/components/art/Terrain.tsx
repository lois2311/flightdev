import type { CSSProperties } from 'react';

/**
 * "Relieve": the site's generated art. A ridgeline of the Andes drawn as stacked contour strokes.
 * Deterministic (seeded) and rendered on the server: same seed, same mountains, no client JS.
 */

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1000, STEP = 16;

function build(seed: number, lines: number, h: number) {
  const r = rng(seed);
  const peaks = Array.from({ length: 6 }, () => ({ c: r() * W, w: 70 + r() * 180, a: 0.35 + r() * 0.65 }));
  const waves = Array.from({ length: 3 }, () => ({ f: 0.004 + r() * 0.02, p: r() * 6.28, a: 3 + r() * 6 }));
  const ridge = (x: number) => peaks.reduce((s, k) => s + k.a * Math.exp(-(((x - k.c) / k.w) ** 2)), 0);
  const rows: number[][] = [];
  for (let i = 0; i < lines; i++) {
    const t = i / Math.max(1, lines - 1);
    const base = h * (0.4 + t * 0.56), amp = h * (0.13 + 0.12 * t), drift = (r() - 0.5) * 90, scale = 0.75 + r() * 0.4;
    const row: number[] = [];
    for (let x = -STEP; x <= W + STEP; x += STEP) {
      const n = waves.reduce((s, w) => s + w.a * Math.sin(x * w.f + w.p + i * 0.7), 0) * (0.4 + t);
      row.push(Math.max(2, base - amp * scale * ridge(x + drift) - n));
    }
    rows.push(row);
  }
  return rows;
}

const toD = (row: number[], h: number) =>
  'M' + row.map((y, j) => `${j * STEP - STEP} ${Math.round(y)}`).join('L') + `L${W + STEP} ${h + 40}L${-STEP} ${h + 40}Z`;

/** The caller positions it (absolute or relative) and sizes it; the SVG stretches to fill. */
export default function Terrain({ seed = 7, lines = 16, height = 320, fill = '#0A1428', stroke = '#2F8CFF', className = '', label }: {
  seed?: number; lines?: number; height?: number; fill?: string; stroke?: string; className?: string;
  /** Visible caption in the corner, e.g. coordinates. Decorative art stays aria-hidden. */
  label?: string;
}) {
  const rows = build(seed, lines, height);
  return (
    <div aria-hidden="true" data-draw="ready" className={`pointer-events-none ${className}`}>
      <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="absolute inset-0 size-full">
        {rows.map((row, i) => (
          <path key={i} d={toD(row, height)} fill={fill} stroke={stroke} strokeWidth="1.1" strokeOpacity={(0.12 + 0.58 * (i / lines) ** 1.4).toFixed(3)}
            pathLength={1} strokeDasharray="1" className="terrain-line" style={{ '--i': i } as CSSProperties} />
        ))}
      </svg>
      {label && <span className="absolute bottom-3 right-4 font-mono text-[10px] tracking-[.14em] text-muted">{label}</span>}
    </div>
  );
}
