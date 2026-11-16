import PageHero from '@/components/site/PageHero';
import AgCleanOpsSection from '@/components/AgCleanOpsSection';
import CtaBand from '@/components/site/CtaBand';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Casos de éxito',
  description: 'Proyectos reales de FlightDev en producción: AG Clean Ops, plataforma de cotización, reservas y operación para una empresa de limpieza en Estados Unidos.',
  path: '/casos-de-exito',
});

// Only verifiable cases are published. New cases are added here when the client authorizes them.
export default function CasesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Casos de éxito', path: '/casos-de-exito' }]}
        title={<>Proyectos reales, <span className="text-cielo">en producción.</span></>}
        lead="Aquí publicamos solo proyectos que puedes verificar. Cada caso incluye qué construimos y, cuando el cliente lo permite, el enlace al sistema en funcionamiento."
      />
      <AgCleanOpsSection />
      <CtaBand title="¿Quieres que tu proyecto sea el siguiente caso?" text="Cuéntanos qué necesitas construir y lo revisamos contigo." />
    </>
  );
}
