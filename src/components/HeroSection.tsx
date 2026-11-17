import Cta from './ui/Cta';
import Terrain from './art/Terrain';
import LocalTime from './art/LocalTime';
import PaperPlane from './art/PaperPlane';
import { LEGS } from '@/content/flightplan';

const NEXT = `${LEGS.products.code} · ${LEGS.products.name}`;

const INSTRUMENTS = [
  ['BASE', 'MANIZALES, CO'],
  ['POSICIÓN', '05°04′N 75°31′W'],
] as const;

/**
 * ORIGEN. The home opening on chart paper: the copy on paper and, below it, a window onto the page's fixed flight canvas
 * (art/FlightTour, day palette) with the paper plane flying over the real relief between Manizales and the Nevado del Ruiz.
 * The server-rendered SVG relief is the fallback until the canvas draws. The legend states the data and its scale.
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
      <dt className="py-2 pr-6">PRÓXIMO</dt><dd className="m-0 py-2 text-vuelo">{NEXT}</dd>
    </>
  );

  return (
    <section id="top" data-tour-stop="" data-waypoint="ORIGEN · MANIZALES" className="tour-sheet relative z-[2] flex min-h-[max(640px,min(100svh,1200px))] flex-col overflow-hidden bg-nube text-vuelo">
      {/* Paper above the relief on desktop (the section itself turns transparent once the canvas draws): it fades out, so the headline sits on paper and the relief has no hard edge. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[56%] bg-gradient-to-b from-nube from-80% to-transparent max-lg:hidden" />
      {/* The window: below the copy on small screens; on desktop the relief fills the lower hero, starting under the headline. */}
      <div data-tour-window="" aria-hidden="true" className="pointer-events-none relative order-2 h-[clamp(260px,44svh,400px)] lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[52%] lg:h-auto">
        <Terrain seed={1105} lines={18} height={300} fill="#F6F8FB" stroke="#2F8CFF" className="tour-fallback absolute inset-x-0 bottom-0 h-full" />
        {/* Positioned by this wrapper: PaperPlane owns its own position/size rules. */}
        <div data-hud-avoid="" className="absolute left-1/2 top-[14%] w-[min(68vw,380px)] -translate-x-1/2 lg:left-auto lg:right-[24%] lg:top-[2%] lg:w-[min(22vw,380px)] lg:translate-x-0">
          <PaperPlane tone="day" contrail shadow className="w-full" />
        </div>
      </div>

      <div className="gutter relative order-1 flex flex-col pb-8 pt-[clamp(108px,15svh,168px)] max-lg:bg-nube lg:flex-1">
        <div className="mx-auto grid w-full max-w-[1280px] flex-1 gap-y-8 md:grid-cols-[minmax(0,1fr)_240px] md:gap-x-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-x-16">
          <div data-tour-copy="" className="flex min-w-0 flex-col gap-7">
            <h1 data-hud-avoid="" className="m-0 max-w-[15ch] font-display text-[clamp(3rem,7.6vw,7.2rem)] font-bold leading-[.92] tracking-[-.012em] text-vuelo [text-wrap:balance]">
              Software para operar comercios, flotas y procesos.
            </h1>
            <p data-hud-avoid="" className="m-0 max-w-[52ch] text-[clamp(16px,1.3vw,19px)] leading-[1.6] text-vuelo/85 [text-wrap:pretty]">
              Tenemos dos productos propios en operación, Vendra POS y FleetTrack Pro. Además construimos software y automatizaciones para los procesos que no caben en una herramienta comprada.
            </p>
            <div data-hud-avoid="" className="flex flex-wrap items-center gap-3">
              <Cta href="/contacto" label="Contar mi caso" track="click_contact" />
              <Cta href="#productos" label="Ver los productos" variant="paper" />
            </div>
            {/* Phones keep the instruments compact, on paper, right under the actions; from tablet up they sit beside the copy. */}
            <dl className="m-0 grid w-fit grid-cols-[auto_1fr] bg-nube/90 font-mono text-[10.5px] tracking-[.1em] text-vuelo/70 md:hidden">{instruments}</dl>
          </div>

          <div className="relative flex flex-col justify-end max-md:hidden">
            <dl data-hud-avoid="" className="m-0 grid grid-cols-[auto_1fr] border-t border-vuelo/30 bg-nube/90 px-1 font-mono text-[11px] tracking-[.1em] text-vuelo/70">{instruments}</dl>
          </div>
        </div>
      </div>

      <p className="gutter relative order-3 m-0 border-t border-vuelo/15 bg-nube/90 py-2.5 font-mono text-[10px] tracking-[.12em] text-vuelo/70">
        <span className="mx-auto block max-w-[1280px] [text-wrap:balance]">
          RELIEVE REAL · CORDILLERA CENTRAL · 4°45′–5°11′N 75°12′–75°38′W<span className="max-md:hidden"> · CURVAS CADA 100 M · EXAGERACIÓN VERTICAL 1,8×</span> · DATOS SRTM, MAPZEN TERRAIN TILES
        </span>
      </p>
    </section>
  );
}
