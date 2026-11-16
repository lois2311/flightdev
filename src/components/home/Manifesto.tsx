import Terrain from '../art/Terrain';
import MaskLines from '../ui/MaskLines';

/** The editorial pause of the home page: one statement over the full-width terrain. */
export default function Manifesto() {
  return (
    <section aria-labelledby="manifiesto" className="gutter relative overflow-hidden border-t border-borde bg-noche pb-[clamp(220px,30vw,420px)] pt-32">
      <Terrain seed={2024} lines={24} height={420} className="absolute inset-x-0 bottom-0 h-[clamp(240px,34vw,460px)]" label="RELIEVE GENERATIVO · CORDILLERA CENTRAL" />
      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-10">
        <p data-reveal className="eyebrow text-cielo-claro">MANIFIESTO</p>
        <MaskLines id="manifiesto" className="m-0 max-w-[20ch] font-display text-[clamp(2.4rem,6.4vw,6rem)] font-bold leading-[.98] tracking-[-.035em] text-hueso"
          lines={['Construimos software', 'que nosotros mismos', { text: 'operamos cada día.', className: 'text-cielo' }]} />
        <p data-reveal data-delay="200" className="m-0 max-w-[56ch] text-[clamp(17px,1.4vw,20px)] leading-[1.6] text-niebla">
          Vendra y FleetTrack son productos nuestros, en operación. Mantenerlos nos obliga a diseñar pensando en el día trescientos, no solo en el día del lanzamiento. Esa disciplina es la que llevamos a tu proyecto.
        </p>
      </div>
    </section>
  );
}
