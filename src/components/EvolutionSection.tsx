import { useRef, useState } from 'react';
import PlaneMark from './PlaneMark';
import { clamp01, reducedMotion, useFrame } from '../lib/fx';

const PHASES = [
  { n: '01', name: 'ENTENDER', text: 'Escuchamos tu negocio y definimos qué construir primero.', x: 10, y: 150 },
  { n: '02', name: 'DISEÑAR', text: 'Pantallas claras que tu equipo entiende sin capacitación.', x: 30, y: 128 },
  { n: '03', name: 'CONSTRUIR', text: 'Programamos con código limpio y te mostramos avances cada semana.', x: 50, y: 100 },
  { n: '04', name: 'PROBAR', text: 'Revisamos todo antes de que llegue a tus clientes.', x: 70, y: 66 },
  { n: '05', name: 'LANZAR', text: 'Lo ponemos a funcionar y seguimos contigo después.', x: 90, y: 26 },
];
const PATH = 'M0 158 C 50 156, 80 152, 100 150 S 240 134, 300 128 S 440 108, 500 100 S 640 76, 700 66 S 840 38, 900 26 S 970 12, 1000 8';

/** Climb path drawn by scroll; a plane rides its tip and each step lights PENDIENTE → EN CURSO → LISTO as it passes. */
export default function EvolutionSection() {
  const root = useRef<HTMLElement>(null), track = useRef<SVGPathElement>(null), line = useRef<SVGPathElement>(null), plane = useRef<HTMLDivElement>(null);
  const [evo, setEvo] = useState(0);

  useFrame(() => {
    const el = root.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ep = reducedMotion() ? 1 : clamp01((innerHeight * 0.75 - r.top) / (r.height * 0.55));
    setEvo(Math.round(ep * 100) / 100);
    const path = track.current, svg = path?.ownerSVGElement, pl = plane.current;
    line.current?.setAttribute('stroke-dashoffset', String(1 - ep));
    if (!path || !svg || !pl || !svg.clientWidth) return; // track hidden below 960 px
    const L = path.getTotalLength(), a = path.getPointAtLength(Math.max(0.01, ep) * L), b = path.getPointAtLength(Math.min(L, Math.max(0.01, ep) * L + 4));
    const sx = svg.clientWidth / 1000, sy = svg.clientHeight / 170;
    pl.style.transform = `translate(${a.x * sx}px, ${a.y * sy}px) rotate(${Math.atan2((b.y - a.y) * sy, (b.x - a.x) * sx) * 180 / Math.PI + 24.5}deg)`;
    pl.style.opacity = ep > 0.005 ? '1' : '0';
  });

  const on = evo * 4;
  return (
    <section id="evolution" ref={root} className="gutter relative border-t border-borde bg-noche py-36 text-hueso">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-[72px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[720px] flex-col gap-[18px]">
            <p data-reveal className="eyebrow text-cielo-claro">CÓMO TRABAJAMOS</p>
            <h2 data-reveal data-delay="80" className="h2">DE LA IDEA AL LANZAMIENTO, <span className="text-cielo">EN CINCO PASOS.</span></h2>
          </div>
          <span aria-hidden="true" className="tnum font-mono text-xs text-muted">AVANCE {String(Math.round(evo * 100)).padStart(3, '0')} %</span>
        </div>

        <div aria-hidden="true" className="relative hidden h-[180px] min-[960px]:block">
          <svg viewBox="0 0 1000 170" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
            <path ref={track} d={PATH} fill="none" stroke="#1E314F" strokeWidth="1.5" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
            <path ref={line} d={PATH} pathLength={1} strokeDasharray="1" strokeDashoffset="1" fill="none" stroke="#2F8CFF" strokeWidth="2" />
          </svg>
          {PHASES.map((p, i) => {
            const done = on >= i + 0.5, cur = !done && on >= i - 0.5;
            return (
              <span key={p.n} className="absolute box-border size-3.5 rounded-full border-2 transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
                style={{ left: p.x + '%', top: (p.y / 170) * 100 + '%', transform: `translate(-50%,-50%) scale(${cur ? 1.35 : 1})`, borderColor: done || cur ? '#2F8CFF' : '#1E314F', background: done ? '#2F8CFF' : '#0A1428', boxShadow: cur ? '0 0 0 7px rgba(47,140,255,.2)' : 'none' }} />
            );
          })}
          <div ref={plane} className="absolute left-0 top-0 -ml-[13px] -mt-[13px] size-[26px] drop-shadow-[0_6px_8px_rgba(0,0,0,.5)]">
            <PlaneMark className="block h-auto w-full" wing="#7DB8FF" fold="#2F8CFF" />
          </div>
        </div>

        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-4 p-0">
          {PHASES.map((p, i) => {
            const done = on >= i + 0.5, cur = !done && on >= i - 0.5;
            const badge = done ? '#7DB8FF' : cur ? '#B4E854' : '#6F82A0';
            return (
              <li key={p.n} data-reveal data-delay={i * 90} className="flex flex-col gap-3.5 rounded-[14px] border px-5 pb-6 pt-[22px] transition-[background,border-color] duration-[400ms]"
                style={{ background: cur ? '#10243F' : 'rgba(16,36,63,.45)', borderColor: cur ? 'rgba(47,140,255,.4)' : '#1E314F' }}>
                <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                  <span className="tnum text-cielo-claro">PASO {p.n}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-[3px] transition-all duration-[400ms]" style={{ color: badge, borderColor: done ? 'rgba(125,184,255,.3)' : cur ? 'rgba(180,232,84,.45)' : '#1E314F' }}>
                    <span className={`size-[5px] rounded-full ${cur ? 'fd-pulse' : ''}`} style={{ background: badge, animationDuration: '1.4s' }} />
                    {done ? 'LISTO' : cur ? 'EN CURSO' : 'PENDIENTE'}
                  </span>
                </div>
                <h3 className="m-0 font-display text-[21px] font-semibold tracking-[-.01em]">{p.name}</h3>
                <p className="m-0 text-sm leading-[1.6] text-muted [text-wrap:pretty]">{p.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
