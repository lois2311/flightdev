import Link from 'next/link';
import PageHero from '@/components/site/PageHero';
import CtaBand from '@/components/site/CtaBand';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Soluciones tecnológicas para empresas',
  description: 'Soluciones de FlightDev por industria y necesidad: punto de venta para comercio, gestión de flotas para transporte, software a la medida y automatización de procesos.',
  path: '/soluciones',
});

const BY_NEED = [
  { need: 'Comercio y retail', text: 'Cobrar rápido, controlar la caja y ver lo que pasa en cada punto de venta.', href: '/productos/vendra', cta: 'Vendra POS' },
  { need: 'Transporte y flotas', text: 'Ordenar vehículos, conductores, turnos, gastos y mantenimiento en un solo lugar.', href: '/productos/fleettrack', cta: 'FleetTrack Pro' },
  { need: 'Procesos únicos de tu empresa', text: 'Software diseñado para el proceso que te diferencia y que ninguna herramienta resuelve.', href: '/servicios/desarrollo-software', cta: 'Desarrollo de software' },
  { need: 'Sistemas que no se hablan', text: 'Integraciones y flujos automáticos para dejar de copiar datos a mano.', href: '/servicios/automatizacion', cta: 'Automatización' },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Soluciones', path: '/soluciones' }]}
        title={<>Soluciones según el problema que necesitas resolver.</>}
        lead="Algunas necesidades se resuelven mejor con un producto listo; otras, con software construido para tu operación. Te ayudamos a elegir el camino correcto."
      />
      <section aria-labelledby="por-necesidad" className="gutter border-t border-borde bg-noche py-24">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
          <h2 id="por-necesidad" className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">Por necesidad</h2>
          <ul className="m-0 list-none border-t border-borde p-0">
            {BY_NEED.map(b => (
              <li key={b.need} className="grid gap-3 border-b border-borde py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_200px] md:items-center md:gap-10">
                <h3 className="m-0 font-display text-xl font-semibold text-hueso">{b.need}</h3>
                <p className="m-0 leading-[1.6] text-niebla">{b.text}</p>
                <Link href={b.href} className="font-semibold text-cielo-claro underline-offset-4 hover:underline md:text-right">{b.cta}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand title="¿No sabes por dónde empezar?" text="Cuéntanos el problema. Te respondemos con la opción que tiene más sentido para tu operación." />
    </>
  );
}
