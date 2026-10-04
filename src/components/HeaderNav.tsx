import { useLayoutEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PlaneMark from './PlaneMark';

const LINKS = [['#top', '01 Productos'], ['#vendra', '02 Vendra (Caso)'], ['#evolution', '03 Proceso'], ['#systems', '04 Sistema de Vuelo']] as const;

/** Floating Aero-Glass capsule: daylight glass over the sky, dark glass over the cockpit; marks the chapter in view. */
export default function HeaderNav() {
  const [tone, setTone] = useState<'light' | 'dark'>('light');
  const [active, setActive] = useState('#top');

  useLayoutEffect(() => {
    const sky = ScrollTrigger.create({ trigger: '#top', start: 'top 40px', end: 'bottom 40px', onToggle: s => setTone(s.isActive ? 'light' : 'dark') });
    const chapters = LINKS.map(([id]) => ScrollTrigger.create({ trigger: id, start: 'top 55%', end: 'bottom 55%', onToggle: s => s.isActive && setActive(id) }));
    return () => { sky.kill(); chapters.forEach(c => c.kill()); };
  }, []);

  return (
    <header data-tone={tone} className="hud fixed inset-x-3 top-3 z-50 mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full py-2 pl-5 pr-2 md:inset-x-6">
      <a href="#top" className="flex items-center gap-2" aria-label="flightdev — inicio">
        <PlaneMark size={26} fold={tone === 'light' ? '#0C2340' : '#7DB8FF'} />
        <span className="font-display text-lg font-semibold lowercase">flightdev</span>
      </a>
      <nav aria-label="Secciones" className="hidden items-center gap-1 font-mono text-xs lg:flex">
        {LINKS.map(([id, label]) => (
          <a key={id} href={id} aria-current={active === id ? 'true' : undefined} className="rounded-full px-3 py-1.5 text-[color:var(--hud-muted)] transition-colors hover:text-[color:var(--hud-ink)] aria-[current]:bg-current/10 aria-[current]:text-[color:var(--hud-ink)]">{label}</a>
        ))}
      </nav>
      <a href="#brief" className="btn-glass inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-semibold">
        [ Iniciar Vuelo <ArrowRight size={14} aria-hidden="true" /> ]
      </a>
    </header>
  );
}
