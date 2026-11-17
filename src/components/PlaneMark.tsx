/**
 * Official Flight Dev symbol: wing + fold, each split by a crease so the paper has volume (lit NW, like the terrain).
 * The 25° climb is in the coordinates, do not rotate. Facet shading is a white/ink overlay on `wing` and `fold`,
 * so any caller colour pair keeps working. No hairlines: every facet must survive at 16px.
 */
export default function PlaneMark({ size, className, wing = '#2F8CFF', fold = '#0C2340', crease = false }: { size?: number; className?: string; wing?: string; fold?: string; crease?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <polygon points="4,50 96,8 40,64" fill={wing} />
      <polygon points="4,50 96,8 22,57" fill="#fff" fillOpacity=".26" />
      <polygon points="22,57 96,8 40,64" fill="#0A1428" fillOpacity=".14" />
      <polygon points="40,64 96,8 54,94" fill={fold} />
      <polygon points="40,64 96,8 47,79" fill="#fff" fillOpacity=".14" />
      <polygon points="47,79 96,8 54,94" fill="#0A1428" fillOpacity=".3" />
      {crease && <line x1="40" y1="64" x2="96" y2="8" stroke="#fff" strokeOpacity=".6" strokeWidth="1" />}
    </svg>
  );
}
