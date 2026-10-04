import { useRef } from 'react';
import { Box, Smartphone, Workflow } from 'lucide-react';
import { GradientPlane } from './PlaneMark';
import { reducedMotion, useFrame } from '../lib/fx';

const MODULES = [
  { n: '01', title: 'PLATAFORMAS Y SAAS', lead: 'Sistemas web para vender, organizar y crecer.', items: ['Portales para tu equipo', 'Software por suscripción', 'Puntos de venta a la medida'], Icon: Box },
  { n: '02', title: 'APPS MÓVILES', lead: 'Apps que siguen funcionando aunque no haya internet.', items: ['iOS y Android con un solo código', 'Trabajan sin conexión', 'Lectores de código de barras'], Icon: Smartphone },
  { n: '03', title: 'AUTOMATIZACIONES', lead: 'Menos tareas repetitivas y menos errores.', items: ['Conectamos tus sistemas', 'Procesos que corren solos', 'Integración con tu ERP o CRM'], Icon: Workflow },
];

export default function ServicesSection() {
  const orbit = useRef<HTMLDivElement>(null);

  // Plane swings back and forth along the dotted arc, nose following the tangent.
  useFrame(t => {
    const o = orbit.current;
    if (!o) return;
    const a = Math.PI * (1.05 + 0.38 * (0.5 + 0.5 * Math.sin(t * 0.45 * (reducedMotion() ? 0 : 1) + 1))), rx = 100, ry = 64;
    const x = 110 + rx * Math.cos(a), y = 124 + ry * Math.sin(a);
    o.style.transform = `translate(${x - 17}px, ${y - 17}px) rotate(${Math.atan2(ry * Math.cos(a), -rx * Math.sin(a)) * 180 / Math.PI + 24.5}deg)`;
  });

  return (
    <section id="systems" className="gutter relative overflow-hidden border-t border-borde bg-noche pb-[260px] pt-36 text-hueso">
      <div aria-hidden="true" className="absolute left-1/2 top-[30%] h-[480px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(47,140,255,.13),transparent)]" />
      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-16">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="flex max-w-[720px] flex-col gap-[18px]">
            <p data-reveal className="eyebrow text-cielo-claro">LO QUE HACEMOS</p>
            <h2 data-reveal data-delay="80" className="h2">TRES SERVICIOS. <span className="text-cielo">UN SOLO EQUIPO.</span></h2>
          </div>
          <div aria-hidden="true" className="relative h-[130px] w-[220px] shrink-0">
            <svg viewBox="0 0 220 130" className="absolute inset-0 size-full">
              <path className="flow" d="M14 112 A 100 64 0 0 1 206 60" fill="none" stroke="#2F8CFF" strokeOpacity=".45" strokeWidth="1" strokeDasharray="2 7" strokeLinecap="round" />
            </svg>
            <div ref={orbit} className="absolute left-0 top-0 w-[34px] drop-shadow-[0_8px_10px_rgba(0,0,0,.4)]">
              <GradientPlane wing={['#8CC2FF', '#2F8CFF']} fold={['#16406F', '#2C64A6']} crease={0.6} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
          {MODULES.map(({ n, title, lead, items, Icon }, i) => (
            <div key={n} data-reveal data-delay={i * 120}>
              <article data-tilt className="relative box-border flex h-full flex-col overflow-hidden rounded-[18px] border border-borde border-t-cielo-claro/35 bg-[linear-gradient(180deg,#132B4B,#10243F_40%)] px-[30px] pb-[30px] pt-8 shadow-[inset_0_1px_0_rgba(125,184,255,.18),0_30px_60px_-30px_rgba(0,0,0,.6)] transition-[transform,border-color] duration-[250ms] ease-out will-change-transform hover:border-cielo/45">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(320px_circle_at_var(--mx,50%)_var(--my,-20%),rgba(47,140,255,.18),transparent_65%)]" />
                <div className="relative flex items-center justify-between">
                  <span className="tnum font-mono text-xs text-cielo-claro">{n}</span>
                  <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl border border-cielo/22 bg-cielo/10 text-cielo-claro"><Icon size={22} strokeWidth={1.6} /></span>
                </div>
                <h3 className="relative mt-11 font-display text-[23px] font-semibold leading-[1.15] tracking-[-.01em]">{title}</h3>
                <p className="relative mt-2.5 text-sm leading-[1.55] text-muted">{lead}</p>
                <ul className="relative mt-6 flex list-none flex-col gap-2.5 border-t border-borde p-0 pt-5 text-sm text-niebla">
                  {items.map(it => <li key={it} className="flex items-baseline gap-2.5"><span aria-hidden="true" className="text-cielo">›</span>{it}</li>)}
                </ul>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
