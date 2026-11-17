import PageHero from '@/components/site/PageHero';
import Differentiators from '@/components/home/Differentiators';
import EvolutionSection from '@/components/EvolutionSection';
import CtaBand from '@/components/site/CtaBand';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Nosotros: empresa de tecnología en Manizales, Colombia',
  description: 'FlightDev es una empresa de tecnología de Manizales que construye productos SaaS propios y software empresarial para mejorar operaciones en Colombia.',
  path: '/nosotros',
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Nosotros', path: '/nosotros' }]}
        title={<>Una empresa de productos, no una fábrica de páginas.</>}
        lead="FlightDev nació en Manizales para construir software que las empresas usen todos los días. Hoy operamos productos propios y desarrollamos soluciones para otras empresas con la misma disciplina."
      />
      <section aria-labelledby="vision" className="gutter border-t border-borde bg-noche py-24">
        <div className="mx-auto grid max-w-[1280px] gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 id="vision" className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">Visión</h2>
            <p className="m-0 text-lg leading-[1.7] text-niebla">Que una empresa mediana en Colombia tenga acceso a software tan bien hecho como el de una gran corporación, sin pagar por complejidad que no necesita.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">Enfoque</h2>
            <p className="m-0 text-lg leading-[1.7] text-niebla">Construimos productos para industrias concretas —hoy comercio y transporte— y aplicamos lo aprendido al desarrollo a la medida y a la automatización. Producto y servicio se alimentan entre sí.</p>
          </div>
        </div>
      </section>
      <Differentiators />
      <EvolutionSection />
      <CtaBand title="Trabajemos en tu próximo proyecto." text="Escríbenos y conversemos sobre lo que necesitas resolver." />
    </>
  );
}
