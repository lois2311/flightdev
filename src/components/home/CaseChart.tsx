import Link from 'next/link';
import Leg from './Leg';
import { LEGS } from '@/content/flightplan';

// Facts published in the AG Clean Ops case (/casos-de-exito). No results are shown until the client authorizes figures.
const FACTS = [
  ['Cliente', 'AG Cleaning Service, Estados Unidos'],
  ['Estado', 'En producción'],
  ['Stack', 'Next.js 16, Supabase y Postgres, Stripe'],
  ['Idiomas', 'Español e inglés'],
  ['Cifras', 'No publicamos resultados sin autorización del cliente'],
] as const;

// Plan view: who and what the platform connects.
const PLAN = [
  { k: 'CLIENTE', v: 'Visita el sitio en español o inglés' },
  { k: 'COTIZADOR', v: 'Precio por metros y tipo de inmueble' },
  { k: 'RESERVAS', v: 'Agenda sin cruces entre servicios' },
  { k: 'PAGOS', v: 'Cobro en línea con Stripe' },
  { k: 'PANEL', v: 'La operación gestiona sus cuadrillas' },
];

// Profile view: one booking, from first visit to the day of the service, drawn as an approach descending to the runway.
const PROFILE = ['Cotiza', 'Elige fecha', 'Paga', 'En el panel', 'Servicio'];

/** 003 CASO: the published case drawn as an approach chart: plan view (the system) over profile view (one booking). */
export default function CaseChart() {
  return (
    <Leg {...LEGS.case} next={LEGS.method} className="pb-[clamp(72px,9vw,128px)] pt-16">
      <div className="mb-14 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end">
        <h2 id="caso-t" className="h2 max-w-[18ch] text-[clamp(2.2rem,4.6vw,4rem)]">Cotización, reservas y pagos en línea para una empresa de limpieza.</h2>
        <div className="flex flex-col gap-4">
          <p className="m-0 max-w-[50ch] text-lg leading-[1.6] text-niebla">Diseñamos y construimos la plataforma de AG Cleaning Service. Así se lee, como se lee una carta de aproximación.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/casos-de-exito" className="font-semibold text-cielo-claro underline underline-offset-4 hover:text-hueso">Ver el caso y probar la demo</Link>
            <a href="https://www.cleaningserviceag.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-niebla underline underline-offset-4 hover:text-hueso">
              cleaningserviceag.com<span className="sr-only"> (abre en una nueva pestaña)</span>
            </a>
          </div>
        </div>
      </div>

      <figure className="m-0 overflow-hidden rounded-[3px] border border-hueso/25">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hueso/25 px-5 py-3 font-mono text-[11px] tracking-[.12em]">
          <span className="text-hueso">AG CLEAN OPS · CARTA FD-C1</span>
          <span className="text-voltaje">EN PRODUCCIÓN</span>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col">
            <section aria-label="Vista en planta" className="border-b border-hueso/15 p-5 sm:p-7">
              <p className="m-0 mb-6 font-mono text-[10.5px] tracking-[.14em] text-muted">VISTA EN PLANTA · EL SISTEMA</p>
              <ol className="relative m-0 grid list-none gap-6 p-0 lg:grid-cols-5 lg:gap-3">
                <span aria-hidden="true" className="absolute left-[4px] top-2 h-[calc(100%-16px)] border-l border-dashed border-cielo/50 lg:left-2 lg:top-[4px] lg:h-0 lg:w-[calc(100%-16px)] lg:border-l-0 lg:border-t" />
                {PLAN.map(p => (
                  <li key={p.k} className="relative flex gap-4 lg:flex-col lg:gap-3">
                    <span aria-hidden="true" className="relative mt-1 size-[9px] shrink-0 rotate-45 border border-cielo-claro bg-noche lg:mt-0" />
                    <span className="flex flex-col gap-1">
                      <span className="font-mono text-[11px] tracking-[.12em] text-hueso">{p.k}</span>
                      <span className="text-[14px] leading-[1.45] text-muted">{p.v}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="m-0 mt-7 border border-dashed border-hueso/20 px-4 py-2.5 text-center font-mono text-[10.5px] tracking-[.14em] text-muted">DATOS · SUPABASE Y POSTGRES</p>
            </section>

            <section aria-label="Vista de perfil" className="p-5 sm:p-7">
              <p className="m-0 mb-4 font-mono text-[10.5px] tracking-[.14em] text-muted">VISTA DE PERFIL · UNA RESERVA</p>
              <div aria-hidden="true" className="relative">
                <svg viewBox="0 0 1000 150" preserveAspectRatio="none" className="block h-[120px] w-full overflow-visible">
                  <line x1="0" y1="140" x2="1000" y2="140" stroke="#C9D4E3" strokeOpacity=".3" />
                  <rect x="880" y="136" width="120" height="8" fill="#B4E854" fillOpacity=".85" />
                  <path className="flow" d="M0 14 L200 14 L400 44 L600 74 L800 106 L940 136" fill="none" stroke="#7DB8FF" strokeWidth="1.6" strokeDasharray="2 9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  {[[0, 14], [200, 14], [400, 44], [600, 74], [800, 106]].map(([x, y]) => (
                    <line key={x} x1={x} y1={y} x2={x} y2="140" stroke="#7DB8FF" strokeOpacity=".25" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
                  ))}
                </svg>
              </div>
              <ol className="m-0 mt-3 grid list-none grid-cols-5 gap-2 p-0 font-mono text-[10.5px] tracking-[.08em] text-niebla sm:text-[11px]">
                {PROFILE.map((s, i) => <li key={s} className={i === PROFILE.length - 1 ? 'text-right text-voltaje' : ''}><span className="text-muted">{i + 1} </span>{s.toUpperCase()}</li>)}
              </ol>
            </section>
          </div>

          <dl className="m-0 border-hueso/15 font-mono text-[11.5px] tracking-[.05em] max-lg:border-t lg:border-l">
            {FACTS.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 border-b border-hueso/15 px-5 py-3.5 last:border-b-0">
                <dt className="text-[10.5px] uppercase tracking-[.14em] text-muted">{k}</dt>
                <dd className="m-0 leading-[1.5] text-hueso">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </figure>
    </Leg>
  );
}
