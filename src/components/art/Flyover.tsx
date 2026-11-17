'use client';

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { reducedMotion } from '@/lib/fx';

/**
 * Hero flyover: the Terrain ridgelines seen in perspective while the camera flies the company's route.
 * Canvas 2D, no library. The server-rendered SVG terrain (children) is the no-JS and reduced-motion view;
 * it cross-fades out once the first canvas frame is painted.
 */

// World units: camera at height CAM_H, rows every DZ between NEAR and FAR, one waypoint every LEG.
const NEAR = 1, FAR = 14, DZ = 0.32, CAM_H = 1, ROUTE_Y = 0.4, LEG = 4, SPEED = 0.9, STEP = 10;
// The camera aims LOOK ahead on the route, flying OFFSET to its right so the route reads as a diagonal into the
// distance; at full bank the horizon rolls ROLL and the paper plane PLANE_ROLL degrees.
const LOOK = 1.5, OFFSET = 1.4, TURN = 0.25, ROLL = (1.5 * Math.PI) / 180, PLANE_ROLL = 5;
const CIELO = '47,140,255', VUELO = '12,35,64', FILL = '#F6F8FB';

function hash(i: number, j: number, seed: number) {
  let h = Math.imul(i, 374761393) ^ Math.imul(j, 668265263) ^ seed;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function noise(x: number, z: number, seed: number) {
  const i = Math.floor(x), j = Math.floor(z), fx = x - i, fz = z - j;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash(i, j, seed), b = hash(i + 1, j, seed), c = hash(i, j + 1, seed), d = hash(i + 1, j + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Waypoint k sits at z = (k + 1) * LEG; the route eases between their lateral offsets. */
const wayX = (k: number, seed: number) => (k < 0 ? 0 : (hash(k, 0, seed) - 0.5) * 1.6);
function routeX(z: number, seed: number) {
  const s = z / LEG - 1, k = Math.floor(s), a = wayX(k, seed), b = wayX(k + 1, seed);
  return a + (b - a) * (1 - Math.cos(Math.PI * (s - k))) / 2;
}

/** Ridged relief with a valley carved along the route, so the line flies between the mountains. */
function height(x: number, z: number, seed: number) {
  const n = noise(x * 0.45, z * 0.45, seed) ** 2 * 1.45 + noise(x * 1.3, z * 1.3, seed + 1) * 0.4;
  return n * (0.2 + 0.8 * smooth(0.25, 2.4, Math.abs(x - routeX(z, seed))));
}

/** Camera follows the route; bank (-1..1) is the route's lateral slope there, saturating at a TURN-wide slope. */
function camera(camZ: number, seed: number) {
  const z = camZ + LOOK, slope = (routeX(z + 0.4, seed) - routeX(z - 0.4, seed)) / 0.8;
  return { x: routeX(z, seed) + OFFSET, bank: Math.max(-1, Math.min(1, slope / TURN)) };
}

/** Peaks that would cross the top edge flatten smoothly toward it instead of being cut off. */
const TOP = 8;
const soften = (y: number) => (y >= 2 * TOP ? y : TOP + TOP * Math.exp((y - 2 * TOP) / TOP));

type Frame = { w: number; h: number; vx: number; camZ: number; t: number; seed: number; family: string; route: string[] };

/** Paints one frame; returns the label of the waypoint ahead and the current bank. */
function draw(ctx: CanvasRenderingContext2D, { w, h, vx, camZ, t, seed, family, route }: Frame) {
  const hy = h * 0.24, f = (h - hy) * NEAR * 1.05, cam = camera(camZ, seed);
  // Rows run past both edges so the rolled horizon never shows a bare corner.
  const pad = Math.ceil((w * 0.04) / STEP) * STEP + STEP;
  const fade = (d: number) => smooth(FAR, FAR - 2, d);
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(vx, hy);
  ctx.rotate(-cam.bank * ROLL);
  ctx.translate(-vx, -hy);

  // Back to front: each opaque row hides the ones behind it, like the SVG ridgeline.
  ctx.lineWidth = 1.1;
  ctx.fillStyle = FILL;
  for (let k = Math.floor((camZ + FAR) / DZ); k * DZ - camZ > NEAR; k--) {
    const z = k * DZ, d = z - camZ, s = f / d;
    // Near rows sink into the valley floor before leaving the frame, so they never pop out.
    const flat = smooth(NEAR, NEAR + 1.2, d), front = 1 - (d - NEAR) / (FAR - NEAR);
    const ridge = new Path2D();
    for (let sx = -pad; sx <= w + pad; sx += STEP) {
      const sy = soften(hy + (CAM_H - height((sx - vx) / s + cam.x, z, seed) * flat) * s);
      if (sx === -pad) ridge.moveTo(sx, sy); else ridge.lineTo(sx, sy);
    }
    // Rows behind never reach below the next row's ground line, so the fill stops there instead of the
    // canvas bottom: same occlusion, a fraction of the pixels to rasterise every frame.
    const body = new Path2D(ridge), ground = Math.min(h + 2, hy + (CAM_H * f) / (d + DZ) + 1);
    body.lineTo(w + pad, ground);
    body.lineTo(-pad, ground);
    body.closePath();
    ctx.fill(body);
    ctx.strokeStyle = `rgba(${CIELO},${((0.1 + 0.6 * front ** 1.4) * fade(d)).toFixed(3)})`;
    ctx.stroke(ridge);
  }

  // The route: same dashed language as the site's `.flow`, drifting toward the viewer as the plane advances.
  ctx.setLineDash([2, 9]);
  ctx.lineDashOffset = t * 14;
  ctx.lineCap = 'round';
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = `rgba(${CIELO},.75)`;
  ctx.beginPath();
  for (let i = 0; i <= 48; i++) {
    const d = NEAR + (FAR - NEAR) * (i / 48) ** 1.6, s = f / d;
    const sx = vx + (routeX(camZ + d, seed) - cam.x) * s, sy = hy + (CAM_H - ROUTE_Y) * s;
    if (i) ctx.lineTo(sx, sy); else ctx.moveTo(sx, sy);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Waypoints: diamond + mono label, the same marks as the static terrain.
  ctx.font = `500 10px ${family}`;
  ctx.letterSpacing = '1.4px';
  ctx.textAlign = 'right';
  const next = Math.max(0, Math.floor((camZ + NEAR) / LEG));
  for (let k = Math.floor((camZ + FAR) / LEG) - 1; k >= next; k--) {
    const d = (k + 1) * LEG - camZ;
    if (d <= NEAR || d >= FAR) continue;
    const s = f / d, x = vx + (wayX(k, seed) - cam.x) * s, y = hy + (CAM_H - ROUTE_Y) * s;
    const r = Math.min(6, Math.max(2.5, s * 0.03)), a = fade(d) * smooth(NEAR, NEAR + 1.2, d);
    ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y);
    ctx.closePath();
    ctx.fillStyle = `rgba(10,20,40,${a.toFixed(3)})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${CIELO},${a.toFixed(3)})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    // Only the waypoint ahead is labelled (the one the instrument table names), so labels never stack. The label sits
    // to its left: the route arrives from the lower left and the following waypoints lie up and to the right.
    if (k !== next) continue;
    ctx.fillStyle = `rgba(${VUELO},${(a * 0.75 * smooth(8, 6, d)).toFixed(3)})`;
    ctx.fillText(route[k % route.length], x - r - 8, y + 3.5);
  }
  ctx.restore();
  return { label: route[next % route.length], bank: cam.bank };
}

// "Next waypoint" shared with the instrument table; changes every few seconds, not every frame.
let nextLabel: string | null = null;
const subs = new Set<() => void>();
function setNext(label: string | null) {
  if (label === nextLabel) return;
  nextLabel = label;
  subs.forEach(cb => cb());
}
const subscribe = (cb: () => void) => { subs.add(cb); return () => { subs.delete(cb); }; };

/** Instrument readout: the waypoint the flyover is heading to. Static (first leg) without motion. */
export function NextWaypoint({ first }: { first: string }) {
  const label = useSyncExternalStore(subscribe, () => nextLabel ?? first, () => first);
  // Keyed so each new waypoint swaps in visibly: the reading changed because the flight moved on.
  return <span key={label} className="fd-swap inline-block">{label}</span>;
}

// ponytail: mirrors HeroSection's layout (gutter clamp, 1280px container, 320px instrument column) to put the
// vanishing point under the plane; move it to a measured anchor if that layout changes.
function vanishX(w: number) {
  const g = Math.min(64, Math.max(20, w * 0.05)), cw = Math.min(w - 2 * g, 1280);
  return w >= 1024 ? (w + cw) / 2 - 160 : w / 2;
}

export default function Flyover({ route, seed, className = '', children }: {
  route: string[]; seed: number; className?: string;
  /** Static fallback (server-rendered Terrain), shown until the first frame and whenever motion is reduced. */
  children: ReactNode;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = boxRef.current, canvas = canvasRef.current, ctx = canvas?.getContext('2d');
    if (!box || !canvas || !ctx || reducedMotion()) return;
    const family = getComputedStyle(canvas).fontFamily;
    // The hero's paper plane rolls with the camera, so the relief reads as its flight.
    const plane = box.parentElement?.querySelector<HTMLElement>('[data-bank]');
    let w = 0, h = 0, vx = 0, camZ = 0, t = 0, raf = 0, last = 0, onScreen = false;

    const paint = () => {
      const { label, bank } = draw(ctx, { w, h, vx, camZ, t, seed, family, route });
      setNext(label);
      if (plane) plane.style.transform = `rotate(${(bank * PLANE_ROLL).toFixed(2)}deg)`;
    };
    const size = () => {
      const r = box.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio);
      w = r.width; h = r.height; vx = vanishX(w);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    };
    const frame = (ms: number) => {
      const dt = last ? Math.min(0.05, (ms - last) / 1000) : 0;
      last = ms; camZ += SPEED * dt; t += dt;
      paint();
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && onScreen && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const onVisibility = () => { if (document.hidden) stop(); else start(); };

    size();
    box.dataset.live = '';
    const ro = new ResizeObserver(size);
    ro.observe(box);
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) start(); else stop(); });
    io.observe(box);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop(); ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      delete box.dataset.live;
      plane?.style.removeProperty('transform');
      setNext(null);
    };
  }, [route, seed]);

  return (
    <div ref={boxRef} aria-hidden="true" className={`group pointer-events-none ${className}`}>
      <div className="absolute inset-0 transition-opacity duration-700 group-data-[live]:opacity-0">{children}</div>
      <canvas ref={canvasRef} className="absolute inset-0 size-full font-mono opacity-0 transition-opacity duration-700 group-data-[live]:opacity-100" />
    </div>
  );
}
