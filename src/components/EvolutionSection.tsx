import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHead from './ui/SectionHead';
import PlaneMark from './PlaneMark';
import { reducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  { n: '01', name: 'PLANOS', text: 'Arquitectura, contratos DTO y bases de datos.' },
  { n: '02', name: 'FORMA', text: 'Diseño de interfaz, tokens y ergonomía sin fricción.' },
  { n: '03', name: 'CONSTRUCCIÓN', text: 'Código tipado en .NET y React, estado reactivo.' },
  { n: '04', name: 'TELEMETRÍA', text: 'Pruebas continuas y despliegues sin interrupciones.' },
  { n: '05', name: 'VUELO', text: 'Operación en producción, baja latencia y escalabilidad.' },
];

const LIFT = ['lg:mt-[138px]', 'lg:mt-[106px]', 'lg:mt-[74px]', 'lg:mt-[42px]', 'lg:mt-[16px]'];

export default function EvolutionSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray<HTMLElement>('[data-node]');
      const light = (p: number) => nodes.forEach((n, i) => n.toggleAttribute('data-on', p >= i / (nodes.length - 1) - 0.001));
      if (reducedMotion()) { light(1); return; }
      const st = { trigger: '[data-track]', start: 'top 70%', end: 'bottom 60%', scrub: 0.5 };
      // pathLength=1: the offset lives in [0,1], so CSSPlugin's default px rounding would snap the stroke from hidden to full
      gsap.fromTo('[data-path]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, autoRound: false, ease: 'none', scrollTrigger: { ...st, onUpdate: s => light(s.progress) } });
      gsap.fromTo('[data-vline]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: st });
      gsap.from('[data-phase]', { opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: '[data-track]', start: 'top 80%' } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="evolution" ref={root} className="relative bg-noche pb-28 pt-8 text-hueso md:pb-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead eyebrow="PROCESO // TÚNEL DE VIENTO">DE LOS PLANOS AL VUELO, <span className="text-cielo">EN CINCO FASES.</span></SectionHead>

        <div data-track className="relative mt-16">
          {/* desktop: one continuous trajectory, rising left to right */}
          <svg className="absolute inset-x-0 top-0 hidden h-40 w-full lg:block" viewBox="0 0 1000 160" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 150 C 100 150 100 118 200 118 S 300 86 400 86 S 500 54 600 54 S 700 28 800 28 S 900 8 1000 8" fill="none" stroke="#1E314F" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeDasharray="4 6" />
            {/* no non-scaling-stroke here: it measures dashes in screen px while pathLength=1 normalises in user units, so on
                this stretched SVG the "full" dash covered ~83 % and the next dash peeked in at the far end */}
            <path data-path d="M0 150 C 100 150 100 118 200 118 S 300 86 400 86 S 500 54 600 54 S 700 28 800 28 S 900 8 1000 8" pathLength={1} strokeDasharray={1} strokeDashoffset={0} fill="none" stroke="#2F8CFF" strokeWidth="2" />
          </svg>
          {/* mobile: vertical trajectory */}
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-borde lg:hidden" aria-hidden="true">
            <div data-vline className="h-full origin-top bg-cielo" />
          </div>

          <ol className="relative grid gap-10 lg:grid-cols-5 lg:items-start lg:gap-6">
            {PHASES.map((p, i) => (
              <li key={p.n} data-phase className={`relative pl-10 md:pr-16 lg:pl-0 lg:pr-0 ${LIFT[i]}`}>
                <span data-node className="group absolute left-0 top-1 grid size-6 place-items-center rounded-full border border-borde bg-noche transition-colors data-[on]:border-cielo data-[on]:bg-superficie lg:left-0 lg:top-0">
                  <PlaneMark size={14} fold="#7DB8FF" className="opacity-30 transition-opacity group-data-[on]:opacity-100" />
                </span>
                <p className="font-mono text-xs text-cielo lg:mt-9">{p.n}</p>
                <h3 className="font-display mt-1 text-xl font-semibold">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
