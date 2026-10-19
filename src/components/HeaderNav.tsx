import { useRef, useState } from 'react';
import PlaneMark from './PlaneMark';
import CtaInner from './ui/CtaInner';
import { useFrame } from '../lib/fx';

const LINKS = [
  ['#top', 'Inicio'],
  ['#vendra', 'Vendra'],
  ['#ag-clean-ops', 'AG Clean Ops'],
  ['#evolution', 'Cómo trabajamos'],
  ['#systems', 'Servicios'],
] as const;

/** Floating glass capsule: light over the hero, dark below it. A paper plane under it tracks page progress. */
export default function HeaderNav() {
  const [light, setLight] = useState(true);
  const [active, setActive] = useState('#top');
  const plane = useRef<SVGSVGElement>(null), fill = useRef<HTMLDivElement>(null);
  const last = useRef({ sy: 0, dir: 1 });

  useFrame(() => {
    const vh = innerHeight, sy = scrollY, se = document.documentElement;
    const p = Math.min(1, Math.max(0, sy / Math.max(1, se.scrollHeight - vh)));
    const d = sy - last.current.sy;
    if (Math.abs(d) > 0.5) last.current.dir = d < 0 ? -1 : 1;
    last.current.sy = sy;
    if (plane.current && fill.current) {
      plane.current.style.left = p * 100 + '%';
      plane.current.style.transform = `translateX(-7px) scaleX(${last.current.dir})`;
      fill.current.style.width = p * 100 + '%';
    }
    const hero = document.getElementById('top');
    if (hero) setLight(hero.getBoundingClientRect().bottom > 140);
    LINKS.forEach(([id]) => {
      const r = document.querySelector(id)?.getBoundingClientRect();
      if (r && r.top < vh * 0.45 && r.bottom > vh * 0.45) setActive(id);
    });
  });

  return (
    <header
      className="fixed inset-x-[clamp(12px,3vw,40px)] top-3 z-50 mx-auto flex max-w-[1280px] items-center justify-between gap-3 rounded-full border py-[7px] pl-5 pr-[7px] shadow-[0_14px_40px_-18px_rgba(5,12,26,.55)] backdrop-blur-[28px] backdrop-saturate-[1.6] transition-[background,color,border-color] duration-[400ms]"
      style={{ background: light ? 'rgba(255,255,255,.72)' : 'rgba(12,28,52,.78)', borderColor: light ? 'rgba(220,235,255,.9)' : 'rgba(47,140,255,.22)', color: light ? '#0C2340' : '#EEF2F7' }}
    >
      <a href="#top" aria-label="flightdev — inicio" className="flex items-center gap-2 text-inherit">
        <PlaneMark size={26} fold={light ? '#0C2340' : '#7DB8FF'} />
        <span className="font-display text-lg font-semibold">flightdev</span>
      </a>
      <nav aria-label="Secciones" className="hidden items-center gap-0.5 text-sm font-medium min-[1080px]:flex">
        {LINKS.map(([href, label]) => {
          const on = active === href;
          return (
            <a key={href} href={href} aria-current={on ? 'true' : undefined} className="rounded-full px-3.5 py-2 transition-[background,color] duration-300"
              style={{ color: on ? (light ? '#0C2340' : '#EEF2F7') : (light ? '#2B4060' : '#B6C4D8'), background: on ? (light ? 'rgba(12,35,64,.08)' : 'rgba(238,242,247,.1)') : 'transparent' }}>
              {label}
            </a>
          );
        })}
      </nav>
      <a href="#brief" data-magnet className="pill gap-2.5 bg-[linear-gradient(180deg,#4FA0FF,#2F8CFF)] py-[5px] pl-[18px] pr-[5px] text-[15px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.45),0_8px_20px_-8px_rgba(47,140,255,.8)]">
        <CtaInner label="Hablemos" shine="rgba(255,255,255,.45)" icon={15} arrowClass="size-[30px] bg-white text-cielo" />
      </a>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-7 -bottom-[11px] h-3">
        <div className="absolute inset-x-0 top-1.5 border-t border-dashed border-cielo/35" />
        <div ref={fill} className="absolute left-0 top-1.5 h-px w-0 bg-cielo" />
        <svg ref={plane} width="14" height="14" viewBox="0 0 100 100" className="absolute left-0 top-0 transition-transform duration-[350ms]">
          <polygon points="4,50 96,8 40,64" fill="#2F8CFF" /><polygon points="40,64 96,8 54,94" fill="#7DB8FF" />
        </svg>
      </div>
    </header>
  );
}
