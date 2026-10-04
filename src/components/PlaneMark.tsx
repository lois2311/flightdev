/** Official Flight Dev symbol: two facets (wing + fold). The 25° climb is in the coordinates — do not rotate. */
export default function PlaneMark({ size = 24, className = '', wing = '#2F8CFF', fold = '#0C2340', edge }: { size?: number; className?: string; wing?: string; fold?: string; edge?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <polygon points="4,50 96,8 40,64" fill={wing} />
      <polygon points="40,64 96,8 54,94" fill={fold} stroke={edge} strokeWidth={edge ? 3 : 0} strokeLinejoin="round" />
    </svg>
  );
}
