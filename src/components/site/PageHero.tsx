import type { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';
import Terrain from '../art/Terrain';
import type { Crumb } from '@/lib/seo';

/** Stable seed per route: every page flies over its own stretch of mountains. */
const seedOf = (s: string) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;

/** Inner-page opening: breadcrumbs, the page's single H1, a lead paragraph, up to two actions, and the route's terrain. */
export default function PageHero({ crumbs, eyebrow, title, lead, actions, aside, stroke }: {
  crumbs: Crumb[]; eyebrow?: string; title: ReactNode; lead: string; actions?: ReactNode; aside?: ReactNode;
  /** Terrain stroke; product pages pass their own accent. */
  stroke?: string;
}) {
  const path = crumbs.at(-1)?.path ?? '/';
  return (
    <section className="gutter relative overflow-hidden bg-noche pb-[clamp(150px,17vw,240px)] pt-32 sm:pt-36">
      <Terrain seed={seedOf(path)} lines={14} height={240} stroke={stroke} className="absolute inset-x-0 bottom-0 h-[clamp(130px,16vw,230px)]" />
      <div className="relative mx-auto flex max-w-[1280px] flex-wrap items-end gap-x-16 gap-y-12">
        <div className="flex min-w-0 flex-[1_1_620px] flex-col gap-6">
          <Breadcrumbs items={crumbs} />
          {eyebrow && <p className="eyebrow text-cielo-claro">{eyebrow}</p>}
          <h1 className="m-0 max-w-[18ch] font-display text-[clamp(2.4rem,5.4vw,4.8rem)] font-bold leading-[.98] tracking-[-.01em] text-hueso [text-wrap:balance]">{title}</h1>
          <p className="m-0 max-w-[60ch] text-[clamp(16px,1.3vw,19px)] leading-[1.6] text-niebla [text-wrap:pretty]">{lead}</p>
          {actions && <div className="flex flex-wrap items-center gap-3 pt-2">{actions}</div>}
        </div>
        {aside && <div className="min-w-0 flex-[1_1_360px]">{aside}</div>}
      </div>
    </section>
  );
}
