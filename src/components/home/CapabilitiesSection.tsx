import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Boxes, Cable, Code2, RefreshCw } from 'lucide-react';
import Spotlight from '../ui/Spotlight';
import MaskLines from '../ui/MaskLines';

/** Three stacked planes: the layers every system we build is organised into. */
function Layers() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-[150px] w-full max-w-[340px]">
      {['DATOS', 'SERVICIOS', 'INTERFAZ'].map((l, i) => (
        <div key={l} className="absolute inset-x-[8%] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/spot:-translate-y-[var(--lift)]" style={{ bottom: i * 34, '--lift': `${i * 6}px` } as CSSProperties}>
          <div className={`flex h-14 -skew-x-[18deg] items-center justify-end rounded-xl border px-4 font-mono text-[10px] tracking-[.14em] ${i === 2 ? 'border-cielo/60 bg-cielo/14 text-cielo-claro' : 'border-borde bg-superficie/90 text-muted'}`}>
            <span className="skew-x-[18deg]">{l}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** A record captured once and carried through every system: what an integration buys you. */
function Flow() {
  const nodes = ['FORMULARIO', 'VALIDACIÓN', 'SISTEMA', 'AVISO'];
  return (
    <div aria-hidden="true" className="flex items-center gap-0 overflow-hidden">
      {nodes.map((n, i) => (
        <div key={n} className="flex flex-1 items-center">
          <span className={`whitespace-nowrap rounded-lg border px-2.5 py-2 font-mono text-[10px] tracking-[.1em] ${i === nodes.length - 1 ? 'border-cielo/60 bg-cielo/15 text-cielo-claro' : 'border-borde bg-superficie text-muted'}`}>{n}</span>
          {i < nodes.length - 1 && <span className="mx-1 h-px flex-1 border-t border-dashed border-cielo/50" />}
        </div>
      ))}
    </div>
  );
}

const CAPS = [
  { title: 'Software empresarial', text: 'Sistemas internos, portales para clientes y herramientas operativas diseñadas con quienes las usan.', href: '/servicios/desarrollo-software', Icon: Code2, span: 'lg:col-span-4', art: <Layers /> },
  { title: 'Plataformas SaaS', text: 'Producto multiempresa con roles y operación continua: lo que hacemos con Vendra y FleetTrack.', href: '/productos', Icon: Boxes, span: 'lg:col-span-2' },
  { title: 'Modernización de aplicaciones', text: 'Llevamos aplicaciones de escritorio, Access o Excel a la web sin detener la operación.', href: '/servicios/desarrollo-software', Icon: RefreshCw, span: 'lg:col-span-2' },
  { title: 'Automatización e integraciones', text: 'Conectamos sistemas y eliminamos tareas repetitivas para que el dato se registre una sola vez.', href: '/servicios/automatizacion', Icon: Cable, span: 'lg:col-span-4', art: <Flow /> },
];

export default function CapabilitiesSection() {
  return (
    <section aria-labelledby="capacidades" className="gutter relative overflow-hidden border-t border-borde bg-noche py-28">
      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <MaskLines id="capacidades" className="h2 max-w-[16ch]" lines={['Capacidades', { text: 'tecnológicas.', className: 'text-cielo' }]} />
          <Link href="/soluciones" className="font-semibold text-cielo-claro underline-offset-4 hover:underline">Ver todas las soluciones →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {CAPS.map(({ title, text, href, Icon, span, art }, i) => (
            <Spotlight key={title} data-reveal data-delay={i * 90}
              className={`rounded-[22px] border border-borde bg-[linear-gradient(180deg,#132B4B,#0f223c_45%)] ${span} ${art ? 'sm:col-span-2' : ''}`}>
              <Link href={href} className={`grid h-full gap-8 p-7 ${art ? 'items-center md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]' : ''}`}>
                <div className="flex flex-col gap-5">
                  <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl border border-cielo/25 bg-cielo/10 text-cielo-claro"><Icon size={22} strokeWidth={1.6} /></span>
                  <h3 className="m-0 flex items-start justify-between gap-3 font-display text-[22px] font-semibold leading-[1.2] text-hueso">
                    {title}<ArrowUpRight size={18} aria-hidden="true" className="mt-1 shrink-0 text-muted transition-colors group-hover/spot:text-cielo-claro" />
                  </h3>
                  <p className="m-0 text-[15px] leading-[1.6] text-niebla">{text}</p>
                </div>
                {art}
              </Link>
            </Spotlight>
          ))}
        </div>
      </div>
    </section>
  );
}
