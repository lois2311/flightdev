'use client';

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { reducedMotion } from '@/lib/fx';
import { createTerrainRenderer, DEM, EXAGGERATION, elevation, project, toWorld, viewProjection, type Vec3 } from './terrain-gl';

/**
 * Hero flight over the real Cordillera Central: the camera flies a loop from Manizales toward the Nevado del Ruiz.
 * WebGL2 draws the relief (terrain-gl.ts); a 2D canvas on top draws the route, the next waypoint and the two real
 * places named on the chart. The server-rendered children are the fallback (no JS, no WebGL2, context lost).
 * Reduced motion paints a single still frame. Off screen or in a hidden tab, nothing runs.
 */

// Route loop in normalised (east, south) tile coordinates. Starts at Manizales, the company's base.
const LOOP: [number, number][] = [[0.285, 0.252], [0.42, 0.3], [0.58, 0.4], [0.655, 0.53], [0.6, 0.7], [0.45, 0.72], [0.33, 0.58], [0.24, 0.4]];
const SPEED = 1.1; // km/s
const START = 0.27; // fraction of the loop: Ruiz is ahead on the first frame
const FOG: [number, number] = [22, 46];
// Narrow frames (phones, portrait tablets) look further down: the same horizon height would leave half the canvas as empty sky.
const NARROW_PITCH = -0.3;
const PITCH = -0.1, FOVY = (42 * Math.PI) / 180, ROLL = (4 * Math.PI) / 180, CLEARANCE = 1.1;
const INK = '12,35,64', ROUTE = '47,140,255';

const catmull = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);

/** Samples the closed spline densely and indexes it by distance in km, so the camera flies at constant speed. */
function buildPath() {
  const pts: [number, number][] = [], n = LOOP.length, per = 64;
  for (let k = 0; k < n; k++) for (let i = 0; i < per; i++) {
    const t = i / per, a = LOOP[(k - 1 + n) % n], b = LOOP[k], c = LOOP[(k + 1) % n], d = LOOP[(k + 2) % n];
    pts.push([catmull(a[0], b[0], c[0], d[0], t), catmull(a[1], b[1], c[1], d[1], t)]);
  }
  const dist = [0];
  for (let i = 1; i <= pts.length; i++) {
    const p = pts[i - 1], q = pts[i % pts.length];
    dist.push(dist[i - 1] + Math.hypot(q[0] - p[0], q[1] - p[1]) * DEM.widthKm);
  }
  const length = dist[pts.length];
  const at = (km: number): [number, number] => {
    const s = ((km % length) + length) % length;
    let lo = 0, hi = pts.length;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (dist[m] <= s) lo = m; else hi = m; }
    const t = (s - dist[lo]) / (dist[lo + 1] - dist[lo]), p = pts[lo], q = pts[(lo + 1) % pts.length];
    return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  };
  return { length, at };
}

const heading = (a: [number, number], b: [number, number]): Vec3 => {
  const x = b[0] - a[0], z = b[1] - a[1], l = Math.hypot(x, z) || 1;
  return [x / l, 0, z / l];
};

// "Next waypoint" shared with the hero's instrument table; it changes every few seconds, not every frame.
let nextLabel: string | null = null;
const subs = new Set<() => void>();
function setNext(label: string | null) {
  if (label === nextLabel) return;
  nextLabel = label;
  subs.forEach(cb => cb());
}
const subscribe = (cb: () => void) => { subs.add(cb); return () => { subs.delete(cb); }; };

/** Instrument readout: the waypoint the flight is heading to. */
export function NextWaypoint({ first }: { first: string }) {
  const label = useSyncExternalStore(subscribe, () => nextLabel ?? first, () => first);
  return <span key={label} className="fd-swap inline-block">{label}</span>;
}

async function loadHeightmap(signal: AbortSignal) {
  const res = await fetch(DEM.url, { signal });
  const bmp = await createImageBitmap(await res.blob(), { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
  const c = document.createElement('canvas');
  c.width = DEM.size; c.height = DEM.size;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(bmp, 0, 0);
  const rgba = ctx.getImageData(0, 0, DEM.size, DEM.size).data, hm = new Uint16Array(DEM.size * DEM.size);
  for (let i = 0; i < hm.length; i++) hm[i] = rgba[i * 4] * 256 + rgba[i * 4 + 1];
  return hm;
}

export default function CordilleraFlight({ route, className = '', children }: {
  /** Labels of the company's waypoints, flown in order around the loop. */
  route: string[]; className?: string; children: ReactNode;
}) {
  const boxRef = useRef<HTMLDivElement>(null), glRef = useRef<HTMLCanvasElement>(null), hudRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = boxRef.current, glCanvas = glRef.current, hud = hudRef.current, ctx = hud?.getContext('2d');
    if (!box || !glCanvas || !hud || !ctx || typeof WebGL2RenderingContext === 'undefined') return;
    let still = reducedMotion() || (navigator.hardwareConcurrency ?? 8) <= 2;
    const small = innerWidth < 768;
    const abort = new AbortController();
    let dispose = () => {};

    loadHeightmap(abort.signal).then(hm => {
      if (abort.signal.aborted) return;
      const gl = createTerrainRenderer(glCanvas, hm, small ? 128 : 256);
      if (!gl) return;
      const path = buildPath(), family = getComputedStyle(hud).fontFamily;
      const marks = route.map((label, i) => ({ label, km: path.length * ((i + 0.5) / route.length + 0.04) }));
      const places = [
        { name: 'MANIZALES', uv: DEM.places.manizales, peak: false },
        { name: 'NEVADO DEL RUIZ', uv: DEM.places.ruiz, peak: true },
      ].map(p => ({ ...p, world: toWorld(p.uv[0], p.uv[1], elevation(hm, p.uv[0], p.uv[1])) }));
      const plane = box.parentElement?.querySelector<HTMLElement>('[data-bank]');

      let w = 0, h = 0, dpr = Math.min(small ? 1.5 : 2, devicePixelRatio), km = path.length * START, alt = 0, raf = 0, last = 0, onScreen = false;
      let slow = 0, frames = 0, budget = 0;

      const groundAhead = (s: number) => {
        let m = 0;
        for (let d = -1.5; d <= 2.5; d += 0.5) { const p = path.at(s + d); m = Math.max(m, elevation(hm, p[0], p[1])); }
        return (m / 1000) * EXAGGERATION + CLEARANCE;
      };
      alt = groundAhead(km);

      const paint = () => {
        const pos = path.at(km), dir = heading(pos, path.at(km + 3)), turn = heading(path.at(km + 3), path.at(km + 6));
        const bank = Math.max(-1, Math.min(1, (dir[0] * turn[2] - dir[2] * turn[0]) / 0.3));
        const eye = toWorld(pos[0], pos[1], 0);
        eye[1] = alt;
        const vp = viewProjection({ eye, heading: dir, pitch: w / h < 2 ? NARROW_PITCH : PITCH, roll: -bank * ROLL, fovy: FOVY }, w / h, FOG[1] + 4);
        gl.draw(vp, eye, FOG);

        // Overlay: route ahead, next waypoint, real places. CSS pixels.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        const fade = (d: number) => 1 - Math.min(1, Math.max(0, (d - FOG[0]) / (FOG[1] - FOG[0])));
        ctx.setLineDash([2, 9]); ctx.lineDashOffset = -km * 14; ctx.lineCap = 'round'; ctx.lineWidth = 1.5;
        let prev: [number, number, number] | null = null;
        for (let d = 0.6; d < FOG[1]; d += 0.35) {
          const p = path.at(km + d), q = project(vp, toWorld(p[0], p[1], elevation(hm, p[0], p[1]) + 260), w, h);
          if (prev && q) {
            ctx.strokeStyle = `rgba(${ROUTE},${(0.85 * fade(d)).toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
          }
          prev = q;
        }
        ctx.setLineDash([]);
        ctx.font = `500 10px ${family}`;
        ctx.letterSpacing = '1.4px';

        const ahead = marks.map(m => ({ ...m, d: (((m.km - km) % path.length) + path.length) % path.length })).sort((a, b) => a.d - b.d)[0];
        setNext(ahead.label);
        if (ahead.d > 0.6 && ahead.d < FOG[1]) {
          const p = path.at(ahead.km), q = project(vp, toWorld(p[0], p[1], elevation(hm, p[0], p[1]) + 260), w, h);
          if (q) {
            const a = fade(ahead.d) * Math.min(1, (ahead.d - 0.6) / 1.5), r = Math.max(3, Math.min(6.5, 60 / q[2]));
            ctx.beginPath(); ctx.moveTo(q[0], q[1] - r); ctx.lineTo(q[0] + r, q[1]); ctx.lineTo(q[0], q[1] + r); ctx.lineTo(q[0] - r, q[1]); ctx.closePath();
            ctx.fillStyle = `rgba(246,248,251,${a.toFixed(3)})`; ctx.fill();
            ctx.strokeStyle = `rgba(${ROUTE},${a.toFixed(3)})`; ctx.lineWidth = 1.2; ctx.stroke();
            ctx.fillStyle = `rgba(${INK},${(0.8 * a).toFixed(3)})`; ctx.textAlign = 'left';
            ctx.fillText(ahead.label, q[0] + r + 8, q[1] + 3.5);
          }
        }
        for (const pl of places) {
          const d = Math.hypot(pl.world[0] - eye[0], pl.world[2] - eye[2]), q = project(vp, pl.world, w, h);
          if (!q || d > FOG[1] - 2 || q[0] < 0 || q[0] > w) continue;
          const a = 0.85 * fade(d);
          ctx.strokeStyle = ctx.fillStyle = `rgba(${INK},${a.toFixed(3)})`; ctx.lineWidth = 1;
          ctx.beginPath();
          if (pl.peak) { ctx.moveTo(q[0], q[1] - 5); ctx.lineTo(q[0] + 4.5, q[1] + 3); ctx.lineTo(q[0] - 4.5, q[1] + 3); ctx.closePath(); ctx.fill(); }
          else { ctx.arc(q[0], q[1], 3.5, 0, Math.PI * 2); ctx.stroke(); }
          ctx.beginPath(); ctx.moveTo(q[0], q[1] - 8); ctx.lineTo(q[0], q[1] - 26); ctx.stroke();
          ctx.textAlign = 'center'; ctx.fillText(pl.name, q[0], q[1] - 32);
        }
        if (plane) plane.style.transform = `rotate(${(bank * 5).toFixed(2)}deg)`;
      };

      const size = () => {
        const r = box.getBoundingClientRect();
        w = r.width; h = r.height;
        gl.resize(w, h, dpr);
        hud.width = Math.round(w * dpr); hud.height = Math.round(h * dpr);
        paint();
      };
      const frame = (ms: number) => {
        const dt = last ? Math.min(0.05, (ms - last) / 1000) : 0;
        last = ms; km += SPEED * dt;
        alt += (groundAhead(km) - alt) * Math.min(1, dt * 0.7);
        paint();
        // Adaptive quality: a device that cannot hold ~30 fps drops to 1x pixels, then to a still frame.
        if (dt) { frames++; budget += dt; }
        if (frames === 90) {
          if (budget / frames > 1 / 30) { slow++; if (slow === 1 && dpr > 1) { dpr = 1; size(); } else { still = true; stop(); return; } }
          frames = 0; budget = 0;
        }
        raf = requestAnimationFrame(frame);
      };
      let dead = false;
      const start = () => { if (!still && !dead && !raf && onScreen && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } };
      const stop = () => { cancelAnimationFrame(raf); raf = 0; };
      const onVisibility = () => { if (document.hidden) stop(); else start(); };
      // No restore path: on context loss the static relief takes over for the rest of the visit.
      const onLost = () => { dead = true; stop(); ro.disconnect(); delete box.dataset.live; };

      size();
      box.dataset.live = '';
      const ro = new ResizeObserver(size);
      ro.observe(box);
      const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) start(); else stop(); });
      io.observe(box);
      document.addEventListener('visibilitychange', onVisibility);
      glCanvas.addEventListener('webglcontextlost', onLost);
      dispose = () => {
        stop(); ro.disconnect(); io.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        glCanvas.removeEventListener('webglcontextlost', onLost);
        gl.dispose();
        delete box.dataset.live;
        plane?.style.removeProperty('transform');
        setNext(null);
      };
    }).catch(() => { /* Heightmap unavailable: the static relief stays. */ });

    return () => { abort.abort(); dispose(); };
  }, [route]);

  return (
    <div ref={boxRef} aria-hidden="true" className={`group pointer-events-none ${className}`}>
      <div className="absolute inset-0 transition-opacity duration-700 group-data-[live]:opacity-0">{children}</div>
      <canvas ref={glRef} className="absolute inset-0 size-full opacity-0 transition-opacity duration-700 group-data-[live]:opacity-100" />
      <canvas ref={hudRef} className="absolute inset-0 size-full font-mono opacity-0 transition-opacity duration-700 group-data-[live]:opacity-100" />
    </div>
  );
}
