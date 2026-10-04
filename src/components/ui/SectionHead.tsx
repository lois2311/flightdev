import type { ReactNode } from 'react';

/** Eyebrow + oversized heading shared by every chapter. `tone` picks the eyebrow colour; `fly` tags the plane's anchor. */
export default function SectionHead({ eyebrow, tone = 'cielo', fly, size = 'md', children }: {
  eyebrow: string; tone?: 'cielo' | 'voltaje'; fly?: string; size?: 'md' | 'lg'; children: ReactNode;
}) {
  return (
    <>
      <p data-fly={fly} className={`font-mono text-xs tracking-widest ${tone === 'voltaje' ? 'text-voltaje' : 'text-cielo'}`}>{eyebrow}</p>
      <h2 className={`font-display mt-4 max-w-4xl font-bold ${size === 'lg' ? 'text-[clamp(2rem,5.4vw,4.6rem)] leading-[1]' : 'text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.02]'}`}>{children}</h2>
    </>
  );
}
