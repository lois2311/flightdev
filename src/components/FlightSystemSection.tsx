import SectionHead from './ui/SectionHead';
import { Boxes, Smartphone, Workflow, type LucideIcon } from 'lucide-react';

const MODULES: { n: string; title: string; icon: LucideIcon; items: string[] }[] = [
  { n: '01', title: 'PRODUCTOS DIGITALES & SAAS', icon: Boxes, items: ['Portales internos', 'SaaS transaccional', 'POS a la medida'] },
  { n: '02', title: 'MOTORES MÓVILES', icon: Smartphone, items: ['React Native y Expo', 'Sincronización offline', 'Hardware de escaneo'] },
  { n: '03', title: 'AUTOMATIZACIÓN & EVENTOS', icon: Workflow, items: ['APIs asíncronas', 'Colas de mensajería', 'Integraciones ERP/CRM'] },
];

export default function FlightSystemSection() {
  return (
    <section id="systems" className="relative overflow-hidden bg-noche pb-28 text-hueso md:pb-40">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(47,140,255,.16),transparent)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead eyebrow="SISTEMA DE VUELO // CONSOLA DE CAPACIDADES">TRES MÓDULOS. <span className="text-cielo">UNA CONSOLA.</span></SectionHead>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {MODULES.map(({ n, title, icon: Icon, items }) => (
            <article key={n} data-sys className="glass-vuelo group rounded-2xl p-7 transition-[transform,border-color] duration-300 will-change-transform hover:-translate-y-1 hover:border-cielo/40">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-cielo">{n}</span>
                <Icon size={20} className="text-hueso/50 transition-colors group-hover:text-cielo" aria-hidden="true" />
              </div>
              <h3 className="font-display mt-10 text-xl font-semibold leading-tight">{title}</h3>
              <ul className="mt-6 space-y-2 border-t border-borde pt-5 text-sm text-muted">
                {items.map(i => <li key={i} className="flex gap-2"><span className="font-mono text-cielo" aria-hidden="true">›</span>{i}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
