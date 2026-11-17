import Terrain from '../art/Terrain';

// The manifesto's own sentence, set as a logbook: launch on day one, the real work after it.
const LOG = [
  ['DÍA 001', 'Lanzamiento'],
  ['', 'Los cierres de caja'],
  ['', 'Los conductores nuevos'],
  ['', 'El internet que se cae'],
  ['DÍA 300', 'El reporte que alguien pide un viernes a las seis'],
] as const;

/** The editorial pause of the home page: one statement at full scale over the relief, and its logbook. */
export default function Manifesto() {
  return (
    <section aria-labelledby="manifiesto" className="gutter relative overflow-hidden border-t border-borde bg-noche pb-[clamp(240px,30vw,440px)] pt-[clamp(96px,12vw,176px)]">
      <Terrain seed={2024} lines={24} height={420} className="absolute inset-x-0 bottom-0 h-[clamp(240px,34vw,460px)]" label="CORDILLERA CENTRAL · 05°04′N" />
      <div className="relative mx-auto grid max-w-[1280px] gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end">
        <div className="flex flex-col gap-8">
          <p className="m-0 font-mono text-[11px] tracking-[.14em] text-muted">BITÁCORA</p>
          <h2 id="manifiesto" className="m-0 font-display text-[clamp(3rem,9.2vw,9rem)] font-bold leading-[.88] tracking-[-.015em] text-hueso [text-wrap:balance]">
            Diseñamos para el día trescientos.
          </h2>
          <p className="m-0 max-w-[50ch] text-[clamp(17px,1.4vw,20px)] leading-[1.6] text-niebla">
            El lanzamiento dura un día. Después viene la operación de verdad. Así mantenemos Vendra y FleetTrack, y así construimos lo tuyo.
          </p>
        </div>
        <ol aria-label="Bitácora del día uno al día trescientos" className="m-0 list-none border-t border-hueso/30 p-0 font-mono text-[12.5px] tracking-[.04em]">
          {LOG.map(([day, entry], i) => (
            <li key={entry} className={`grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-borde py-3 ${i === LOG.length - 1 ? 'text-hueso' : 'text-niebla'}`}>
              <span className={day ? 'text-cielo-claro' : 'text-muted'}>{day || '···'}</span><span>{entry}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
