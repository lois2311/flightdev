'use client';

import { useEffect, useRef } from 'react';
import { reducedMotion } from '@/lib/fx';
import { createTerrainRenderer, viewProjection } from './terrain-gl';
import { FOG, flightAt, horizonGlow, lens, palette, smooth } from './tour/camera';
import { ARRIVE_KM, drawHud, placesOf } from './tour/hud';
import { loadHeightmap } from './tour/heightmap';
import { activeStop, avoidRects, canvasVisible, kmAt, measure, nightAt, type Layout } from './tour/layout';
import { findReadouts, write } from './tour/readouts';
import { buildRoute } from './tour/route';

/**
 * The home's one flight: a single fixed WebGL2 canvas behind the page (ADR-004). The camera flies the route from
 * Manizales toward the Nevado del Ruiz as the page scrolls; hero and interludes are transparent windows onto it and the
 * opaque sections cover it. Scroll is never intercepted: the camera chases the scroll position (damped, in rAF) and
 * renders only while it moves, while a window is on screen and the tab is visible.
 * Reduced motion, 2 cores or a slow GPU: no damping, one still frame per stop. No WebGL2: the SVG windows stay.
 * <html data-tour> = "static" (data only) or "live" (canvas drawing); CSS swaps the fallbacks (see globals.css).
 * <html data-tour-leg="002"> = code of the furthest leg the plane has arrived at (absent before the first); written only when it changes.
 */
const INTERLUDE_HORIZON = 0.3, ROLL = (5 * Math.PI) / 180, CHASE = 4.5, MAX_FPS_COST = 1 / 28; // margin under 1/30: a phone capped at 30 fps (low-power mode) is not "slow"

export default function FlightTour() {
  const glRef = useRef<HTMLCanvasElement>(null), hudRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = glRef.current, hud = hudRef.current, ctx = hud?.getContext('2d'), root = document.documentElement;
    if (!canvas || !hud || !ctx) return;
    const abort = new AbortController(), small = innerWidth < 768;
    let cleanup = () => {};

    loadHeightmap(abort.signal).then(hm => {
      if (abort.signal.aborted) return;
      const route = buildRoute(), places = placesOf(hm), family = getComputedStyle(hud).fontFamily;
      let still = reducedMotion() || (navigator.hardwareConcurrency ?? 8) <= 2;
      let layout: Layout = measure(route.start, route.end), reads = layout.stops.map(s => findReadouts(s.el));
      // A leg's waypoint sits at the end of its interlude's range; its code is the label's first word ("002 INGENIERÍA").
      const markList = () => layout.stops.filter(s => s.label).map(s => ({ label: s.label, km: s.b }));
      let marks = markList(), leg = '';
      const mid = (i: number) => (i === 0 ? layout.stops[0].a : (layout.stops[i].a + layout.stops[i].b) / 2);

      // Readouts have real values even without WebGL: each interlude shows the instruments at its own anchor.
      const fillStatic = () => layout.stops.forEach((_, i) => i && write(reads[i], flightAt(hm, route, mid(i))));
      fillStatic();
      root.dataset.tour = 'static';

      const gl = typeof WebGL2RenderingContext === 'undefined' ? null : createTerrainRenderer(canvas, hm, small ? 128 : 256, { paper: '#F6F8FB', ink: '#2F8CFF', index: '#1D5FB8' });
      if (!gl) { cleanup = () => { delete root.dataset.tour; }; return; }

      let w = 0, h = 0, dpr = Math.min(1.5, devicePixelRatio), sy = scrollY, km = route.start, alt = -1, altGap = 0, raf = 0, last = 0, dead = false, night = -1, instruments = 0;
      let slow = 0, frames = 0, spent = 0, drawn = '';
      const sent = new Map<string, string>();
      const target = () => (still ? mid(activeStop(layout, sy)) : kmAt(layout, sy));

      const scrims = document.querySelectorAll<HTMLElement>('.tour-scrim');
      const paint = (dt: number) => {
        const f = flightAt(hm, route, km);
        // Still mode paints once per jump, so it must land on the true clearance: damping there would leave the camera in the relief.
        alt = !still && dt && alt > 0 ? alt + (f.alt - alt) * Math.min(1, dt * 3) : f.alt;
        altGap = Math.abs(f.alt - alt);
        const eye: [number, number, number] = [f.eye[0], alt, f.eye[2]];
        const idx = activeStop(layout, sy), n = still ? (idx === 0 ? 0 : 1) : nightAt(layout, sy);
        if (Math.abs(n - night) > 0.002) {
          night = n; const p = palette(n); gl.setColors(p.paper, p.ink, p.index, horizonGlow(n));
          // The scrim only darkens night frames: by day the interlude's top continues the hero's bright relief instead of greying it.
          scrims.forEach(el => { el.style.opacity = n.toFixed(3); });
        }
        const horizon = still ? (idx === 0 ? layout.horizon : INTERLUDE_HORIZON) : layout.horizon + (INTERLUDE_HORIZON - layout.horizon) * smooth(0, layout.vh * 0.8, sy);
        const approach = smooth(0.8 * route.end, route.end, km), { cam, shift } = lens(w / h, horizon, approach);
        const vp = viewProjection({ eye, heading: f.dir, pitch: cam.pitch, roll: -f.turn * ROLL, fovy: cam.fovy }, w / h, FOG[1] + 4, shift);
        // Scrolling while the camera holds (still mode, or km held inside a stop) keeps the same frame: only the 2D labels,
        // whose avoid boxes move, repaint. Rounded so sub-0.1 m differences (invisible) do not count as motion.
        const frameKey = `${km.toFixed(4)}|${alt.toFixed(4)}|${horizon.toFixed(4)}|${night}|${w}x${h}@${dpr}`;
        if (frameKey !== drawn) { gl.draw(vp, eye, FOG); drawn = frameKey; }
        // The page swaps its fallbacks for the canvas only once there is a drawn frame under them.
        if (root.dataset.tour === 'static') root.dataset.tour = 'live';
        drawHud({ ctx, w, h, dpr, family, vp, eye, km, night, route, hm, places, marks, current: layout.stops[idx].label, avoid: avoidRects(layout, sy) });

        // Plane attitude and instruments go to the windows on screen by direct DOM writes; React never re-renders.
        const show = instruments === 0 || performance.now() - instruments > 250;
        if (show) instruments = performance.now();
        layout.stops.forEach((s, i) => {
          if (s.bottom < sy || s.top > sy + layout.vh) return;
          const v = { '--bank': `${f.bank.toFixed(1)}deg`, '--pitch': `${f.pitch.toFixed(1)}deg`, '--alt': f.alt01.toFixed(2) };
          for (const [k, val] of Object.entries(v)) if (sent.get(i + k) !== val) { sent.set(i + k, val); s.el.style.setProperty(k, val); }
          if (show && i) write(reads[i], f);
        });
      };

      // Runs on every frame, drawn or not: the camera keeps converging under opaque sections and the leg must follow it.
      const reach = () => {
        const next = marks.reduce((c, m) => (km >= m.km - ARRIVE_KM ? m.label.split(' ')[0] : c), '');
        if (next === leg) return;
        leg = next;
        if (leg) root.dataset.tourLeg = leg; else delete root.dataset.tourLeg;
      };

      const frame = (ms: number) => {
        raf = 0;
        const dt = last ? Math.min(0.05, (ms - last) / 1000) : 0, goal = target();
        last = ms;
        km = still ? goal : km + (goal - km) * (1 - Math.exp(-dt * CHASE));
        reach();
        // Hidden behind an opaque section nothing paints, so the altitude gap cannot close: drop it or the loop never settles.
        if (canvasVisible(layout, sy)) paint(dt); else altGap = 0;
        // Slow GPU: first drop to 1x pixels, then settle for still frames (the budget in FLIGHTDEV_PERFORMANCE_BUDGET.md).
        if (dt && !still) {
          frames++; spent += dt;
          if (frames === 90) {
            if (spent / frames > MAX_FPS_COST) { if (++slow === 1 && dpr > 1) { dpr = 1; size(); } else { still = true; } }
            frames = 0; spent = 0;
          }
        }
        if (!still && (Math.abs(goal - km) > 0.01 || altGap > 0.02)) { if (!raf) raf = requestAnimationFrame(frame); }
        else { last = 0; frames = 0; spent = 0; }
      };
      // A wake after idle starts the chase from one nominal frame, so the first step is damped like the rest.
      const wake = () => { if (!raf && !dead && !document.hidden) { last ||= performance.now() - 16; raf = requestAnimationFrame(frame); } };
      const size = () => {
        w = canvas.clientWidth; h = canvas.clientHeight;
        if (!w || !h) return;
        gl.resize(w, h, dpr);
        hud.width = Math.round(w * dpr); hud.height = Math.round(h * dpr);
        km = target(); alt = -1; night = -1; last = 0; drawn = '';
        wake();
      };
      const remeasure = () => { layout = measure(route.start, route.end); marks = markList(); reads = layout.stops.map(s => findReadouts(s.el)); fillStatic(); sent.clear(); km = target(); wake(); };
      const onScroll = () => { sy = scrollY; wake(); };
      const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0; } else wake(); };
      const onLost = () => { dead = true; cancelAnimationFrame(raf); raf = 0; root.dataset.tour = 'static'; fillStatic(); scrims.forEach(el => { el.style.opacity = ''; }); };

      const sizeObs = new ResizeObserver(size), docObs = new ResizeObserver(remeasure);
      sizeObs.observe(canvas); docObs.observe(document.body);
      addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
      canvas.addEventListener('webglcontextlost', onLost);
      size();

      cleanup = () => {
        dead = true; cancelAnimationFrame(raf);
        sizeObs.disconnect(); docObs.disconnect();
        removeEventListener('scroll', onScroll);
        document.removeEventListener('visibilitychange', onVisibility);
        canvas.removeEventListener('webglcontextlost', onLost);
        layout.stops.forEach(s => ['--bank', '--pitch', '--alt'].forEach(k => s.el.style.removeProperty(k)));
        scrims.forEach(el => { el.style.opacity = ''; });
        gl.dispose();
        delete root.dataset.tour; delete root.dataset.tourLeg;
      };
    }, () => { /* Heightmap unavailable: the SVG windows stay and the instruments stay hidden. Setup errors are not swallowed. */ });

    return () => { abort.abort(); cleanup(); };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh">
      <canvas ref={glRef} className="absolute inset-0 size-full" />
      <canvas ref={hudRef} className="absolute inset-0 size-full font-mono" />
    </div>
  );
}
