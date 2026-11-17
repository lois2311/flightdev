import { useEffect, useRef } from 'react';

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Runs cb(seconds) every animation frame with the latest closure. */
export function useFrame(cb: (t: number) => void) {
  const ref = useRef(cb);
  useEffect(() => { ref.current = cb; });
  useEffect(() => {
    let id = 0;
    const loop = (ms: number) => { ref.current(ms / 1000); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);
}

/**
 * The site's one scroll-linked motion: terrain ridgelines draw in as they enter (CSS owns the transition,
 * JS only flips [data-draw]). Re-scans when `key` (the route) changes.
 */
export function useTerrainDraw(key?: string) {
  useEffect(() => {
    if (reducedMotion()) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      (e.target as HTMLElement).dataset.draw = 'in';
    }), { threshold: 0.15 });
    document.querySelectorAll<HTMLElement>('[data-draw]:not([data-draw=in])').forEach(el => {
      // Already on screen in its server state (hero terrain): leave it painted; hiding it now would only flash.
      // A layout node left 'pending' by a previous route (footer terrain) still goes through the observer.
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0 && el.dataset.draw === 'ready') return;
      el.dataset.draw = 'pending';
      io.observe(el);
    });
    return () => io.disconnect();
  }, [key]);
}
