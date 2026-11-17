import Link from 'next/link';
import LegalPage from '@/components/site/LegalPage';
import { CONTACT_EMAIL } from '@/config';
import { CONSENT_VERSION } from '@/lib/leads/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Política de tratamiento de datos personales',
  description: 'Cómo FlightDev recolecta, usa y protege tus datos personales conforme a la Ley 1581 de 2012, y cómo ejercer tus derechos como titular.',
  path: '/politica-de-privacidad',
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de tratamiento de datos personales" path="/politica-de-privacidad" version={CONSENT_VERSION}
      pending={['razón social', 'NIT', 'dirección de notificaciones', 'revisión por asesor legal']}>
      <p>Esta política explica cómo FlightDev trata los datos personales que recibe a través de este sitio web, en cumplimiento de la Ley 1581 de 2012, el Decreto 1074 de 2015 y demás normas colombianas sobre protección de datos personales.</p>

      <h2>1. Responsable del tratamiento</h2>
      <p><strong>FlightDev</strong>. Razón social y NIT: [pendiente]. Domicilio: Manizales, Caldas, Colombia. Dirección de notificaciones: [pendiente]. Correo para asuntos de datos personales: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>

      <h2>2. Datos que recolectamos</h2>
      <ul>
        <li><strong>Datos de contacto que tú nos das:</strong> nombre, apellido, empresa, cargo, correo electrónico, teléfono y el mensaje de tu solicitud.</li>
        <li><strong>Datos de tu solicitud:</strong> producto o servicio de interés, tipo de negocio y tamaño aproximado (puntos de venta, vehículos o conductores).</li>
        <li><strong>Datos de origen de la visita:</strong> fuente, medio y campaña (parámetros UTM), página de llegada y sitio de procedencia.</li>
        <li><strong>Datos técnicos de seguridad:</strong> una huella irreversible (hash) de tu dirección IP, usada solo para limitar envíos abusivos. No almacenamos la dirección IP.</li>
        <li><strong>Analítica:</strong> solo si la aceptas, datos de navegación agregados mediante Google Analytics. Consulta la <Link href="/politica-de-cookies">política de cookies</Link>.</li>
      </ul>
      <p>No solicitamos datos sensibles ni datos de niñas, niños o adolescentes.</p>

      <h2>3. Finalidades</h2>
      <ul>
        <li>Responder tu solicitud, coordinar demostraciones y hacer el seguimiento comercial de esa solicitud.</li>
        <li>Enviarte novedades y contenido de FlightDev, <strong>solo si lo autorizas</strong> de forma separada.</li>
        <li>Proteger el sitio contra spam y usos abusivos.</li>
        <li>Elaborar estadísticas agregadas sobre qué páginas y canales generan solicitudes.</li>
      </ul>

      <h2>4. Autorización</h2>
      <p>Al enviar un formulario marcas una casilla de autorización que no viene seleccionada por defecto. Guardamos la fecha, la hora y la versión de esta política que aceptaste, como prueba de la autorización.</p>

      <h2>5. Tus derechos como titular</h2>
      <ul>
        <li>Conocer, actualizar y rectificar tus datos.</li>
        <li>Solicitar prueba de la autorización otorgada.</li>
        <li>Ser informado sobre el uso que se ha dado a tus datos.</li>
        <li>Revocar la autorización y solicitar la supresión de tus datos cuando no exista un deber legal o contractual de conservarlos.</li>
        <li>Acceder gratuitamente a tus datos.</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio, después de haber agotado el trámite de consulta o reclamo ante FlightDev.</li>
      </ul>

      <h2>6. Cómo ejercer tus derechos</h2>
      <p>Escríbenos a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> indicando tu nombre, el correo con el que nos contactaste y tu solicitud.</p>
      <ul>
        <li><strong>Consultas:</strong> se responden en un máximo de diez (10) días hábiles, prorrogables por cinco (5) días hábiles más, informándote el motivo.</li>
        <li><strong>Reclamos</strong> (corrección, actualización, supresión o revocatoria): se atienden en un máximo de quince (15) días hábiles, prorrogables por ocho (8) días hábiles más, informándote el motivo.</li>
      </ul>
      <p>Si pides no recibir más comunicaciones comerciales, incluimos tu correo en una lista de exclusión para no volver a contactarte con ese fin.</p>

      <h2>7. Encargados y transferencias</h2>
      <p>Usamos proveedores de alojamiento web y de base de datos en la nube que pueden almacenar la información fuera de Colombia. Estos proveedores actúan como encargados y solo tratan los datos para prestarnos sus servicios, con medidas de seguridad adecuadas.</p>

      <h2>8. Seguridad y conservación</h2>
      <p>La información se guarda en una base de datos sin acceso público, protegida por control de acceso y cifrado en tránsito. Conservamos los datos mientras sean necesarios para las finalidades descritas o para cumplir obligaciones legales.</p>

      <h2>9. Vigencia</h2>
      <p>Esta política rige desde su publicación (versión {CONSENT_VERSION}). Si la cambiamos de forma sustancial, lo informaremos en este sitio y, cuando corresponda, pediremos una nueva autorización.</p>
    </LegalPage>
  );
}
