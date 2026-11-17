import { GradientPlane } from './PlaneMark';
import Cta from './ui/Cta';
import Terrain from './art/Terrain';
import LocalTime from './art/LocalTime';

// The company's own flight plan: the route the hero plane is flying.
const ROUTE = [{ x: 560, label: 'VENDRA POS' }, { x: 690, label: 'FLEETTRACK PRO' }, { x: 820, label: 'DESARROLLO' }, { x: 945, label: 'AUTOMATIZACIÓN' }];
// Angular cut into the next section: the brand's "take-off" edge.
const CLIP = 'polygon(0 0,100% 0,100% calc(100% - 112px),calc(58% + 240px) calc(100% - 112px),58% 100%,0 100%)';

/** Home opening on the light "sky". Static on purpose: the only motion is the dashed route flowing toward the plane. */
export default function HeroSection() {
  return (
    <section id="top" className="gutter relative z-[2] box-border flex min-h-[min(100svh,880px)] items-center overflow-hidden bg-nube pb-[180px] pt-[120px] text-vuelo" style={{ clipPath: CLIP }}>
      <Terrain seed={1105} lines={18} height={300} fill="#F6F8FB" stroke="#2F8CFF" waypoints={ROUTE} className="absolute inset-x-0 bottom-0 h-[clamp(150px,19vw,280px)] max-lg:[&>span]:hidden" />

      <div className="relative mx-auto grid w-full max-w-[1280px] items-end gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-7">
          <h1 className="m-0 max-w-[15ch] font-display text-[clamp(3rem,7.4vw,6.6rem)] font-bold leading-[.95] tracking-[-.01em] text-vuelo [text-wrap:balance]">
            Software para operar comercios, flotas y procesos.
          </h1>
          <p className="m-0 max-w-[54ch] text-[clamp(16px,1.3vw,19px)] leading-[1.6] text-vuelo/85 [text-wrap:pretty]">
            Tenemos dos productos propios en operación, Vendra POS y FleetTrack Pro. Además construimos software y automatizaciones para los procesos que no caben en una herramienta comprada.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Cta href="/contacto" label="Contar mi caso" track="click_contact" />
            <Cta href="/productos" label="Ver los productos" variant="paper" />
          </div>
        </div>

        <div className="relative max-lg:hidden">
          <div aria-hidden="true" className="relative mb-6 aspect-[4/3] w-full">
            <svg viewBox="0 0 400 300" className="absolute inset-0 size-full overflow-visible">
              <path className="flow" d="M-40 290 C 60 270, 140 220, 205 150" fill="none" stroke="#2F8CFF" strokeOpacity=".55" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
            </svg>
            <div className="absolute left-[40%] top-0 w-[58%] -rotate-6">
              <GradientPlane wing={['#8CC2FF', '#2F8CFF']} fold={['#0A1B33', '#1C4676']} shade={0.28} />
            </div>
          </div>
          <dl className="m-0 grid grid-cols-[auto_1fr] border-t border-vuelo/25 font-mono text-[11px] tracking-[.1em] text-vuelo/70">
            <dt className="border-b border-vuelo/15 py-2 pr-6">BASE</dt><dd className="m-0 border-b border-vuelo/15 py-2 text-vuelo">MANIZALES, CO</dd>
            <dt className="border-b border-vuelo/15 py-2 pr-6">POSICIÓN</dt><dd className="m-0 border-b border-vuelo/15 py-2 text-vuelo">05°04′N 75°31′W</dd>
            <dt className="py-2 pr-6">HORA LOCAL</dt><dd className="m-0 py-2 text-vuelo"><LocalTime /> COT</dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
