import Link from 'next/link';
import CtaInner from './CtaInner';
import type { AnalyticsEvent } from '@/lib/analytics';

// Lime (voltaje) is reserved for the primary commercial action on each screen; everything else is quieter.
const VARIANTS = {
  primary: { cls: 'bg-[linear-gradient(180deg,#C8EC83,#B4E854)] text-noche shadow-[inset_0_1px_0_rgba(255,255,255,.55),0_14px_34px_-14px_rgba(180,232,84,.6)] active:brightness-95', arrow: 'size-9 bg-noche text-voltaje', shine: 'rgba(255,255,255,.6)' },
  secondary: { cls: 'border border-white/15 bg-white/[.04] text-hueso hover:border-cielo-claro/50 active:bg-white/[.08]', arrow: 'size-9 border border-white/15 bg-white/5 text-hueso', shine: undefined },
  navy: { cls: 'bg-[linear-gradient(180deg,#17395F,#0C2340)] text-nube shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_16px_32px_-14px_rgba(12,35,64,.7)] active:brightness-110', arrow: 'size-9 bg-cielo text-white', shine: 'rgba(255,255,255,.22)' },
  paper: { cls: 'border border-vuelo/15 bg-white/80 text-vuelo shadow-[inset_0_1px_0_#FFFFFF,0_10px_24px_-14px_rgba(12,35,64,.35)] active:bg-white', arrow: 'size-9 border border-vuelo/12 bg-white text-vuelo', shine: undefined },
} as const;

export default function Cta({ href, label, variant = 'primary', track = 'cta_click', product, down = false }: {
  href: string; label: string; variant?: keyof typeof VARIANTS; track?: AnalyticsEvent; product?: string; down?: boolean;
}) {
  const v = VARIANTS[variant];
  const cls = `pill gap-3 py-1.5 pl-5 pr-1.5 text-[15px] ${v.cls}`;
  const inner = <CtaInner label={label} shine={v.shine} down={down} arrowClass={v.arrow} />;
  const data = { 'data-magnet': '', 'data-track': track, 'data-track-label': label, 'data-product': product };
  return href.startsWith('http')
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...data}>{inner}</a>
    : <Link href={href} className={cls} {...data}>{inner}</Link>;
}
