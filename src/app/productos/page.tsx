import Link from 'next/link';
import PageHero from '@/components/site/PageHero';
import ProductPortfolio from '@/components/home/ProductPortfolio';
import CtaBand from '@/components/site/CtaBand';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Productos SaaS para comercio y transporte',
  description: 'Portafolio de FlightDev: Vendra POS, punto de venta y caja para comercios, y FleetTrack Pro, gestión de flotas para empresas de transporte en Colombia.',
  path: '/productos',
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Productos', path: '/productos' }]}
        title={<>Software propio para <span className="text-cielo">operaciones reales.</span></>}
        lead="Cada producto de FlightDev nació de una operación concreta y se usa todos los días. Hoy el portafolio cubre comercio y transporte, y crece con cada problema que vale la pena resolver bien."
      />
      <ProductPortfolio />
      <section aria-labelledby="medida" className="gutter border-t border-borde bg-noche py-20">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-6">
          <div className="flex max-w-[640px] flex-col gap-3">
            <h2 id="medida" className="m-0 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold text-hueso">¿Tu operación no encaja en ninguno de los dos?</h2>
            <p className="m-0 leading-[1.6] text-niebla">También desarrollamos software a la medida y automatizamos procesos con la misma ingeniería que usamos en nuestros productos.</p>
          </div>
          <Link href="/soluciones" className="font-semibold text-cielo-claro underline-offset-4 hover:underline">Ver soluciones →</Link>
        </div>
      </section>
      <CtaBand title="Agenda una demostración del producto que te interesa." text="Te mostramos el producto con un escenario parecido al tuyo y te decimos con claridad si encaja." />
    </>
  );
}
