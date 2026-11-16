import Link from 'next/link';
import LegalPage from '@/components/site/LegalPage';
import { CONTACT_EMAIL } from '@/config';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Términos y condiciones de uso',
  description: 'Condiciones de uso del sitio web de FlightDev.',
  path: '/terminos',
});

export default function TermsPage() {
  return (
    <LegalPage title="Términos y condiciones de uso" path="/terminos" version="2026-11" pending={['razón social', 'NIT', 'revisión por asesor legal']}>
      <p>Estos términos regulan el uso del sitio web de FlightDev. Al navegarlo aceptas estas condiciones.</p>

      <h2>1. Información del sitio</h2>
      <p>La información sobre productos y servicios es descriptiva y puede cambiar. Las condiciones comerciales de cada producto o proyecto (alcance, precio, soporte, niveles de servicio) se definen en la propuesta o el contrato correspondiente, no en este sitio.</p>

      <h2>2. Simulaciones y esquemas</h2>
      <p>Algunas secciones muestran simulaciones animadas o esquemas conceptuales para explicar cómo funciona un producto. Están identificadas como tales y no son capturas de datos reales de clientes.</p>

      <h2>3. Propiedad intelectual</h2>
      <p>Las marcas FlightDev, Vendra y FleetTrack, los logotipos, textos, diseños y código de este sitio pertenecen a FlightDev o a sus titulares. No se permite su reproducción sin autorización.</p>

      <h2>4. Uso permitido</h2>
      <p>No está permitido usar el sitio o sus formularios para enviar información falsa, de terceros sin autorización, publicidad no solicitada o contenido malicioso, ni intentar acceder a sistemas o datos no públicos.</p>

      <h2>5. Responsabilidad</h2>
      <p>Procuramos que el sitio esté disponible y actualizado, pero no garantizamos que funcione sin interrupciones. Los enlaces a sitios de terceros se ofrecen como referencia y no implican responsabilidad sobre su contenido.</p>

      <h2>6. Datos personales</h2>
      <p>El tratamiento de datos se rige por nuestra <Link href="/politica-de-privacidad">política de tratamiento de datos personales</Link>.</p>

      <h2>7. Ley aplicable y contacto</h2>
      <p>Estos términos se rigen por las leyes de la República de Colombia. Para cualquier inquietud escribe a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </LegalPage>
  );
}
