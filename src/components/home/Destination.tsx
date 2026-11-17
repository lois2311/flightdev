import Link from 'next/link';
import Cta from '../ui/Cta';
import LocalTime from '../art/LocalTime';
import { CONTACT_EMAIL } from '@/config';
import { LEGS } from '@/content/flightplan';

// The visitor's problem, routed to the page that answers it (moved here from the former "¿Cuál de estos te pasa?" section).
const ROUTES = [
  { problem: 'La fila en la caja crece y el vendedor deja al cliente para cobrar.', href: '/productos/vendra', cta: 'Vendra POS' },
  { problem: 'No sabes cuánto produjo y cuánto gastó cada vehículo hasta fin de mes.', href: '/productos/fleettrack', cta: 'FleetTrack Pro' },
  { problem: 'Tu equipo copia la misma información a mano entre dos o tres sistemas.', href: '/servicios/automatizacion', cta: 'Automatización' },
  { problem: 'Tu proceso clave no cabe en ninguna herramienta del mercado.', href: '/servicios/desarrollo-software', cta: 'Desarrollo de software' },
];

/** DESTINO: where the home route lands. The dashed route descends onto an aerodrome mark beside the one primary action. */
export default function Destination() {
  const { id, code, name } = LEGS.destination;
  return (
    <section id={id} aria-labelledby={`${id}-t`} data-waypoint={`${code} · ${name}`} className="leg gutter relative overflow-hidden border-t border-borde bg-noche pb-[clamp(80px,10vw,144px)] pt-16">
      <span aria-hidden="true" className="leg-stem bottom-auto h-[clamp(120px,16vw,200px)]" />
      <div className="relative mx-auto flex max-w-[1280px] flex-col">
        <div className="relative mb-[clamp(40px,6vw,72px)] flex items-center gap-3 font-mono text-[11px] tracking-[.14em] text-muted">
          <span aria-hidden="true" className="leg-diamond border-voltaje" />
          <span className="text-voltaje">{code}</span><span>{name}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-borde" />
        </div>

        <div className="grid items-end gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-7">
            <h2 id={`${id}-t`} className="m-0 max-w-[16ch] font-display text-[clamp(2.6rem,6.4vw,6rem)] font-bold leading-[.92] tracking-[-.015em] text-hueso [text-wrap:balance]">
              ¿Qué parte de tu operación quieres mejorar primero?
            </h2>
            <p className="m-0 max-w-[52ch] text-[clamp(17px,1.4vw,19px)] leading-[1.6] text-niebla">
              Cuéntanos tu caso. Te respondemos con una recomendación concreta: un producto, un desarrollo o ninguno de los dos.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Cta href="/contacto" label="Contar mi caso" track="click_contact" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-cielo-claro underline underline-offset-4 hover:text-hueso">{CONTACT_EMAIL}</a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <svg aria-hidden="true" viewBox="0 0 320 150" className="w-full max-w-[420px] overflow-visible">
              <path className="flow" d="M0 8 C 90 12, 150 60, 200 104 S 262 132, 268 132" fill="none" stroke="#7DB8FF" strokeOpacity=".75" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
              {/* Aerodrome symbol from aeronautical charts: a ring with the runway through it. */}
              <circle cx="268" cy="132" r="15" fill="none" stroke="#B4E854" strokeWidth="1.5" />
              <rect x="248" y="129.5" width="40" height="5" fill="#B4E854" transform="rotate(-18 268 132)" />
            </svg>
            <dl className="m-0 grid grid-cols-[auto_1fr] border-t border-hueso/25 font-mono text-[11px] tracking-[.1em] text-muted">
              <dt className="border-b border-borde py-2.5 pr-6">BASE</dt><dd className="m-0 border-b border-borde py-2.5 text-hueso">MANIZALES, CO</dd>
              <dt className="border-b border-borde py-2.5 pr-6">HORA LOCAL</dt><dd className="m-0 border-b border-borde py-2.5 text-hueso"><LocalTime /> COT</dd>
              <dt className="py-2.5 pr-6">RESPUESTA</dt><dd className="m-0 py-2.5 text-hueso">UNA RECOMENDACIÓN CONCRETA</dd>
            </dl>
          </div>
        </div>

        <div className="mt-[clamp(56px,7vw,96px)] flex flex-col gap-5">
          <p className="m-0 font-mono text-[11px] tracking-[.14em] text-muted">O ELIGE LA RUTA QUE SE PARECE A TU CASO</p>
          <ul className="m-0 grid list-none gap-px bg-borde p-0 sm:grid-cols-2">
            {ROUTES.map((r, i) => (
              <li key={r.href} className="bg-noche sm:even:pl-6">
                <Link href={r.href} className="group flex h-full flex-col gap-3 py-5 pr-6">
                  <span className="font-mono text-[11px] tracking-[.12em] text-cielo-claro">RUTA {String.fromCharCode(65 + i)} · {r.cta.toUpperCase()}</span>
                  <span className="text-[16px] leading-[1.45] text-hueso group-hover:underline group-hover:underline-offset-4">{r.problem}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
