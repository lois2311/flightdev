import { useEffect, useRef } from 'react';

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const EASE = 'cubic-bezier(.2,.8,.2,1)';
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const inOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** Pointer in [-1, 1] on both axes; written by usePointerFx, read by anything that leans toward the cursor. */
export const pointer = { x: 0, y: 0 };

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

/** Where a plane's tail sits inside box: the point the vapour trail leaves from. */
export function tailOf(el: Element, box: Element): [number, number] {
  const a = el.getBoundingClientRect(), b = box.getBoundingClientRect();
  return [a.left - b.left + a.width * 0.14, a.top - b.top + a.height * 0.56];
}

/** Vapour trail: one fading dot per call, throttled to `every` seconds. */
export function makeTrail() {
  let last = 0;
  return (box: HTMLElement | null, x: number, y: number, color: string, t: number, every = 0.08, drift: [number, number] = [-28, 14]) => {
    if (!box || t - last < every || reducedMotion()) return;
    last = t;
    const d = document.createElement('span');
    const sz = 2 + Math.random() * 3;
    d.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;margin:${-sz / 2}px;border-radius:50%;background:${color};pointer-events:none`;
    box.appendChild(d);
    d.animate(
      [{ opacity: 0.85, transform: 'translate(0,0) scale(1)' }, { opacity: 0, transform: `translate(${drift[0] - Math.random() * 18}px,${drift[1] + Math.random() * 14}px) scale(.2)` }],
      { duration: 1000 + Math.random() * 500, easing: 'ease-out' },
    ).onfinish = () => d.remove();
  };
}

/** Fades [data-reveal] blocks up as they enter; data-delay staggers them (ms). */
export function useReveal() {
  useEffect(() => {
    if (reducedMotion()) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      io.unobserve(el);
      const an = el.animate(
        [{ opacity: 0, transform: 'translateY(36px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
        { duration: 900, delay: +(el.dataset.delay || 0), easing: EASE, fill: 'backwards' },
      );
      el.style.opacity = '';
      an.onfinish = () => an.cancel();
    }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => { el.style.opacity = '0'; io.observe(el); });
    return () => io.disconnect();
  }, []);
}

/** Magnetic CTAs ([data-magnet]: lean, shine sweep, arrow cycle) and tilting cards ([data-tilt]). */
export function usePointerFx() {
  useEffect(() => {
    if (reducedMotion()) return;
    let mag: HTMLElement | null = null, tilt: HTMLElement | null = null;
    const move = (e: PointerEvent | { target: EventTarget | null; clientX?: undefined; clientY?: undefined }) => {
      if (e.clientX != null) { pointer.x = e.clientX / innerWidth * 2 - 1; pointer.y = e.clientY! / innerHeight * 2 - 1; }
      const t = e.target instanceof Element ? e.target : document.body;
      const b = t.closest<HTMLElement>('[data-magnet]');
      if (b !== mag) {
        if (mag) mag.style.transform = '';
        if (b) {
          b.querySelector('[data-shine]')?.animate([{ transform: 'translateX(-120%)' }, { transform: 'translateX(120%)' }], { duration: 750, easing: 'ease-out' });
          const arrow = b.querySelector<HTMLElement>('[data-arrow]'), down = arrow?.dataset.dir === 'down';
          const out = down ? 'translateY(22px)' : 'translateX(22px)', inn = down ? 'translateY(-22px)' : 'translateX(-22px)';
          arrow?.querySelector('svg')?.animate([{ transform: 'none' }, { transform: out, offset: 0.45 }, { transform: inn, offset: 0.46 }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.6,0,.3,1)' });
        }
        mag = b;
      }
      if (b && e.clientX != null) {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY! - r.top - r.height / 2) * 0.3}px)`;
      }
      const c = t.closest<HTMLElement>('[data-tilt]');
      if (c !== tilt) { if (tilt) tilt.style.transform = ''; tilt = c; }
      if (c && e.clientX != null) {
        const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY! - r.top) / r.height;
        c.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 9}deg) translateY(-6px)`;
        c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%');
      }
    };
    const leave = () => move({ target: document.body });
    document.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => { document.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave); };
  }, []);
}
