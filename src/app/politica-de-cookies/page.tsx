import Link from 'next/link';
import LegalPage from '@/components/site/LegalPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Política de cookies',
  description: 'Qué cookies y almacenamiento local usa el sitio de FlightDev, para qué sirven y cómo aceptar o rechazar la analítica.',
  path: '/politica-de-cookies',
});

export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies" path="/politica-de-cookies" version="2026-11" pending={['revisión por asesor legal']}>
      <p>Este sitio usa la menor cantidad posible de almacenamiento en tu navegador. La analítica solo se activa si la aceptas.</p>

      <h2>Almacenamiento necesario</h2>
      <ul>
        <li><strong>Preferencia de cookies</strong> (almacenamiento local, <code>fd_cookie_consent</code>): recuerda si aceptaste o rechazaste la analítica.</li>
        <li><strong>Origen de la visita</strong> (almacenamiento de sesión, <code>fd_attribution</code>): guarda la fuente y la página de llegada de tu visita para adjuntarlas a tu solicitud si envías un formulario. Se borra al cerrar el navegador.</li>
      </ul>

      <h2>Analítica (opcional)</h2>
      <p>Si la aceptas, usamos Google Analytics 4 para medir de forma agregada qué páginas se visitan y qué acciones se realizan. No enviamos a Google tu nombre, correo, teléfono ni el contenido de los formularios. Google establece sus propias cookies (por ejemplo, <code>_ga</code>).</p>

      <h2>Cómo cambiar tu decisión</h2>
      <p>Puedes cambiar tu elección en cualquier momento desde el enlace «Preferencias de cookies» al final de cada página, o borrando los datos del sitio en tu navegador.</p>
      <p>Consulta también la <Link href="/politica-de-privacidad">política de tratamiento de datos personales</Link>.</p>
    </LegalPage>
  );
}
