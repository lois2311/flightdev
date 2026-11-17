'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import PlaneMark from '../PlaneMark';
import { useFrame } from '@/lib/fx';

const PRODUCTS = [
  { href: '/productos/vendra', name: 'Vendra POS', text: 'Punto de venta y caja para comercios', code: 'FD-01', bar: 'bg-voltaje' },
  { href: '/productos/fleettrack', name: 'FleetTrack Pro', text: 'Gestión de flotas y transporte', code: 'FD-02', bar: 'bg-cielo' },
  { href: '/productos', name: 'Todo el portafolio', text: 'Productos y servicios de FlightDev' },
];
const SERVICES = [
  { href: '/servicios/desarrollo-software', name: 'Desarrollo de software' },
  { href: '/servicios/automatizacion', name: 'Automatización e integraciones' },
];
const LINKS = [
  { href: '/soluciones', label: 'Soluciones' },
  { href: '/casos-de-exito', label: 'Casos' },
  { href: '/recursos', label: 'Recursos' },
  { href: '/nosotros', label: 'Nosotros' },
];

type Menu = 'closed' | 'products' | 'mobile';

/** Flat full-width nav. A paper plane on the dashed line under it tracks reading progress. */
export default function SiteHeader() {
  const path = usePathname();
  const [menu, setMenu] = useState<{ path: string; open: Menu }>({ path, open: 'closed' });
  // Menus close on navigation: state from a previous route is ignored instead of reset in an effect.
  const open: Menu = menu.path === path ? menu.open : 'closed';
  const toggle = (m: Menu) => setMenu({ path, open: open === m ? 'closed' : m });
  const close = () => setMenu({ path, open: 'closed' });

  const plane = useRef<SVGSVGElement>(null), fill = useRef<HTMLDivElement>(null), productsRef = useRef<HTMLDivElement>(null);
  const productsBtn = useRef<HTMLButtonElement>(null), mobileBtn = useRef<HTMLButtonElement>(null);
  const last = useRef({ sy: 0, dir: 1 });

  useEffect(() => {
    if (open === 'closed') return;
    // Escape unmounts the panel; focus goes back to its toggle instead of dropping to <body>.
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenu({ path, open: 'closed' });
      (open === 'products' ? productsBtn : mobileBtn).current?.focus();
    };
    const click = (e: MouseEvent) => { if (open === 'products' && !productsRef.current?.contains(e.target as Node)) setMenu({ path, open: 'closed' }); };
    document.addEventListener('keydown', key);
    document.addEventListener('click', click);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('click', click); };
  }, [open, path]);

  useFrame(() => {
    const sy = scrollY, p = Math.min(1, Math.max(0, sy / Math.max(1, document.documentElement.scrollHeight - innerHeight)));
    const d = sy - last.current.sy;
    if (Math.abs(d) > 0.5) last.current.dir = d < 0 ? -1 : 1;
    last.current.sy = sy;
    if (plane.current && fill.current) {
      plane.current.style.left = p * 100 + '%';
      plane.current.style.transform = `translateX(-7px) scaleX(${last.current.dir})`;
      fill.current.style.width = p * 100 + '%';
    }
  });

  const on = (href: string) => path === href || path.startsWith(href + '/');
  const linkCls = (active: boolean) => `px-3 py-2 transition-colors duration-200 ${active ? 'text-hueso underline decoration-cielo decoration-2 underline-offset-[10px]' : 'text-niebla hover:text-hueso'}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-borde bg-noche">
      <div className="gutter relative mx-auto flex h-16 max-w-[1408px] items-center justify-between gap-3 text-hueso">
        <Link href="/" aria-label="FlightDev, inicio" className="flex items-center gap-2 text-inherit">
          <PlaneMark size={26} fold="#7DB8FF" />
          <span className="font-display text-lg font-semibold">flightdev</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-0.5 text-sm font-medium min-[1080px]:flex">
          <div ref={productsRef} className="relative">
            <button ref={productsBtn} type="button" aria-expanded={open === 'products'} aria-controls="nav-products" onClick={() => toggle('products')}
              className={`flex cursor-pointer items-center gap-1 ${linkCls(on('/productos'))}`}>
              Productos <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${open === 'products' ? 'rotate-180' : ''}`} />
            </button>
            {open === 'products' && (
              <div id="nav-products" className="absolute left-0 top-[calc(100%+14px)] w-[540px] overflow-hidden rounded-[3px] border border-borde bg-superficie">
                <ul className="m-0 grid list-none grid-cols-2 gap-px bg-borde p-0">
                  {PRODUCTS.slice(0, 2).map(p => (
                    <li key={p.href}>
                      <Link href={p.href} onClick={close} aria-current={on(p.href) ? 'page' : undefined} className="relative flex h-full flex-col gap-2 bg-superficie p-4 pt-5 transition-colors hover:bg-vuelo">
                        <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${p.bar}`} />
                        <span className="font-mono text-[10px] tracking-[.14em] text-muted">{p.code}</span>
                        <span className="font-display text-lg font-semibold text-hueso">{p.name}</span>
                        <span className="text-[13px] leading-snug text-muted">{p.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between gap-4 border-t border-borde px-5 py-3 text-[13px]">
                  <span className="flex gap-4">
                    {SERVICES.map(sv => <Link key={sv.href} href={sv.href} onClick={close} className="text-niebla hover:text-hueso">{sv.name}</Link>)}
                  </span>
                  <Link href="/productos" onClick={close} className="whitespace-nowrap font-semibold text-cielo-claro hover:underline">Portafolio</Link>
                </div>
              </div>
            )}
          </div>
          {LINKS.map(l => <Link key={l.href} href={l.href} aria-current={on(l.href) ? 'page' : undefined} className={linkCls(on(l.href))}>{l.label}</Link>)}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contacto" data-track="click_contact" data-track-label="header" className="btn min-h-10 bg-voltaje px-4 text-noche hover:bg-voltaje-hover">
            Hablemos
          </Link>
          <button ref={mobileBtn} type="button" aria-expanded={open === 'mobile'} aria-controls="nav-mobile" aria-label={open === 'mobile' ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => toggle('mobile')}
            className="grid size-10 cursor-pointer place-items-center rounded-[3px] border border-borde text-hueso min-[1080px]:hidden">
            {open === 'mobile' ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-[7px] h-3">
          <div className="absolute inset-x-0 top-1.5 border-t border-dashed border-cielo/35" />
          <div ref={fill} className="absolute left-0 top-1.5 h-px w-0 bg-cielo" />
          <svg ref={plane} width="14" height="14" viewBox="0 0 100 100" className="absolute left-0 top-0 transition-transform duration-[350ms]">
            <polygon points="4,50 96,8 40,64" fill="#2F8CFF" /><polygon points="40,64 96,8 54,94" fill="#7DB8FF" />
          </svg>
        </div>
      </div>

      {open === 'mobile' && (
        <nav id="nav-mobile" aria-label="Principal móvil" className="max-h-[calc(100svh-64px)] overflow-y-auto border-t border-borde bg-noche p-3 min-[1080px]:hidden">
          <p className="m-0 px-4 pb-1 pt-2 font-mono text-[11px] tracking-[.12em] text-muted">PRODUCTOS</p>
          {PRODUCTS.map(p => (
            <Link key={p.href} href={p.href} onClick={close} className="flex flex-col px-4 py-3 hover:bg-superficie">
              <span className="font-semibold">{p.name}</span><span className="text-[13px] text-muted">{p.text}</span>
            </Link>
          ))}
          <div className="my-2 border-t border-borde" />
          {LINKS.map(l => <Link key={l.href} href={l.href} onClick={close} className="block px-4 py-3 font-semibold hover:bg-superficie">{l.label}</Link>)}
          <Link href="/contacto" onClick={close} className="mt-2 block rounded-[3px] bg-voltaje px-4 py-3.5 text-center font-semibold text-noche">Habla con nuestro equipo</Link>
        </nav>
      )}
    </header>
  );
}
