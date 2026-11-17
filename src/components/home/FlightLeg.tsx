import PaperPlane from '../art/PaperPlane';
import Terrain from '../art/Terrain';
import type { WaypointRef } from './Leg';

const INSTRUMENTS = [
  ['ground', 'ALT. TERRENO'],
  ['bearing', 'RUMBO'],
  ['remaining', 'DIST. AL NEVADO'],
] as const;

export type FlightPose = 'high-right' | 'low-left' | 'far' | 'close-low' | 'arrival';

const ACCENT = { cielo: 'text-cielo-claro', voltaje: 'text-voltaje' } as const;

// Lettering: the opening and closing legs are full-height and set big; the three in between are shorter and a step smaller, so the page breathes.
const BIG = 'text-[15vw] md:text-[12vw] lg:text-[min(11.5vw,10.5rem)]';
const MID = 'text-[15vw] md:text-[10.5vw] lg:text-[min(9.5vw,8.5rem)]';
const FULL = 'min-h-[100svh] md:min-h-[max(680px,100svh)]';
const SHORT = 'min-h-[100svh] md:min-h-[max(700px,84svh)]';

/**
 * Each leg has its own composition. The plane lives in a "stage" that sits above the lettering in the layout flow, so
 * the two can never overlap. The stage is an inline-size container: --pw (the plane's width) is a fraction of the stage width
 * capped in svh (cqh resolved to 0 for this flex child in Chromium, so the height cap uses the viewport), and low poses lift the box by .28 --pw so the contrail (which hangs 27 % of the box below it) stays inside.
 * --bank/--pitch/--alt are the tour's: poses only vary position, size and scale of lettering.
 */
const POSES: Record<FlightPose, { height: string; type: string; end: boolean; plane: string }> = {
  // 001: lettering left, plane big, high on the right.
  'high-right': { height: FULL, type: BIG, end: false, plane: 'right-[2%] top-0 [--pw:min(64cqw,34svh)] md:right-[4%] md:[--pw:min(34cqw,40svh)]' },
  // 002: lettering right-aligned, plane low on the left.
  'low-left': { height: SHORT, type: MID, end: true, plane: 'bottom-[calc(var(--pw)*.28)] left-[30%] [--pw:min(60cqw,30svh)] md:left-[22%] md:[--pw:min(30cqw,30svh)]' },
  // 003: plane small and far ahead, near the top of the stage.
  far: { height: SHORT, type: MID, end: false, plane: 'left-[46%] top-[14%] [--pw:min(30cqw,16svh)] md:left-[54%] md:top-[16%] md:[--pw:min(15cqw,16svh)]' },
  // 004: plane close and low: the biggest the stage allows.
  'close-low': { height: SHORT, type: MID, end: false, plane: 'bottom-[calc(var(--pw)*.28)] left-[30%] [--pw:min(76cqw,34svh)] md:left-[36%] md:[--pw:min(46cqw,32svh)]' },
  // DESTINO: small, left of the summit (upper centre) and aimed at it.
  arrival: { height: FULL, type: BIG, end: false, plane: 'left-[8%] top-[6%] [--pw:min(40cqw,22svh)] md:left-[20%] md:[--pw:min(20cqw,22svh)]' },
};

/**
 * Interlude between two legs: a transparent window onto the home's fixed flight canvas (art/FlightTour). It shows the
 * plane over the relief, the next waypoint in big signage lettering and live instruments. FlightTour finds it by
 * [data-tour-stop], writes --bank/--pitch/--alt here (the plane reads them) and fills the [data-tour-readout] cells.
 * [data-hud-avoid] marks what the canvas's 2D labels must not cover. The lettering code lights up when the tour reaches
 * the leg ([data-tour-leg] on an ancestor, see globals.css). Without the canvas the SVG relief and a night background stand
 * in: without WebGL2 the instruments show the real values at this leg's anchor; without JS they stay hidden.
 */
export default function FlightLeg({ next, pose, kicker = 'SIGUIENTE WAYPOINT', accent = 'cielo', className = '' }: {
  next: Pick<WaypointRef, 'code' | 'name'>; pose: FlightPose; kicker?: string; accent?: keyof typeof ACCENT; className?: string;
}) {
  const p = POSES[pose];
  const align = p.end ? 'items-end text-right' : 'items-start text-left';

  return (
    <div data-tour-stop="" data-tour-label={`${next.code} ${next.name}`} role="group" aria-label={`Vuelo hacia ${next.code} ${next.name}`}
      className={`tour-sheet relative z-[1] flex flex-col overflow-hidden bg-noche ${p.height} ${className}`}>
      <Terrain seed={next.code.length * 211 + next.name.length} lines={16} height={300} className="tour-fallback absolute inset-x-0 bottom-0 h-[66%]" />
      <div aria-hidden="true" className="tour-scrim absolute inset-0" />

      <div className="gutter relative flex flex-1 flex-col pb-[clamp(28px,4vw,48px)] pt-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-5">
          <div className="relative min-h-[180px] flex-1 [container-type:inline-size]">
            <div data-hud-avoid="" aria-hidden="true" className={`pointer-events-none absolute w-[var(--pw)] ${p.plane}`}>
              <PaperPlane tone="night" contrail shadow className="w-full" />
            </div>
          </div>

          <div className={`flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12 ${p.end ? 'lg:flex-row-reverse' : ''}`}>
            <div data-hud-avoid="" className={`flex flex-col gap-3 ${align}`}>
              <p className="m-0 flex items-center gap-3 font-mono text-[11px] tracking-[.14em] text-niebla">
                <span aria-hidden="true" className="size-[9px] rotate-45 border border-cielo-claro" />{kicker}
              </p>
              <p aria-hidden="true" className={`m-0 flex flex-col font-display font-bold uppercase leading-[.9] tracking-[-.015em] text-hueso ${p.type} ${align}`}>
                <span data-code={next.code} className={`tour-line tour-code ${ACCENT[accent]}`}>{next.code}</span>
                <span className="tour-line tour-name">{next.name}</span>
              </p>
            </div>

            <dl data-hud-avoid="" className="tour-readouts m-0 grid w-full grid-cols-3 border border-borde bg-noche/85 px-1 py-2 font-mono text-[10px] tracking-[.1em] text-niebla sm:max-w-[420px] lg:w-[320px] lg:shrink-0 lg:grid-cols-[auto_1fr] lg:px-4 lg:text-[11px]">
              {INSTRUMENTS.map(([key, label]) => (
                <div key={key} className="tour-row group flex flex-col gap-1 px-3 max-lg:border-l max-lg:border-borde max-lg:first:border-l-0 lg:contents">
                  <dt className="lg:border-b lg:border-borde lg:py-1.5 lg:pr-6 lg:group-last:border-b-0">{label}</dt>
                  <dd data-tour-readout={key} className="tnum m-0 text-hueso lg:border-b lg:border-borde lg:py-1.5 lg:text-right lg:group-last:border-b-0" />
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
