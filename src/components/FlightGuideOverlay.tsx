import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SIZE = 200; // px, plane box at scale 1
const PITCH = 8; // deg, cursor up/down
const ROLL = 6; // deg, cursor left/right
const TRAIL = 28;
const MOBILE = '(max-width: 767px)';
const NO_TRAIL = 1024; // below this the streak would cross the console's touch targets: plane only

/**
 * A waypoint pins the plane to a DOM anchor: (ax, ay) is a point inside the element (0–1 of its box, plus dx/dy px);
 * the plane sits there when that point is at `vy` of the viewport height. `rail` swaps x for the right edge (narrow screens).
 */
type Wp = {
  sel: string; i?: number; ax: number; ay: number; dx?: number; dy?: number; vy: number;
  scale: (vw: number) => number; rot: number; bank: number; glow: number; rail?: boolean;
};

const k = (n: number) => () => n;

// Plane geometry, viewBox units around the box centre (50,50). `at` maps a point to px for a rotation (deg) and scale.
const at = (u: number, v: number, rot: number, s: number) => {
  const a = (rot * Math.PI) / 180, px = (SIZE / 100) * s;
  return { x: (u * Math.cos(a) - v * Math.sin(a)) * px, y: (u * Math.sin(a) + v * Math.cos(a)) * px };
};
// Heading of the plane's axis (tail (4,50) → nose (96,8)) at rotation 0: a flight heading h needs rotation h − AXIS.
const AXIS = (Math.atan2(8 - 50, 96 - 4) * 180) / Math.PI; // ≈ −24.5°
const DOWN = 90 - AXIS; // nose straight down: the axis IS the tangent of the vertical glide slope
const GLIDE_S = 0.22; // at this scale the wing (≈61 u left of the axis) stays outside the console's 16 px padding
const NOSE = at(46, -42, DOWN, GLIDE_S); // nose offset from the box centre while on the slope; the axis runs through it
const FLOAT = 9; // idle bob (below), in the plane's own frame — on screen it is FLOAT × scale
const REST = FLOAT * GLIDE_S + 6; // nose clearance at rest: the bob on screen + the rhombus' half-diagonal (≈5.7 px)

const BEFORE: Wp[] = [
  // 01 despegue: reposo centro-derecha → cabecea, acelera arriba a la derecha, vira hacia el centro
  { sel: '#top', ax: 0.8, ay: 0.4, vy: 0.4, scale: vw => Math.min(1.7, vw / 760), rot: 0, bank: 0, glow: 0 },
  { sel: '#top', ax: 0.94, ay: 0.82, vy: 0.14, scale: k(0.8), rot: -22, bank: -28, glow: 0 },
  // 02 Vendra: entra a la cabina oscura; desde aquí la senda de planeo y el paso a Evolución son una sola pista (vendraTrack)
  { sel: '[data-fly=vendra-head]', ax: 0.94, ay: 0.5, vy: 0.28, scale: k(0.5), rot: 12, bank: 20, glow: 0.5 },
];
const AFTER: Wp[] = [
  // 05 despegue final
  { sel: '[data-fly=cta]', ax: 0.9, ay: 0.4, vy: 0.4, scale: vw => Math.min(1.2, vw / 800), rot: 0, bank: 0, glow: 1 },
];

/** One keyframe of the master timeline. `track` keys are dense samples of a continuous path (linear), the rest are anchors (eased). */
type Key = { s: number; x: number; y: number; scale: number; rot: number; bank: number; glow: number; track?: boolean };
/** A stretch of the page the plane rides continuously: samples (x, doc-y, heading) over a scroll range [s0, s1]. */
type Track = {
  s0: number; s1: number; scale: number; n?: number; rail?: boolean; // n: samples (default N) · rail: no curve, a vertical run
  at: (p: number) => { x: number; docY: number; rot: number; bank: number; scale?: number };
};
const N = 28;
const smooth = (f: number) => f * f * (3 - 2 * f);

/** Evolución: the plane is the needle at the tip of the line being drawn (same scroll window as the stroke). */
function evolutionTrack(vw: number, vh: number): Track | null {
  const track = document.querySelector<HTMLElement>('[data-track]'), path = document.querySelector<SVGPathElement>('[data-path]');
  if (!track) return null;
  const r = track.getBoundingClientRect(), top = r.top + scrollY;
  const s0 = top - 0.7 * vh, s1 = top + r.height - 0.6 * vh; // = the ScrollTrigger window in EvolutionSection
  if (vw < 1024 || !path || !path.ownerSVGElement) {
    return { s0, s1, scale: 0.34, rail: true, at: p => ({ x: vw - 44, docY: top + p * r.height, rot: DOWN, bank: 0 }) };
  }
  const svg = path.ownerSVGElement.getBoundingClientRect(), len = path.getTotalLength();
  const pt = (p: number) => { const q = path.getPointAtLength(gsap.utils.clamp(0, len, p * len)); return { x: svg.left + (q.x / 1000) * svg.width, y: svg.top + scrollY + (q.y / 160) * svg.height }; };
  return {
    s0, s1, scale: 0.42,
    at: p => {
      const a = pt(p), b = pt(Math.min(1, p + 0.04)), c = pt(Math.max(0, p - 0.04));
      const heading = Math.atan2(b.y - c.y, b.x - c.x) * 180 / Math.PI; // shape already climbs 25°
      return { x: a.x, docY: a.y - 52, rot: gsap.utils.clamp(-30, 30, heading - AXIS), bank: 14 };
    },
  };
}

/**
 * Vendra → Evolución as one designed flight, in document px (so easing never fights the scroll):
 *  1. down the glide slope ([data-glide]) with the nose on the line, eased into the landing;
 *  2. rest on the rhombus (fixed to the console);
 *  3. leave from rest straight down the line past the console's corner, quarter-turn left, cross the gap and U-turn onto the
 *     Evolución needle at JOIN, arriving tangent to the stroke at the needle's own speed. The heading is the path tangent
 *     throughout. Joining at JOIN (not at 0) gives the U-turn room: the stroke starts at the 40 px gutter.
 */
const JOIN = 0.3, U_MAX = 130, RAMP = 90;
const D = Math.PI / 180;
type Pt = { x: number; y: number };
type Seg = { len: number; at: (u: number) => Pt & { h: number } };
const line = (a: Pt, b: Pt): Seg => {
  const h = Math.atan2(b.y - a.y, b.x - a.x) / D;
  return { len: Math.hypot(b.x - a.x, b.y - a.y), at: u => ({ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, h }) };
};
function bridge(S: Pt, C: Pt, J: Pt, thj: number): Seg[] {
  const r = Math.min(U_MAX, (J.y - C.y) / 3, J.x - 70);
  const ctr = { x: J.x + r * Math.sin(thj * D), y: J.y - r * Math.cos(thj * D) }, T = { x: ctr.x, y: ctr.y - r }; // U: top T → J
  const r1 = T.y - C.y, c1 = { x: C.x - r1, y: C.y }; // quarter turn: heading 90 (down) → 180 (left), ends at T's height
  if (r < 40 || r1 < 40 || c1.x <= T.x) return [line(S, J)]; // no room for the manoeuvre: fly straight
  return [
    line(S, C),
    { len: (Math.PI / 2) * r1, at: u => { const f = 90 + 90 * u; return { x: c1.x + r1 * Math.sin(f * D), y: c1.y - r1 * Math.cos(f * D), h: f }; } },
    line({ x: c1.x, y: T.y }, T),
    { len: (180 - thj) * D * r, at: u => { const f = 180 - (180 - thj) * u; return { x: ctr.x - r * Math.sin(f * D), y: ctr.y + r * Math.cos(f * D), h: f }; } },
  ];
}
/** `sMin`: earliest scroll the previous chapter allows; a late start is absorbed by the descent so landing and JOIN stay on time. */
function vendraTrack(vh: number, ev: Track | null, sMin: number): Track | null {
  const g = document.querySelector<HTMLElement>('[data-glide]'), panel = document.querySelector<HTMLElement>('[data-fly=vendra-panel]');
  if (!ev || !g || !panel || !g.getClientRects().length) return null;
  const gr = g.getBoundingClientRect(), pr = panel.getBoundingClientRect();
  const x = gr.left + gr.width / 2 - NOSE.x, yA = gr.top + scrollY - NOSE.y, yB = gr.bottom + scrollY - NOSE.y - REST;
  const sA = Math.max(yA - 0.3 * vh, sMin), sB = Math.max(yB - 0.66 * vh, sA + 120), sH = Math.max(yB - 0.55 * vh, sB);
  const evLen = ev.s1 - ev.s0, j = ev.at(JOIN), nx = ev.at(JOIN + 0.01);
  const sJ = Math.max(ev.s0 + JOIN * evLen, sH + 200), J = { x: j.x, y: j.docY }, S = { x, y: yB };
  const segs = ev.rail ? [line(S, J)] : bridge(S, { x, y: pr.bottom + scrollY + 40 }, J, j.rot + AXIS);
  const L = segs.reduce((a, q) => a + q.len, 0);
  const pos = (d: number) => {
    for (const q of segs) { if (d <= q.len || q === segs[segs.length - 1]) return q.at(gsap.utils.clamp(0, 1, d / q.len)); d -= q.len; }
    return segs[0].at(0);
  };
  // speed along the bridge: 0 → V over R, cruise, V → needle speed over E; integrates to exactly L at sJ
  const ds = sJ - sH, R = Math.min(RAMP, ds * 0.3), E = Math.min(120, ds * 0.3);
  const vN = Math.hypot(nx.x - j.x, nx.docY - j.docY) / (0.01 * evLen), V = Math.max(0.1, (L - (vN * E) / 2) / (ds - R / 2 - E / 2));
  const dist = (t: number) => t < R ? (V * t * t) / (2 * R)
    : t < ds - E ? V * (t - R / 2)
    : V * (ds - E - R / 2) + V * (t - ds + E) + ((vN - V) * (t - ds + E) ** 2) / (2 * E);
  return {
    s0: sA, s1: sJ, scale: GLIDE_S, n: 120,
    at: p => {
      const s = sA + p * (sJ - sA);
      if (s <= sB) return { x, docY: yA + (yB - yA) * (0.5 - 0.5 * Math.cos(Math.PI * ((s - sA) / (sB - sA)))), rot: DOWN, bank: 0 };
      if (s <= sH) return { x, docY: yB, rot: DOWN, bank: 0 };
      const d = gsap.utils.clamp(0, L, dist(s - sH)), q = pos(d), k = smooth(d / L);
      return { x: q.x, docY: q.y, rot: q.h - AXIS, bank: 14 * k, scale: GLIDE_S + (ev.scale - GLIDE_S) * k };
    },
  };
}

/** Consola: glide along the top edge of the three panels, left to right. */
function consolaTrack(vh: number): Track | null {
  const cards = [...document.querySelectorAll<HTMLElement>('[data-sys]')].map(e => e.getBoundingClientRect());
  if (cards.length < 2) return null;
  const top = cards[0].top + scrollY;
  return {
    s0: top - 0.8 * vh, s1: top - 0.3 * vh, scale: 0.34,
    at: p => {
      const t = p * (cards.length - 1), i = Math.min(cards.length - 2, Math.floor(t)), f = smooth(t - i);
      const x = (j: number) => cards[j].left + cards[j].width * 0.78;
      return { x: x(i) + (x(i + 1) - x(i)) * f, docY: top, rot: 4, bank: 16 * Math.sin(f * Math.PI) };
    },
  };
}

export default function FlightGuideOverlay() {
  const pos = useRef<HTMLDivElement>(null);
  const launch = useRef<HTMLDivElement>(null);
  const fly = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const grad = useRef<SVGLinearGradientElement>(null);

  useLayoutEffect(() => {
    const [P, L, F, FL, T, G, TR, GR] = [pos, launch, fly, float, tilt, glow, trail, grad].map(r => r.current);
    if (!P || !L || !F || !FL || !T || !G || !TR || !GR) return;
    const mm = gsap.matchMedia();

    mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)', narrow: MOBILE }, c => {
      const { motion, narrow } = c.conditions as { motion: boolean; narrow: boolean };
      gsap.set(T, { transformPerspective: 1000 });
      gsap.set(F, { transformPerspective: 1000 });

      // Reduced motion: a still plane docked at the right edge; it only changes tone once the cockpit begins.
      if (!motion) {
        gsap.set(P, { x: innerWidth - 24, y: innerHeight - 48, xPercent: -50, yPercent: -50 }); // in the gutter, clear of the console's F12
        gsap.set(F, { scale: 0.24 });
        const st = ScrollTrigger.create({ trigger: '#top', start: 'bottom 50%', onToggle: s => gsap.set(G, { opacity: s.isActive ? 0 : 1 }) });
        return () => st.kill();
      }

      // ---- trail: ring of recent tail positions, redrawn from the ticker ----
      const pts: { x: number; y: number }[] = [];
      let idle = 0;
      const tick = () => {
        if (innerWidth < NO_TRAIL) { pts.length = 0; TR.setAttribute('d', ''); return; }
        const o = at(-44, 24, +gsap.getProperty(F, 'rotation'), +gsap.getProperty(F, 'scale')); // trailing edge, follows the heading
        const hx = +gsap.getProperty(P, 'x') + o.x;
        const hy = +gsap.getProperty(P, 'y') + o.y + +gsap.getProperty(L, 'y');
        const last = pts[0];
        if (last && Math.hypot(hx - last.x, hy - last.y) > 400) pts.length = 0; // teleport (rebuild / anchor jump): no streak
        if (!last || Math.hypot(hx - last.x, hy - last.y) > 3) { pts.unshift({ x: hx, y: hy }); idle = 0; }
        else if (++idle % 3 === 0) pts.pop();
        if (pts.length > TRAIL) pts.pop();
        if (pts.length < 2) { TR.setAttribute('d', ''); return; }
        TR.setAttribute('d', 'M' + pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L'));
        const tail = pts[pts.length - 1];
        GR.setAttribute('x1', String(pts[0].x)); GR.setAttribute('y1', String(pts[0].y));
        GR.setAttribute('x2', String(tail.x)); GR.setAttribute('y2', String(tail.y));
      };
      gsap.ticker.add(tick);

      gsap.set(P, { xPercent: -50, yPercent: -50 });
      gsap.from(FL, { x: -80, y: 80, opacity: 0, duration: 1.4, ease: 'power3.out', delay: 0.3 });
      gsap.to(FL, { y: `+=${FLOAT}`, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 }); // idle float

      // ---- master timeline: one scrubbed pass over the whole document ----
      let tl: gsap.core.Timeline | undefined;
      const build = () => {
        tl?.scrollTrigger?.kill(); tl?.kill();
        const vw = innerWidth, vh = innerHeight;
        const max = Math.max(1, document.documentElement.scrollHeight - vh);
        tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.8 } });

        if (narrow) {
          // right rail, pointing down the page
          gsap.set(P, { x: vw - 8, y: vh * 0.2 });
          gsap.set(F, { scale: 0.18, rotation: 115 });
          tl.to(P, { y: vh * 0.8, duration: 1 }, 0).to(G, { opacity: 1, duration: 0.06 }, 0.05);
          return;
        }

        const MIN = 280; // scroll px between consecutive chapters, so the plane never teleports
        const anchor = (w: Wp) => {
          const el = document.querySelectorAll<HTMLElement>(w.sel)[w.i ?? 0];
          if (!el || !el.getClientRects().length) return []; // not rendered: skip rather than fly to (0,0)
          const r = el.getBoundingClientRect(), docY = r.top + scrollY + r.height * w.ay + (w.dy ?? 0);
          return [{ w, x: r.left + r.width * w.ax + (w.dx ?? 0), docY, s: docY - vh * w.vy }];
        };
        const keys: Key[] = [];
        let cursor = -MIN;
        const push = (k: Key) => { keys.push(k); cursor = k.s; };
        const pushAnchors = (ws: Wp[]) => ws.flatMap(anchor).forEach(a => {
          const s = Math.max(0, a.s, cursor + MIN);
          push({ s, x: a.x, y: a.docY - s, scale: a.w.scale(vw), rot: a.w.rot, bank: a.w.bank, glow: a.w.glow });
        });
        // p0: start part-way (a track joined mid-run) · gap: scroll after the previous key (1 = continuous hand-over)
        const pushTrack = (t: Track | null, p0 = 0, gap = MIN) => {
          if (!t) return;
          const len = t.s1 - t.s0, n = t.n ?? N, base = Math.max(t.s0, cursor + gap - p0 * len);
          for (let i = 0; i <= n; i++) {
            const p = p0 + ((1 - p0) * i) / n, q = t.at(p), s = base + p * len;
            push({ s, x: q.x, y: q.docY - s, scale: q.scale ?? t.scale, rot: q.rot, bank: q.bank, glow: 1, track: true });
          }
        };
        const ev = evolutionTrack(vw, vh);
        pushAnchors(BEFORE);
        const vt = vendraTrack(vh, ev, cursor + MIN);
        pushTrack(vt); pushTrack(ev, vt ? JOIN : 0, vt ? 1 : MIN); pushTrack(consolaTrack(vh)); pushAnchors(AFTER);
        // shortest turn between keys: a track's tangent can cross ±180°, which must not read as a full spin
        for (let i = 1; i < keys.length; i++) keys[i].rot += 360 * Math.round((keys[i - 1].rot - keys[i].rot) / 360);

        // the document is finite: squeeze the tail back into [0, max], then keep everything on screen
        for (let i = keys.length - 1; i >= 0; i--) keys[i].s = Math.min(keys[i].s, i === keys.length - 1 ? max : keys[i + 1].s - 1);
        const clampY = gsap.utils.clamp(vh * 0.1, vh * 0.9);
        keys.forEach(q => { q.y = clampY(q.y); });

        const a = keys[0];
        gsap.set(P, { x: a.x, y: a.y });
        gsap.set(F, { scale: a.scale, rotation: a.rot, rotationY: a.bank });
        gsap.set(G, { opacity: a.glow });
        keys.slice(1).forEach((q, i) => {
          const f = keys[i], at = f.s / max, d = (q.s - f.s) / max;
          if (d <= 0) return;
          // fromTo + immediateRender:false so a long scroll jump never captures a stale start value
          const o = { duration: d, immediateRender: false }, e = f.track && q.track ? 'none' : 'sine.inOut';
          tl!.fromTo(P, { x: f.x }, { x: q.x, ...o }, at)
            .fromTo(P, { y: f.y }, { y: q.y, ease: e, ...o }, at)
            .fromTo(F, { scale: f.scale, rotation: f.rot, rotationY: f.bank }, { scale: q.scale, rotation: q.rot, rotationY: q.bank, ease: e, ...o }, at)
            .fromTo(G, { opacity: f.glow }, { opacity: q.glow, ease: 'none', ...o }, at);
        });
        tl.set({}, {}, 1); // timeline length must be exactly 1 or scrub progress drifts from scroll
      };
      build();
      let t = 0;
      const rebuild = () => { clearTimeout(t); t = window.setTimeout(() => { build(); ScrollTrigger.refresh(); }, 150); };
      const ro = new ResizeObserver(rebuild); // fires on resize and when fonts/images change the page height
      ro.observe(document.body);
      addEventListener('fd:relayout', rebuild); // an anchor moved without the page changing size (glide slope re-landed)

      // ---- cursor: dampened pitch/roll ----
      const off: (() => void)[] = [];
      if (matchMedia('(pointer: fine)').matches) {
        const pitch = gsap.quickTo(T, 'rotationX', { duration: 1.2, ease: 'power3.out' });
        const roll = gsap.quickTo(T, 'rotation', { duration: 1.2, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          pitch(-(e.clientY / innerHeight - 0.5) * 2 * PITCH);
          roll((e.clientX / innerWidth - 0.5) * 2 * ROLL);
        };
        addEventListener('pointermove', move, { passive: true });
        off.push(() => removeEventListener('pointermove', move));
      }

      // ---- footer: lean forward on hover, climb out on send ----
      const over = (e: PointerEvent) => { if ((e.target as Element).closest?.('[data-takeoff]')) gsap.to(FL, { rotation: 16, duration: 0.4, ease: 'power2.out', overwrite: 'auto' }); };
      const out = (e: PointerEvent) => { if ((e.target as Element).closest?.('[data-takeoff]')) gsap.to(FL, { rotation: 0, duration: 0.5, ease: 'power2.out' }); };
      const go = () => {
        gsap.timeline()
          .to(FL, { rotation: -10, duration: 0.3 }, 0)
          .to(TR, { strokeWidth: 8, duration: 0.4 }, 0)
          .to(L, { y: -(innerHeight + 320), duration: 1.1, ease: 'power3.in' }, 0.15)
          .to(TR, { strokeWidth: 3, duration: 0.8 }, 1.1)
          .set(L, { y: 90, opacity: 0 }, 1.5)
          .set(FL, { rotation: 0 }, 1.5)
          .to(L, { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }, 1.6);
      };
      document.addEventListener('pointerover', over);
      document.addEventListener('pointerout', out);
      addEventListener('fd:takeoff', go);

      return () => {
        gsap.ticker.remove(tick);
        clearTimeout(t); ro.disconnect();
        tl?.scrollTrigger?.kill(); tl?.kill();
        off.forEach(f => f());
        document.removeEventListener('pointerover', over);
        document.removeEventListener('pointerout', out);
        removeEventListener('fd:takeoff', go);
        removeEventListener('fd:relayout', rebuild);
        gsap.killTweensOf([P, L, F, FL, T, G, TR]);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {/* estela: Azul Cielo 40% → transparente */}
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="fd-trail" ref={grad} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(47,140,255,0.4)" />
            <stop offset="1" stopColor="rgba(47,140,255,0)" />
          </linearGradient>
        </defs>
        <path ref={trail} fill="none" stroke="url(#fd-trail)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div ref={pos} data-plane-pos className="absolute left-0 top-0 will-change-transform" style={{ width: SIZE, height: SIZE }}>
        <div ref={launch} className="absolute inset-0">
          {/* resplandor nocturno sobre Vuelo (cross-fade en vez de filtro animado) */}
          <div ref={glow} className="absolute -inset-1/4 opacity-0 bg-[radial-gradient(closest-side,rgba(125,184,255,.35),transparent)]" />
          <div ref={fly} data-plane-fly className="absolute inset-0 [transform-style:preserve-3d]">
            <div ref={float} className="absolute inset-0">
              <div ref={tilt} className="absolute inset-0 [transform-style:preserve-3d]">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
                  <defs>
                    <linearGradient id="fd-fold-shade" x1="96" y1="8" x2="54" y2="94" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#10243F" /><stop offset="1" stopColor="#0C2340" />
                    </linearGradient>
                    <linearGradient id="fd-wing-sheen" x1="96" y1="8" x2="4" y2="50" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#7DB8FF" stopOpacity=".7" /><stop offset=".55" stopColor="#7DB8FF" stopOpacity=".12" /><stop offset="1" stopColor="#7DB8FF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* pliegue (plano trasero) */}
                  <polygon points="40,64 96,8 54,94" fill="url(#fd-fold-shade)" />
                  <polyline points="96,8 54,94 40,64" fill="none" stroke="#7DB8FF" strokeOpacity=".4" strokeWidth=".6" strokeLinejoin="round" />
                </svg>
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" style={{ transform: 'translateZ(22px)' }}>
                  {/* ala (plano frontal) */}
                  <polygon points="4,50 96,8 40,64" fill="#2F8CFF" />
                  <polygon points="4,50 96,8 40,64" fill="url(#fd-wing-sheen)" />
                  <line x1="40" y1="64" x2="96" y2="8" stroke="#7DB8FF" strokeWidth=".5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
