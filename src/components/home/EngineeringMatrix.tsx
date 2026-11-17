import Link from 'next/link';
import Leg from './Leg';
import { LEGS } from '@/content/flightplan';

// Capability × system where it already runs. Every cell is backed by docs/FLIGHTDEV_PRODUCT_STRATEGY.md
// (Vendra, FleetTrack) or the published AG Clean Ops case; FleetTrack's multi-company row by its own code
// (fleettrack-pro: Middleware/TenantMiddleware.cs scopes every request to a fleet, database/012_platform_administration.sql); an empty cell means "not built there", never "coming soon".
const SYSTEMS = ['Vendra POS', 'FleetTrack Pro', 'AG Clean Ops'] as const;
const ROWS: { title: string; text: string; cells: [string | null, string | null, string | null] }[] = [
  { title: 'Producto SaaS multiempresa', text: 'Una plataforma para muchas empresas, cada una con sus datos, usuarios y roles.', cells: ['Empresas, puntos y cuatro roles', 'Administrador, conductor y taller', null] },
  { title: 'Aplicación instalable para trabajo en campo', text: 'Web instalable en el celular, para usar de pie, en la caja o dentro de un vehículo.', cells: ['Sigue vendiendo sin internet', 'App del conductor', null] },
  { title: 'Dinero de la operación', text: 'Cobrar, registrar y cuadrar lo que entra y lo que sale.', cells: ['Cobro en caja, cierre y arqueo', 'Ingresos, gastos y combustible por turno', 'Pagos en línea con Stripe'] },
  { title: 'Agenda, turnos y despacho', text: 'Asignar personas y recursos en el tiempo sin cruces.', cells: [null, 'Turnos, horarios y despacho de servicios', 'Reservas sin cruces de agenda'] },
  { title: 'Reglas de precio', text: 'Precios que cambian según el punto, el servicio o el inmueble.', cells: ['Precios por punto y descuentos al cobrar', null, 'Cotizador por metros y tipo de inmueble'] },
  { title: 'Acceso para el cliente final', text: 'Que tu cliente consulte, reserve o pague sin llamar.', cells: [null, 'Enlace público del servicio', 'Reserva y pago en línea'] },
];

/** 002 INGENIERÍA: what we can build, as an evidence matrix instead of a feature grid. */
export default function EngineeringMatrix() {
  return (
    <Leg {...LEGS.engineering} next={LEGS.case} tone="vuelo" className="pb-[clamp(72px,9vw,128px)] pt-16">
      <div className="mb-14 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
        <h2 id="ingenieria-t" className="h2 max-w-[16ch] text-[clamp(2.2rem,4.8vw,4.2rem)]">Lo que sabemos construir, y dónde ya funciona.</h2>
        <p className="m-0 max-w-[48ch] text-lg leading-[1.6] text-niebla">Cada capacidad tiene un sistema en producción detrás. Lo que todavía no hemos construido queda fuera de la tabla.</p>
      </div>

      <table className="w-full border-collapse text-left max-lg:block">
        <caption className="sr-only">Capacidades de ingeniería de FlightDev y los sistemas en producción donde se aplican</caption>
        <thead className="max-lg:hidden">
          <tr className="border-b border-hueso/30 font-mono text-[11px] tracking-[.12em] text-muted">
            <th scope="col" className="py-3 pr-6 font-normal">CAPACIDAD</th>
            {SYSTEMS.map(s => <th key={s} scope="col" className="w-[19%] py-3 pr-4 font-normal">{s.toUpperCase()}</th>)}
          </tr>
        </thead>
        <tbody className="max-lg:block">
          {ROWS.map(r => (
            <tr key={r.title} className="border-b border-borde align-top max-lg:block max-lg:py-6">
              <th scope="row" className="py-6 pr-8 text-left font-normal max-lg:block max-lg:p-0 max-lg:pb-4">
                <span className="block font-display text-[clamp(1.15rem,1.6vw,1.4rem)] font-semibold leading-tight text-hueso">{r.title}</span>
                <span className="mt-1.5 block max-w-[46ch] text-[15px] leading-[1.55] text-muted">{r.text}</span>
              </th>
              {r.cells.map((c, i) => (
                <td key={SYSTEMS[i]} className={`py-6 pr-4 align-top max-lg:flex max-lg:items-baseline max-lg:gap-3 max-lg:py-1.5 ${c ? '' : 'max-lg:hidden'}`}>
                  <span className="hidden font-mono text-[10.5px] tracking-[.1em] text-muted max-lg:inline max-lg:w-[8.5rem] max-lg:shrink-0">{SYSTEMS[i].toUpperCase()}</span>
                  {c ? (
                    <span className="flex items-start gap-2.5 text-[14px] leading-[1.45] text-niebla">
                      <span aria-hidden="true" className="mt-[5px] size-[7px] shrink-0 rotate-45 bg-cielo" />{c}
                    </span>
                  ) : (
                    <span className="font-mono text-[12px] text-borde"><span aria-hidden="true">·</span><span className="sr-only">No aplica</span></span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[15px]">
        <span className="font-mono text-[11px] tracking-[.12em] text-muted">PARA TU OPERACIÓN</span>
        <Link href="/servicios/desarrollo-software" className="font-semibold text-cielo-claro underline underline-offset-4 hover:text-hueso">Desarrollo de software</Link>
        <Link href="/servicios/automatizacion" className="font-semibold text-cielo-claro underline underline-offset-4 hover:text-hueso">Automatización e integraciones</Link>
      </div>
    </Leg>
  );
}
