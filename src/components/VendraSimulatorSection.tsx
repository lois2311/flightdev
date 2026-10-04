import { useLayoutEffect, useRef } from 'react';
import SectionHead from './ui/SectionHead';
import PosSimulator from './vendra/PosSimulator';

/**
 * Lands the glide slope on the TOTAL: its bottom = console bottom − TOTAL centre, re-measured whenever the console resizes,
 * the TOTAL resizes (fonts, container query) or the console re-renders. While the TOTAL is off screen (F2/F3, ticket,
 * cobrada) the last landing is kept. Each change tells the guide plane to re-plan ('fd:relayout').
 */
function useGlideSlope() {
  const panel = useRef<HTMLDivElement>(null), glide = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const p = panel.current, g = glide.current;
    if (!p || !g) return;
    let last = NaN, raf = 0, watched: Element | null = null;
    const measure = () => {
      const t = p.querySelector('[data-glide-target]');
      if (!t) return;
      if (t !== watched) { if (watched) ro.unobserve(watched); ro.observe(t); watched = t; }
      const r = t.getBoundingClientRect(), b = p.getBoundingClientRect().bottom - (r.top + r.height / 2);
      if (Math.abs(b - last) < 0.5) return;
      last = b; g.style.bottom = `${b}px`;
      dispatchEvent(new Event('fd:relayout'));
    };
    const soon = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    const ro = new ResizeObserver(soon), mo = new MutationObserver(soon);
    ro.observe(p); mo.observe(p, { childList: true, subtree: true });
    measure(); // synchronously, before the plane's first plan reads the line
    document.fonts?.ready.then(soon);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect(); };
  }, []);
  return { panel, glide };
}

// HUD brackets sit outside the console (cockpit framing), so there's one surface, not a box in a box.
const Corner = ({ className }: { className: string }) => (
  <svg viewBox="0 0 20 20" className={`pointer-events-none absolute h-5 w-5 text-cielo-claro/60 ${className}`} aria-hidden="true"><path d="M1 8V1h7" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
);

export default function VendraSimulatorSection() {
  const { panel, glide } = useGlideSlope();
  return (
    <section id="vendra" className="relative text-hueso">
      <div className="h-40 bg-gradient-to-b from-nube to-noche" aria-hidden="true" />
      <div className="relative overflow-hidden bg-noche">
        <div className="pointer-events-none absolute -top-40 left-[8%] h-[560px] w-[760px] bg-[radial-gradient(closest-side,rgba(47,140,255,.2),transparent)]" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 right-[-6%] h-[520px] w-[640px] bg-[radial-gradient(closest-side,rgba(47,140,255,.12),transparent)]" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-8 md:px-10 md:pb-32">
          <SectionHead eyebrow="CASO DE ESTUDIO // ECOSISTEMA PRINCIPAL" tone="voltaje" fly="vendra-head" size="lg">
            NO SOLO ESCRIBIMOS CÓDIGO. <span className="text-cielo">CONSTRUIMOS PRODUCTOS.</span>
          </SectionHead>
          <p className="mt-6 max-w-xl text-muted">
            <b className="font-semibold text-hueso">VENDRA POS</b> — Ecosistema de punto de venta de alta frecuencia para comercio moderno. El vendedor genera la factura, la caja la cobra con su código y se imprime el ticket térmico. Este es el mismo flujo de teclado: vende algo.
          </p>
          <p className="mt-3 font-mono text-xs text-muted">VENDRA por <span className="text-hueso">flightdev</span></p>

          <div ref={panel} data-fly="vendra-panel" className="relative mt-16 will-change-transform" style={{ transform: 'translate3d(0,0,0)' }}>
            <Corner className="-left-3 -top-3" />
            <Corner className="-right-3 -top-3 rotate-90" />
            <Corner className="-bottom-3 -right-3 rotate-180" />
            <Corner className="-bottom-3 -left-3 -rotate-90" />
            {/* Glide slope: the guide plane rides this line (it reads its box) and lands on the rhombus at the TOTAL row.
                Below lg it stays in layout but invisible, so the plane still follows the console's outer edge. */}
            <div ref={glide} data-glide className="vpos-glide pointer-events-none absolute -right-[18px] -top-8 bottom-[108px] w-px opacity-0 lg:opacity-100" aria-hidden="true">
              <span className="vpos-glide-line absolute inset-0 bg-gradient-to-b from-voltaje/0 via-voltaje/35 to-voltaje" />
              <span className="vpos-glide-end absolute bottom-0 right-0 h-px w-3 bg-voltaje" />
              <span data-glide-end className="vpos-glide-end absolute bottom-0 left-0 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 bg-voltaje shadow-[0_0_12px_rgba(180,232,84,.8)]" />
            </div>
            <PosSimulator />
          </div>
        </div>
      </div>
    </section>
  );
}
