import PlaneMark from './PlaneMark';
import Cta from './ui/Cta';
import Terrain from './art/Terrain';
import LocalTime from './art/LocalTime';
import CordilleraFlight, { NextWaypoint } from './art/CordilleraFlight';

// The company's own flight plan: the waypoints the hero flight passes, in order.
const ROUTE = ['VENDRA POS', 'FLEETTRACK PRO', 'DESARROLLO', 'AUTOMATIZACIÓN'];

const INSTRUMENTS = [
  ['BASE', 'MANIZALES, CO'],
  ['POSICIÓN', '05°04′N 75°31′W'],
] as const;

/**
 * ORIGEN. The home opening on chart paper: a flight over the real relief between Manizales and the Nevado del Ruiz
 * (CordilleraFlight), with the instrument table naming the next waypoint. The chart legend states the data and its scale.
 */
export default function HeroSection() {
  const instruments = (
    <>
      {INSTRUMENTS.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="border-b border-vuelo/15 py-2 pr-6">{k}</dt><dd className="m-0 border-b border-vuelo/15 py-2 text-vuelo">{v}</dd>
        </div>
      ))}
      <dt className="border-b border-vuelo/15 py-2 pr-6">HORA LOCAL</dt><dd className="m-0 border-b border-vuelo/15 py-2 text-vuelo"><LocalTime /> COT</dd>
      <dt className="py-2 pr-6">PRÓXIMO</dt><dd className="m-0 py-2 text-vuelo"><NextWaypoint first={ROUTE[0]} /></dd>
    </>
  );

  return (
    <section id="top" data-waypoint="ORIGEN · MANIZALES" className="relative z-[2] flex min-h-[max(640px,min(100svh,1000px))] flex-col overflow-hidden bg-nube text-vuelo">
      {/* Below the copy on small screens; on desktop the relief fills the lower hero and its horizon sits under the paragraph. */}
      <CordilleraFlight route={ROUTE} className="relative order-2 h-[clamp(260px,44svh,400px)] lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[38%] lg:h-auto">
        <Terrain seed={1105} lines={18} height={300} fill="#F6F8FB" stroke="#2F8CFF" className="absolute inset-x-0 bottom-0 h-full" />
      </CordilleraFlight>

      <div className="gutter relative order-1 flex flex-col pb-8 lg:flex-1 pt-[clamp(108px,15svh,168px)]">
        <div className="mx-auto grid w-full max-w-[1280px] flex-1 gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-7">
            <h1 className="m-0 max-w-[15ch] font-display text-[clamp(3rem,7.6vw,7.2rem)] font-bold leading-[.92] tracking-[-.012em] text-vuelo [text-wrap:balance]">
              Software para operar comercios, flotas y procesos.
            </h1>
            <p className="m-0 max-w-[52ch] text-[clamp(16px,1.3vw,19px)] leading-[1.6] text-vuelo/85 [text-wrap:pretty]">
              Tenemos dos productos propios en operación, Vendra POS y FleetTrack Pro. Además construimos software y automatizaciones para los procesos que no caben en una herramienta comprada.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Cta href="/contacto" label="Contar mi caso" track="click_contact" />
              <Cta href="#productos" label="Ver los productos" variant="paper" />
            </div>
            {/* Mobile and tablet keep the instruments: compact, on paper, right under the actions. */}
            <dl className="m-0 grid w-fit grid-cols-[auto_1fr] bg-nube/90 font-mono text-[10.5px] tracking-[.1em] text-vuelo/70 lg:hidden">{instruments}</dl>
          </div>

          <div className="relative flex flex-col justify-between max-lg:hidden">
            <div aria-hidden="true" className="ml-auto w-[46%] -rotate-6 pt-2">
              <div data-bank className="transition-transform duration-300"><PlaneMark wing="#2F8CFF" fold="#0C2340" crease className="block h-auto w-full" /></div>
            </div>
            <dl className="m-0 grid grid-cols-[auto_1fr] border-t border-vuelo/30 bg-nube/90 px-1 font-mono text-[11px] tracking-[.1em] text-vuelo/70">{instruments}</dl>
          </div>
        </div>
      </div>

      <p className="gutter relative order-3 m-0 border-t border-vuelo/15 bg-nube/90 py-2.5 font-mono text-[10px] tracking-[.12em] text-vuelo/70">
        <span className="mx-auto block max-w-[1280px]">
          RELIEVE REAL · CORDILLERA CENTRAL · 4°45′–5°11′N 75°12′–75°38′W<span className="max-md:hidden"> · CURVAS CADA 100 M · EXAGERACIÓN VERTICAL 1,8×</span> · DATOS SRTM, MAPZEN TERRAIN TILES
        </span>
      </p>
    </section>
  );
}
