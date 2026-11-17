import type { ReactNode } from 'react';

export type WaypointRef = { id: string; code: string; name: string };

const TONE = { noche: 'bg-noche', vuelo: 'bg-vuelo' } as const;

/**
 * One leg of the home flight plan: a section that opens with its waypoint (code, name, link to the next one)
 * and carries the dashed route down the left gutter. The heading inside must use id `${id}-t`.
 * `data-waypoint` feeds the header's route (SiteHeader), so the reader always sees where they are.
 */
export default function Leg({ id, code, name, next, tone = 'noche', className = '', children }: WaypointRef & {
  next?: WaypointRef; tone?: keyof typeof TONE; className?: string; children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} data-waypoint={`${code} · ${name}`} className={`leg gutter relative border-t border-borde ${TONE[tone]} ${className}`}>
      <span aria-hidden="true" className="leg-stem" />
      <div className="relative mx-auto flex max-w-[1280px] flex-col">
        <div className="relative mb-[clamp(40px,6vw,72px)] flex items-center gap-3 font-mono text-[11px] tracking-[.14em] text-muted">
          <span aria-hidden="true" className="leg-diamond" />
          <span className="text-cielo-claro">{code}</span>
          <span>{name}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-borde" />
          {next && <a href={`#${next.id}`} className="whitespace-nowrap transition-colors hover:text-hueso max-sm:hidden">SIGUIENTE · {next.code} {next.name}</a>}
        </div>
        {children}
      </div>
    </section>
  );
}
