import Link from 'next/link';
import PlaneMark from '../PlaneMark';
import Terrain from '../art/Terrain';
import CookiePreferencesButton from './CookiePreferencesButton';
import { CONTACT_EMAIL, GA_ID } from '@/config';

const COLUMNS = [
  { title: 'Productos', links: [['/productos/vendra', 'Vendra POS'], ['/productos/fleettrack', 'FleetTrack Pro'], ['/productos', 'Portafolio']] },
  { title: 'Servicios', links: [['/servicios/desarrollo-software', 'Desarrollo de software'], ['/servicios/automatizacion', 'Automatización e integraciones'], ['/soluciones', 'Soluciones']] },
  { title: 'Empresa', links: [['/nosotros', 'Nosotros'], ['/casos-de-exito', 'Casos de éxito'], ['/contacto', 'Contacto']] },
  { title: 'Recursos', links: [['/blog', 'Blog'], ['/recursos', 'Centro de recursos']] },
] as const;

export default function SiteFooter() {
  return (
    <footer className="gutter relative overflow-hidden border-t border-borde bg-[#081122] pb-10 pt-20 text-sm text-muted">
      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-14">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="flex max-w-[340px] flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 text-hueso">
              <PlaneMark size={24} fold="#7DB8FF" /><span className="font-display text-lg font-semibold">flightdev</span>
            </Link>
            <p className="m-0 leading-relaxed">Empresa de tecnología de Manizales, Colombia. Construimos productos SaaS y software empresarial para operar mejor.</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="w-fit text-cielo-claro underline-offset-4 hover:underline">{CONTACT_EMAIL}</a>
          </div>
          <nav aria-label="Pie de página" className="grid flex-1 grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:max-w-[760px]">
            {COLUMNS.map(c => (
              <div key={c.title} className="flex flex-col gap-3">
                <p className="m-0 font-mono text-[11px] tracking-[.12em] text-niebla">{c.title.toUpperCase()}</p>
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                  {c.links.map(([href, label]) => <li key={href}><Link href={href} className="hover:text-hueso">{label}</Link></li>)}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div aria-hidden="true" className="relative -mx-[clamp(20px,5vw,64px)] h-[clamp(90px,12vw,160px)] overflow-hidden">
          <Terrain seed={77} lines={12} height={200} fill="#081122" className="absolute inset-0" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-borde pt-6 text-[13px]">
          <span>© {new Date().getFullYear()} FlightDev · Manizales, Colombia · <span className="font-mono text-[11px] tracking-[.1em]">05°04′N 75°31′W</span></span>
          <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
            <li><Link href="/politica-de-privacidad" className="hover:text-hueso">Política de privacidad</Link></li>
            <li><Link href="/politica-de-cookies" className="hover:text-hueso">Cookies</Link></li>
            <li><Link href="/terminos" className="hover:text-hueso">Términos</Link></li>
            {GA_ID && <li><CookiePreferencesButton /></li>}
          </ul>
        </div>
      </div>
    </footer>
  );
}
