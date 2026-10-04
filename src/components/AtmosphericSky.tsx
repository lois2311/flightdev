import { useLayoutEffect, useMemo, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type LayerId = 'bg' | 'mid' | 'fg';
type Puff = { x: number; y: number; rx: number; ry: number; base?: boolean };
type CloudSpec = { cx: number; cy: number; w: number; h: number; n: number; seed: number };

const TILE = 1600; // layer tile width in viewBox units; drift loops exactly one tile

type LayerDef = {
  id: LayerId;
  opacity: number;
  scale0: number;          // resting scale
  drift: number;           // seconds per loop
  y: number;               // scroll parallax, px (clouds drop as the camera climbs)
  scaleEnd?: number;
  displace: number;        // feDisplacementMap scale — organic edge breakup
  light: [string, number][]; // radial stops: [color, opacity]
  shade: [string, number][];
  clouds: CloudSpec[];
  className?: string;
};

const LAYERS: LayerDef[] = [
  { id: 'bg', opacity: 0.24, scale0: 1.4, drift: 70, y: 30, displace: 0,
    light: [['#DCEBFF', 1], ['#DCEBFF', 0.5], ['#DCEBFF', 0]],
    shade: [['#DCEBFF', 1], ['#DCEBFF', 0.4], ['#DCEBFF', 0]],
    clouds: [
      { cx: 330, cy: 250, w: 760, h: 170, n: 14, seed: 3 },
      { cx: 1010, cy: 520, w: 900, h: 200, n: 16, seed: 11 },
      { cx: 1420, cy: 190, w: 560, h: 140, n: 10, seed: 17 },
      { cx: 420, cy: 760, w: 820, h: 150, n: 12, seed: 23 },
    ] },
  { id: 'mid', opacity: 0.5, scale0: 1, drift: 40, y: 75, displace: 38,
    light: [['#FFFFFF', 1], ['#F6F8FB', 0.75], ['#DCEBFF', 0]],
    shade: [['#7DB8FF', 0.5], ['#DCEBFF', 0.45], ['#DCEBFF', 0]],
    clouds: [
      { cx: 250, cy: 330, w: 420, h: 150, n: 11, seed: 5 },
      { cx: 800, cy: 600, w: 520, h: 190, n: 13, seed: 8 },
      { cx: 1250, cy: 300, w: 380, h: 130, n: 9, seed: 29 },
      { cx: 1450, cy: 760, w: 300, h: 100, n: 8, seed: 31 },
    ] },
  { id: 'fg', opacity: 0.68, scale0: 1, drift: 20, y: 150, scaleEnd: 1.25, displace: 55, className: 'hidden md:block',
    light: [['#FFFFFF', 1], ['#F6F8FB', 0.8], ['#F6F8FB', 0]],
    shade: [['#DCEBFF', 0.85], ['#DCEBFF', 0.4], ['#DCEBFF', 0]],
    clouds: [
      { cx: 380, cy: 860, w: 1050, h: 190, n: 16, seed: 41 },
      { cx: 1230, cy: 800, w: 860, h: 150, n: 13, seed: 47 },
      { cx: 1000, cy: 440, w: 760, h: 80, n: 9, seed: 53 }, // crosses the wing
    ] },
];

function rng(seed: number) {
  let a = seed * 2654435761 >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Billowing top, flat shaded underside: overlapping soft ellipses, never the same cloud twice. */
function buildCloud({ cx, cy, w, h, n, seed }: CloudSpec): Puff[] {
  const r = rng(seed);
  const out: Puff[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.15 + r() * 0.7) / n;
    const env = Math.sin(Math.PI * t) ** 0.8;
    const rx = w * (0.1 + 0.13 * r()) * (0.55 + 0.45 * env);
    const ry = rx * (0.5 + 0.3 * r());
    out.push({ x: cx + (t - 0.5) * w, y: cy - env * h * (0.25 + 0.75 * r()), rx, ry });
  }
  for (let i = 0; i < 4; i++) {
    const t = 0.15 + 0.7 * ((i + r() * 0.5) / 4);
    out.push({ x: cx + (t - 0.5) * w, y: cy + h * 0.04, rx: w * (0.16 + 0.08 * r()), ry: h * (0.16 + 0.06 * r()), base: true });
  }
  return out.sort((a, b) => b.y - a.y); // lowest first, crowns paint over
}

function Tile({ layer, puffs }: { layer: LayerDef; puffs: Puff[][] }) {
  const id = `sky-${layer.id}`;
  return (
    <svg viewBox={`0 0 ${TILE} 900`} preserveAspectRatio="xMidYMid slice" className="block h-full w-1/2 shrink-0 overflow-visible">
      <defs>
        <radialGradient id={`${id}-light`} cx=".5" cy=".5" r=".5" fx=".46" fy=".34">
          {layer.light.map(([c, o], i) => <stop key={i} offset={[0, 0.55, 1][i]} stopColor={c} stopOpacity={o} />)}
        </radialGradient>
        <radialGradient id={`${id}-shade`} cx=".5" cy=".5" r=".5">
          {layer.shade.map(([c, o], i) => <stop key={i} offset={[0, 0.5, 1][i]} stopColor={c} stopOpacity={o} />)}
        </radialGradient>
        {layer.displace > 0 && (
          <filter id={`${id}-wisp`} x="-10%" y="-20%" width="120%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency=".006 .011" numOctaves="3" seed={layer.drift} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={layer.displace} />
          </filter>
        )}
      </defs>
      <g opacity={layer.opacity} filter={layer.displace > 0 ? `url(#${id}-wisp)` : undefined}>
        {/* three copies (-1, 0, +1 tile) so clouds crossing the seam wrap without a pop */}
        {[-TILE, 0, TILE].map(dx => (
          <g key={dx} transform={`translate(${dx} 0)`}>
            {puffs.flat().map((p, i) => (
              <ellipse key={i} cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} fill={`url(#${id}-${p.base ? 'shade' : 'light'})`} />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}

export interface AtmosphericSkyProps {
  triggerRef: RefObject<HTMLElement | null>;
  layers: LayerId[];
  zClass?: string;
}

export default function AtmosphericSky({ triggerRef, layers, zClass = 'z-0' }: AtmosphericSkyProps) {
  const root = useRef<HTMLDivElement>(null);
  const active = useMemo(() => LAYERS.filter(l => layers.includes(l.id)), [layers]);
  const built = useMemo(() => Object.fromEntries(active.map(l => [l.id, l.clouds.map(buildCloud)])), [active]);

  useLayoutEffect(() => {
    const trigger = triggerRef.current ?? root.current?.closest('section');
    if (!trigger) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      active.forEach(l => gsap.set(`[data-sky="${l.id}-par"]`, { scale: l.scale0, force3D: true }));
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        active.forEach((l, i) => {
          // Timeline 1 — unbound horizontal drift, independent of scroll.
          gsap.fromTo(`[data-sky="${l.id}-drift"]`, { xPercent: -50 }, { xPercent: 0, duration: l.drift, ease: 'none', repeat: -1, force3D: true }).progress(i * 0.37 + 0.2);
          // Timeline 2 — scroll-driven inverse parallax: clouds sink as the plane climbs.
          gsap.to(`[data-sky="${l.id}-par"]`, {
            y: l.y, scale: l.scaleEnd ?? l.scale0, ease: 'none', force3D: true,
            scrollTrigger: { trigger, start: 'top top', end: 'bottom top', scrub: 0.6 },
          });
        });
      });
    }, root);
    return () => { mm.revert(); ctx.revert(); };
  }, [active, triggerRef]);

  return (
    <div ref={root} aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${zClass}`}>
      {active.map(l => (
        <div key={l.id} data-sky={`${l.id}-par`} className={`absolute inset-0 will-change-transform ${l.className ?? ''}`}>
          <div data-sky={`${l.id}-drift`} className="absolute left-0 top-0 flex h-full w-[max(200%,1800px)] will-change-transform">
            <Tile layer={l} puffs={built[l.id]} />
            <Tile layer={l} puffs={built[l.id]} />
          </div>
        </div>
      ))}
    </div>
  );
}
