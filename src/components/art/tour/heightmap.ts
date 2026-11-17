import { DEM } from '../terrain-gl';

/** Decodes the 16-bit heightmap (R = high byte, G = low byte, metres) into one Uint16Array. */
export async function loadHeightmap(signal: AbortSignal) {
  const res = await fetch(DEM.url, { signal });
  if (!res.ok) throw new Error(`heightmap ${res.status}`);
  const bmp = await createImageBitmap(await res.blob(), { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
  const c = document.createElement('canvas');
  c.width = DEM.size; c.height = DEM.size;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(bmp, 0, 0);
  bmp.close();
  const rgba = ctx.getImageData(0, 0, DEM.size, DEM.size).data, hm = new Uint16Array(DEM.size * DEM.size);
  for (let i = 0; i < hm.length; i++) hm[i] = rgba[i * 4] * 256 + rgba[i * 4 + 1];
  return hm;
}
