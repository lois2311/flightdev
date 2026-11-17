import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { DEM, elevation } from '../terrain-gl';
import { flightAt } from './camera';
import { APPROACH_KM, LEAD_KM, buildRoute, stopRanges } from './route';

// The real heightmap: 8-bit RGB PNG, R = high byte, G = low byte. Minimal decoder (filters 0-4) so the test needs no image library.
function heightmap() {
  const b = readFileSync(join(process.cwd(), 'public', DEM.url));
  const idat: Buffer[] = [];
  for (let p = 8; p < b.length;) {
    const len = b.readUInt32BE(p), type = b.toString('latin1', p + 4, p + 8);
    if (type === 'IDAT') idat.push(b.subarray(p + 8, p + 8 + len));
    p += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat)), stride = DEM.size * 3, px = Buffer.alloc(DEM.size * stride);
  for (let y = 0; y < DEM.size; y++) {
    const f = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const r = raw[y * (stride + 1) + 1 + x], a = x >= 3 ? px[y * stride + x - 3] : 0, u = y ? px[(y - 1) * stride + x] : 0, c = x >= 3 && y ? px[(y - 1) * stride + x - 3] : 0;
      const pa = Math.abs(a + u - c - a), pb = Math.abs(a + u - c - u), pc = Math.abs(a + u - c - c);
      px[y * stride + x] = (r + [0, a, u, (a + u) >> 1, pa <= pb && pa <= pc ? a : pb <= pc ? u : c][f]) & 255;
    }
  }
  return Uint16Array.from({ length: DEM.size * DEM.size }, (_, i) => px[i * 3] * 256 + px[i * 3 + 1]);
}

describe('flight route', () => {
  const route = buildRoute(), hm = heightmap();

  it('runs from Manizales to the Nevado del Ruiz and the camera stops short of the summit', () => {
    const [mu, mv] = DEM.places.manizales, [ru, rv] = DEM.places.ruiz, s = route.at(0), e = route.at(route.length);
    expect(Math.hypot(s[0] - mu, s[1] - mv) * DEM.widthKm).toBeLessThan(0.05);
    expect(Math.hypot(e[0] - ru, e[1] - rv) * DEM.widthKm).toBeLessThan(0.05);
    expect(route.end).toBeCloseTo(route.length - APPROACH_KM);
    expect(route.start).toBe(-LEAD_KM);
  });

  it('flies at constant speed: equal km steps cover equal distance', () => {
    const step = (k: number) => { const a = route.at(k), b = route.at(k + 1); return Math.hypot(a[0] - b[0], a[1] - b[1]) * DEM.widthKm; };
    for (const k of [0, 6, 13, 20]) expect(step(k)).toBeCloseTo(1, 1);
  });

  it('reads real terrain: Manizales about 2100 m, summit above 5000 m', () => {
    expect(elevation(hm, ...DEM.places.manizales)).toBeGreaterThan(2000);
    expect(elevation(hm, ...DEM.places.ruiz)).toBeGreaterThan(5000);
  });

  it('keeps the camera above the ground at every km and finite everywhere', () => {
    for (let km = route.start; km <= route.end; km += 0.5) {
      const f = flightAt(hm, route, km);
      expect([f.alt, f.bank, f.pitch, f.bearing, ...f.eye].every(Number.isFinite), `km ${km}`).toBe(true);
      expect(f.alt).toBeGreaterThan((f.ground / 1000) * 1.8);
    }
  });

  it('splits the flown distance among the stops without gaps', () => {
    const r = stopRanges(6, route.start, route.end);
    expect(r[0][0]).toBe(route.start);
    expect(r[5][1]).toBeCloseTo(route.end);
    r.slice(1).forEach((x, i) => expect(x[0]).toBeCloseTo(r[i][1]));
  });
});
