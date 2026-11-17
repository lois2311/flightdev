import Link from 'next/link';
import type { AnalyticsEvent } from '@/lib/analytics';

// Lime (voltaje) is reserved for the primary commercial action on each screen; everything else is quieter.
const VARIANTS = {
  primary: 'bg-voltaje text-noche hover:bg-voltaje-hover',
  secondary: 'border border-borde text-hueso hover:border-cielo-claro',
  navy: 'bg-vuelo text-nube hover:bg-superficie',
  paper: 'border border-vuelo/30 text-vuelo hover:border-vuelo',
} as const;

export default function Cta({ href, label, variant = 'primary', track = 'cta_click', product }: {
  href: string; label: string; variant?: keyof typeof VARIANTS; track?: AnalyticsEvent; product?: string;
}) {
  const cls = `btn ${VARIANTS[variant]}`;
  const data = { 'data-track': track, 'data-track-label': label, 'data-product': product };
  return href.startsWith('http')
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...data}>{label}</a>
    : <Link href={href} className={cls} {...data}>{label}</Link>;
}
