import { useId } from 'react';

/** Official Flight Dev symbol: two facets (wing + fold). The 25° climb is in the coordinates — do not rotate. */
export default function PlaneMark({ size, className, wing = '#2F8CFF', fold = '#0C2340', crease = false }: { size?: number; className?: string; wing?: string; fold?: string; crease?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <polygon points="4,50 96,8 40,64" fill={wing} />
      <polygon points="40,64 96,8 54,94" fill={fold} />
      {crease && <line x1="40" y1="64" x2="96" y2="8" stroke="#fff" strokeOpacity=".6" strokeWidth="1" />}
    </svg>
  );
}

/** Lit version of the mark for the large hero / ascent planes: gradient facets, wing shadow, white crease. */
export function GradientPlane({ wing, fold, shade, crease = 0.7 }: { wing: [string, string]; fold: [string, string]; shade?: number; crease?: number }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className="block w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}w`} x1="4" y1="50" x2="96" y2="8" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={wing[0]} /><stop offset="1" stopColor={wing[1]} /></linearGradient>
        <linearGradient id={`${id}f`} x1="54" y1="94" x2="76" y2="28" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={fold[0]} /><stop offset="1" stopColor={fold[1]} /></linearGradient>
        {shade && <linearGradient id={`${id}s`} x1="22" y1="40" x2="40" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0C2340" stopOpacity="0" /><stop offset="1" stopColor="#0C2340" stopOpacity={shade} /></linearGradient>}
      </defs>
      <polygon points="4,50 96,8 40,64" fill={`url(#${id}w)`} />
      {shade && <polygon points="24,48 96,8 40,64" fill={`url(#${id}s)`} />}
      <polygon points="40,64 96,8 54,94" fill={`url(#${id}f)`} />
      <line x1="40" y1="64" x2="96" y2="8" stroke="#fff" strokeOpacity={crease} strokeWidth=".8" />
    </svg>
  );
}
