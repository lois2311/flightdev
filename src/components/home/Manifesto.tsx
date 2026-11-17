import Terrain from '../art/Terrain';

/** The editorial pause of the home page: one statement over the full-width terrain. */
export default function Manifesto() {
  return (
    <section aria-labelledby="manifiesto" className="gutter relative overflow-hidden border-t border-borde bg-noche pb-[clamp(220px,30vw,420px)] pt-32">
      <Terrain seed={2024} lines={24} height={420} className="absolute inset-x-0 bottom-0 h-[clamp(240px,34vw,460px)]" label="CORDILLERA CENTRAL · 05°04′N" />
      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-10">
        <h2 id="manifiesto" className="m-0 max-w-[18ch] font-display text-[clamp(2.4rem,6.4vw,6rem)] font-bold leading-[.95] tracking-[-.01em] text-hueso">
          Diseñamos para el día trescientos.
        </h2>
        <p className="m-0 max-w-[56ch] text-[clamp(17px,1.4vw,20px)] leading-[1.6] text-niebla">
          El lanzamiento dura un día. Después vienen los cierres de caja, los conductores nuevos, el internet que se cae y el reporte que alguien pide un viernes a las seis. Así mantenemos Vendra y FleetTrack, y así construimos lo tuyo.
        </p>
      </div>
    </section>
  );
}
