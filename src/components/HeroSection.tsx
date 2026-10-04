import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import AtmosphericSky from './AtmosphericSky';

const BACK: ('bg' | 'mid')[] = ['bg', 'mid'];
const FRONT: 'fg'[] = ['fg'];
import { reducedMotion } from '../lib/motion';

const LINES = ['CONSTRUIMOS', 'PRODUCTOS DIGITALES', 'QUE SE MUEVEN.'];

export default function HeroSection() {
  const hero = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-line]', { yPercent: 110, duration: 1, ease: 'power4.out', stagger: 0.12, delay: 0.1 });
      gsap.from('[data-fade]', { opacity: 0, y: 16, duration: 0.8, ease: 'power2.out', stagger: 0.1, delay: 0.7 });
    }, hero);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={hero} className="relative flex min-h-[100svh] items-end overflow-hidden bg-gradient-to-b from-horizonte via-nube via-70% to-nube pb-16 pt-32 md:items-center md:pb-0">
      <AtmosphericSky triggerRef={hero} layers={BACK} zClass="z-0" />
      <AtmosphericSky triggerRef={hero} layers={FRONT} zClass="z-20" />

      <div className="relative z-30 mx-auto w-full max-w-7xl px-5 md:px-10">
        <p data-fade className="mb-5 font-mono text-xs tracking-widest text-vuelo/80">ESTUDIO DE INGENIERÍA Y PRODUCTO DIGITAL</p>
        <h1 className="font-display text-[clamp(2.1rem,5.6vw,5.2rem)] font-bold leading-[0.95] text-vuelo">
          {LINES.map(l => (
            <span key={l} className="block overflow-hidden pb-[0.06em]">
              <span data-line className="block">{l}</span>
            </span>
          ))}
        </h1>
        <p data-fade className="mt-8 max-w-lg text-base leading-relaxed text-vuelo/85 md:text-lg">
          No hacemos páginas web desechables. Diseñamos, construimos y desplegamos plataformas SaaS, aplicaciones móviles y flujos automatizados con precisión aeronáutica.
        </p>
        <div data-fade className="mt-8 flex flex-wrap items-center gap-4">
          <a href="#vendra" className="rounded-xl bg-vuelo px-6 py-3 font-mono text-sm font-semibold text-hueso shadow-[0_10px_30px_-12px_rgba(12,35,64,.6)] transition-transform hover:-translate-y-px">[ Ver Vendra en vuelo ↓ ]</a>
          <a href="#brief" className="font-mono text-sm font-medium text-vuelo underline decoration-cielo decoration-2 underline-offset-4 hover:decoration-vuelo">[ Iniciar un proyecto → ]</a>
        </div>
      </div>
    </section>
  );
}
