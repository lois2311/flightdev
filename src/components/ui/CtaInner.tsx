import { ArrowDown, ArrowRight } from 'lucide-react';

/** Inside of a [data-magnet] pill: optional light sweep, label, and the arrow disc that cycles on hover (see usePointerFx). */
export default function CtaInner({ label, arrowClass, shine, down = false, icon = 16 }: { label: string; arrowClass: string; shine?: string; down?: boolean; icon?: number }) {
  const Icon = down ? ArrowDown : ArrowRight;
  return (
    <>
      {shine && <span data-shine aria-hidden="true" className="pointer-events-none absolute inset-0 -translate-x-[120%]" style={{ background: `linear-gradient(105deg,transparent 35%,${shine} 50%,transparent 65%)` }} />}
      <span className="relative">{label}</span>
      <span data-arrow data-dir={down ? 'down' : undefined} aria-hidden="true" className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full ${arrowClass}`}>
        <Icon size={icon} strokeWidth={2.2} />
      </span>
    </>
  );
}
