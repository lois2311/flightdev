import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Leg from './Leg';
import VendraLogo from '../vendra/VendraLogo';
import PosDemo from '../vendra/PosDemo';
import FleetTrackWordmark from '../fleettrack/FleetTrackWordmark';
import { FLEETTRACK, VENDRA } from '@/content/products';
import { LEGS } from '@/content/flightplan';
import commandCenter from '@/content/media/fleettrack-command-center.webp';

// Callouts on the real FleetTrack capture: positions are % of the 1440x900 screenshot, texts come from verified modules.
const FLEET_CALLOUTS = [
  { n: 1, x: 33, y: 27, title: 'El día de un vistazo', text: 'Servicios en curso, vehículos en ruta, turnos y decisiones pendientes.' },
  { n: 2, x: 47, y: 46, title: 'Servicios y despacho', text: 'Cada servicio con su conductor y su estado, de principio a fin.' },
  { n: 3, x: 87, y: 53, title: 'Mantenimiento y documentos', text: 'Lo que vence o se pasó del intervalo, priorizado para decidir hoy.' },
  { n: 4, x: 47, y: 83, title: 'Disponibilidad de la flota', text: 'Cada vehículo con su estado, sus alertas y su kilometraje.' },
];

// What to look for in the Vendra cashier illustration. No markers over it: the demo is interactive and its layout changes per tab.
const POS_CALLOUTS = [
  { title: 'Código de 4 dígitos', text: 'El cliente llega a la caja con el código del pedido que armó el vendedor.' },
  { title: 'Caja con teclado', text: 'F1 vende, F3 cierra la caja, F4 abre reportes.' },
  { title: 'Medios de pago locales', text: 'Efectivo, Nequi y Daviplata, con descuentos al cobrar.' },
];

const Marker = ({ n, className = '', style }: { n: string | number; className?: string; style?: CSSProperties }) => (
  <span aria-hidden="true" style={style} className={`grid size-6 place-items-center font-mono text-[11px] font-medium ${className}`}>
    <span className="absolute size-[18px] rotate-45 border border-current bg-noche" />
    <span className="relative">{n}</span>
  </span>
);

/** 001 PRODUCTOS: each product gets its own scene and composition; neither is a card. */
export default function ProductScenes() {
  return (
    <Leg {...LEGS.products} next={LEGS.engineering} className="pb-[clamp(72px,9vw,128px)] pt-16">
      <div className="mb-[clamp(56px,8vw,112px)] flex flex-wrap items-end justify-between gap-8">
        <h2 id="productos-t" className="h2 max-w-[14ch] text-[clamp(2.4rem,5.6vw,5rem)]">Dos productos que operamos todos los días.</h2>
        <p className="m-0 max-w-[44ch] text-lg leading-[1.6] text-niebla">Los mantenemos nosotros: soporte, actualizaciones y las caídas de internet de un sábado. Esa práctica es la que llevamos a los proyectos de clientes.</p>
      </div>

      {/* Vendra: the cashier moment, played on screen, with its flow as a numbered procedure beside it. */}
      <article aria-labelledby="vendra-t" className="relative grid gap-x-[clamp(32px,5vw,80px)] gap-y-12 border-t border-borde pt-10 lg:grid-cols-[minmax(0,.78fr)_minmax(0,1.42fr)]">
        <span aria-hidden="true" className="absolute left-0 top-0 h-[3px] w-24 bg-voltaje" />
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <VendraLogo size={34} />
            <span className="font-mono text-[11px] tracking-[.12em] text-muted">FD-01 · COMERCIO</span>
          </div>
          <div className="flex flex-col gap-4">
            <h3 id="vendra-t" className="m-0 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-.01em] text-hueso [font-variation-settings:'wdth'_80]">{VENDRA.tagline}</h3>
            <p className="m-0 leading-[1.65] text-niebla">{VENDRA.summary}</p>
          </div>
          <ol className="m-0 list-none border-t border-borde p-0">
            {VENDRA.flow.map((f, i) => (
              <li key={f.step} className="grid grid-cols-[2.4rem_minmax(0,1fr)] gap-x-3 border-b border-borde py-3.5">
                <span className="font-mono text-[11px] leading-6 tracking-[.12em] text-voltaje">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[15px] leading-6 text-niebla"><b className="font-semibold text-hueso">{f.step}.</b> {f.text}</span>
              </li>
            ))}
          </ol>
          <Link href={VENDRA.path} data-track="view_product" data-product="vendra" className="inline-flex w-fit items-center gap-2 font-semibold text-voltaje underline-offset-4 hover:underline">
            Conocer Vendra POS <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <figure className="m-0 flex min-w-0 flex-col gap-6 lg:pt-14">
          <PosDemo />
          <dl className="m-0 grid gap-x-8 gap-y-4 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
            {POS_CALLOUTS.map(c => (
              <div key={c.title} className="flex gap-3">
                <span aria-hidden="true" className="mt-[7px] size-[7px] shrink-0 rotate-45 bg-voltaje" />
                <div><dt className="text-[14px] font-semibold text-hueso">{c.title}</dt><dd className="m-0 text-[14px] leading-[1.5] text-muted">{c.text}</dd></div>
              </div>
            ))}
          </dl>
          <figcaption className="font-mono text-[10.5px] tracking-[.08em] text-muted">ILUSTRACIÓN INTERACTIVA CON DATOS DE EJEMPLO · RECREA LA CAJA DE VENDRA</figcaption>
        </figure>
      </article>

      {/* FleetTrack: the real admin panel, wide, read like an annotated chart. */}
      <article aria-labelledby="fleet-t" className="relative mt-[clamp(72px,10vw,144px)] flex flex-col gap-10 border-t border-borde pt-10">
        <span aria-hidden="true" className="absolute left-0 top-0 h-[3px] w-24 bg-cielo" />
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-5">
              <FleetTrackWordmark />
              <span className="font-mono text-[11px] tracking-[.12em] text-muted">FD-02 · TRANSPORTE</span>
            </div>
            <h3 id="fleet-t" className="m-0 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-.01em] text-hueso [font-variation-settings:'wdth'_80]">{FLEETTRACK.tagline}</h3>
          </div>
          <div className="flex flex-col gap-5">
            <p className="m-0 leading-[1.65] text-niebla">{FLEETTRACK.summary}</p>
            <Link href={FLEETTRACK.path} data-track="view_product" data-product="fleettrack" className="inline-flex w-fit items-center gap-2 font-semibold text-cielo-claro underline-offset-4 hover:underline">
              Conocer FleetTrack Pro <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <figure className="m-0 flex flex-col gap-6">
          <div className="overflow-hidden rounded-[3px] border border-borde bg-[#0b0d12]">
            <div className="flex items-center justify-between gap-4 border-b border-borde bg-superficie px-4 py-2.5 font-mono text-[10.5px] tracking-[.12em] text-muted">
              <span>FLEETTRACK PRO · PANEL DE OPERACIÓN</span>
              <span className="text-cielo-claro max-sm:hidden">CAPTURA REAL · ENTORNO DE PRUEBAS</span>
            </div>
            <div className="relative">
              <Image src={commandCenter} alt="Panel de FleetTrack Pro: servicios en curso, vehículos en ruta, turnos del día, servicios en operación, disponibilidad de la flota y mantenimientos priorizados." sizes="(min-width: 1344px) 1280px, calc(100vw - 40px)" placeholder="blur" className="block h-auto w-full" />
              {FLEET_CALLOUTS.map(c => (
                <Marker key={c.n} n={c.n} className="absolute -translate-x-1/2 -translate-y-1/2 text-cielo-claro max-md:hidden" style={{ left: `${c.x}%`, top: `${c.y}%` }} />
              ))}
            </div>
          </div>
          <dl className="m-0 grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
            {FLEET_CALLOUTS.map(c => (
              <div key={c.n} className="flex gap-3 border-t border-borde pt-4">
                <Marker n={c.n} className="relative shrink-0 text-cielo-claro" />
                <div><dt className="text-[14px] font-semibold text-hueso">{c.title}</dt><dd className="m-0 text-[14px] leading-[1.5] text-muted">{c.text}</dd></div>
              </div>
            ))}
          </dl>
          <figcaption className="font-mono text-[10.5px] tracking-[.08em] text-muted">CAPTURA REAL DE FLEETTRACK PRO EN SU ENTORNO DE PRUEBAS · EMPRESA, PERSONAS Y PLACAS SON DATOS DE PRUEBA</figcaption>
        </figure>
      </article>
    </Leg>
  );
}
