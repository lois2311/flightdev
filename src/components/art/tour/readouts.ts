import type { Flight } from './camera';

type Key = 'ground' | 'bearing' | 'remaining';
export type Readouts = Partial<Record<Key, HTMLElement>>;

/** Instrument cells inside a stop: <dd data-tour-readout="ground|bearing|remaining">. Found once, written by reference. */
export const findReadouts = (el: HTMLElement): Readouts =>
  Object.fromEntries((['ground', 'bearing', 'remaining'] as const).flatMap(k => {
    const n = el.querySelector<HTMLElement>(`[data-tour-readout=${k}]`);
    return n ? [[k, n]] : [];
  }));

/** Real values only: terrain from the SRTM heightmap under the plane, bearing and distance from the route geometry. */
export const format = (f: Flight): Record<Key, string> => ({
  ground: `${Math.round(f.ground)} M`,
  bearing: `${String(Math.round(f.bearing) % 360).padStart(3, '0')}°`,
  remaining: `${f.remaining.toFixed(1).replace('.', ',')} KM`,
});

export function write(r: Readouts, f: Flight) {
  const v = format(f);
  for (const k of Object.keys(r) as Key[]) {
    const n = r[k];
    if (n && n.textContent !== v[k]) n.textContent = v[k];
  }
}
