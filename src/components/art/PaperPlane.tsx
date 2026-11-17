import { useId } from 'react';

/**
 * Hero paper plane. The tour drives attitude through CSS custom properties on this element or an ancestor
 * (no React re-render per frame): --bank (deg, roll), --pitch (deg), --alt (0..1, height above the ground shadow).
 * Purely decorative: always aria-hidden. Size comes from className (width; height follows the square viewBox).
 * Same silhouette and 25 deg climb as PlaneMark, split into four facets lit from the northwest like the terrain hillshade.
 */
export type PaperPlaneProps = { tone?: 'day' | 'night'; contrail?: boolean; shadow?: boolean; className?: string };

type Facet = { key: string; pts: string; axis: [number, number, number, number] };
// Light falls NW to SE, so every shading axis runs perpendicular to its fold, away from the lit edge.
const FACETS: Facet[] = [
  { key: 'wingA', pts: '4,50 96,8 22,57', axis: [50, 29, 58, 47] }, // near wing, lit leading strip
  { key: 'wingB', pts: '22,57 96,8 40,64', axis: [50, 36, 56, 56] }, // near wing, downturned flap
  { key: 'far', pts: '40,64 96,8 47,79', axis: [60, 48, 78, 66] }, // far wing, tilted away from the light
  { key: 'keel', pts: '47,79 96,8 54,94', axis: [60, 60, 66, 86] }, // underside of the keel fold
];

// Paper is solid base colour; shading is the same hue family laid over it, so every stop is a project token.
type Shade = { base: string; shade: string; from: number; to: number };
const T = (n: string) => `var(--color-${n})`;
const PALETTE: Record<'day' | 'night', { facets: Record<string, Shade>; rim: string; crease: string; trail: string; outline: number }> = {
  day: {
    facets: {
      wingA: { base: T('nube'), shade: T('horizonte'), from: 0, to: 0.85 },
      wingB: { base: T('horizonte'), shade: T('cielo-claro'), from: 0, to: 0.8 },
      far: { base: T('cielo'), shade: T('vuelo'), from: 0, to: 0.8 },
      keel: { base: T('vuelo'), shade: T('noche'), from: 0, to: 0.8 },
    },
    rim: T('vuelo'), crease: T('nube'), trail: T('cielo'), outline: 0.28, // outline keeps white paper readable on nube
  },
  night: {
    facets: {
      wingA: { base: T('vuelo'), shade: T('cielo'), from: 0.6, to: 0.05 },
      wingB: { base: T('vuelo'), shade: T('cielo'), from: 0.24, to: 0 },
      far: { base: T('noche'), shade: T('cielo'), from: 0.26, to: 0 },
      keel: { base: T('noche'), shade: T('vuelo'), from: 0.9, to: 0.2 },
    },
    rim: T('cielo-claro'), crease: T('cielo-claro'), trail: T('cielo-claro'), outline: 0,
  },
};

// Wingtip trails run back along the flight line (opposite of the nose vector 92,-42).
const TRAILS = [{ x1: 4, y1: 50, x2: -69, y2: 83 }, { x1: 54, y1: 94, x2: -19, y2: 127 }];

export default function PaperPlane({ tone = 'day', contrail = false, shadow = false, className = '' }: PaperPlaneProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const p = PALETTE[tone];
  const gid = (k: string) => `pp${uid}${k}`;

  return (
    <div aria-hidden="true" className={`pp pp-${tone} ${className}`}>
      {shadow && <span className="pp-shadow" />}
      <div className="pp-body">
        <svg viewBox="0 0 100 100" className="pp-art" focusable="false">
          <defs>
            {FACETS.map(({ key, axis: [x1, y1, x2, y2] }) => (
              <linearGradient key={key} id={gid(key)} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
                <stop offset="0" style={{ stopColor: p.facets[key].shade }} stopOpacity={p.facets[key].from} />
                <stop offset="1" style={{ stopColor: p.facets[key].shade }} stopOpacity={p.facets[key].to} />
              </linearGradient>
            ))}
            <linearGradient id={gid('rim')} gradientUnits="userSpaceOnUse" x1="4" y1="50" x2="96" y2="8">
              <stop offset="0" style={{ stopColor: p.rim }} stopOpacity=".15" />
              <stop offset="1" style={{ stopColor: p.rim }} stopOpacity=".95" />
            </linearGradient>
            {TRAILS.map((t, i) => (
              <linearGradient key={i} id={gid(`t${i}`)} gradientUnits="userSpaceOnUse" x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}>
                <stop offset="0" style={{ stopColor: p.trail }} stopOpacity=".6" />
                <stop offset="1" style={{ stopColor: p.trail }} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {contrail && TRAILS.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={`url(#${gid(`t${i}`)})`} strokeWidth="1.1" strokeLinecap="round" />
          ))}

          {FACETS.map(({ key, pts }) => (
            <g key={key}>
              <polygon points={pts} style={{ fill: p.facets[key].base }} />
              <polygon points={pts} fill={`url(#${gid(key)})`} />
            </g>
          ))}

          {p.outline > 0 && <polygon points="4,50 96,8 54,94 40,64" fill="none" style={{ stroke: p.rim }} strokeOpacity={p.outline} strokeWidth=".7" strokeLinejoin="round" />}
          {/* Crease highlight along the centre fold, and (night) a lit leading edge. */}
          <line x1="40" y1="64" x2="96" y2="8" style={{ stroke: p.crease }} strokeOpacity=".8" strokeWidth=".8" strokeLinecap="round" />
          {tone === 'night' && <line x1="4" y1="50" x2="96" y2="8" stroke={`url(#${gid('rim')})`} strokeWidth=".9" strokeLinecap="round" />}
        </svg>
      </div>
    </div>
  );
}
