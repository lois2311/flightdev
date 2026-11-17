/**
 * Real-relief renderer for the hero: WebGL2, no library (see docs/adr/ADR-001-webgl-hero.md).
 * The mesh is a grid displaced by a 16-bit heightmap of the Cordillera Central (public/terrain, SRTM via Mapzen
 * Terrain Tiles); the fragment shader draws real 100 m contour lines (500 m index contours) on chart paper with a
 * faint hillshade, fading into the paper with distance, at grazing angles and toward the data's edges. A second, tiny
 * draw paints the sky left uncovered (same colour as the haze, plus a thin dusk glow on the horizon), so the far
 * ridges dissolve into it on their own.
 */

export type Vec3 = [number, number, number];
export type Mat4 = Float32Array;

/** Extent and scale of public/terrain/cordillera-central.png (generated once, see docs/FLIGHTDEV_CREATIVE_DIRECTION_V2.md). */
export const DEM = {
  // 16-bit elevation in metres: red = high byte, green = low byte (SRTM, smoothed with a 0.9 px gaussian).
  url: '/terrain/cordillera-central.png', size: 256, widthKm: 48.4,
  // Normalised (east, south) positions inside the tile.
  places: { manizales: [0.2847, 0.2519], ruiz: [0.7193, 0.6617] } as Record<string, [number, number]>,
};
/** Vertical exaggeration: the Andes at 1:1 read flat at this scale. Stated on the hero's chart legend. */
export const EXAGGERATION = 1.8;

// --- small column-major matrix helpers -------------------------------------------------------------
function perspective(fovy: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}
const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: Vec3): Vec3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
function lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
  const z = norm(sub(eye, target)), x = norm(cross(up, z)), y = cross(z, x);
  return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1]);
}
function mul(a: Mat4, b: Mat4): Mat4 {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    let s = 0;
    for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
    o[c * 4 + r] = s;
  }
  return o;
}

export type Camera = { eye: Vec3; heading: Vec3; pitch: number; roll: number; fovy: number };

/**
 * View-projection for a camera flying `heading` (unit XZ direction), pitched down and banked.
 * `shift` slides the image vertically in clip space (+ moves the scene up): it places the horizon without changing
 * the pitch, so one fixed full-screen canvas can sit behind windows of different heights.
 */
export function viewProjection(cam: Camera, aspect: number, far: number, shift = 0): Mat4 {
  const [hx, , hz] = cam.heading, cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  const f: Vec3 = [hx * cp, sp, hz * cp];
  const right = norm(cross(f, [0, 1, 0])), up0 = cross(right, f);
  const cr = Math.cos(cam.roll), sr = Math.sin(cam.roll);
  const up: Vec3 = [up0[0] * cr + right[0] * sr, up0[1] * cr + right[1] * sr, up0[2] * cr + right[2] * sr];
  const m = mul(perspective(cam.fovy, aspect, 0.05, far), lookAt(cam.eye, [cam.eye[0] + f[0], cam.eye[1] + f[1], cam.eye[2] + f[2]], up));
  if (shift) for (let c = 0; c < 4; c++) m[c * 4 + 1] += shift * m[c * 4 + 3];
  return m;
}

/** World point to CSS pixels; null when behind the camera. */
export function project(vp: Mat4, p: Vec3, w: number, h: number): [number, number, number] | null {
  const cx = vp[0] * p[0] + vp[4] * p[1] + vp[8] * p[2] + vp[12];
  const cy = vp[1] * p[0] + vp[5] * p[1] + vp[9] * p[2] + vp[13];
  const cw = vp[3] * p[0] + vp[7] * p[1] + vp[11] * p[2] + vp[15];
  if (cw <= 0.05) return null;
  return [(cx / cw * 0.5 + 0.5) * w, (0.5 - cy / cw * 0.5) * h, cw];
}

/**
 * Horizon as a line in clip space (a*x + b*y + c = 0, unit normal, b > 0 so the value grows upward), read off a view-projection
 * (roll and the lens shift included). Two directions at infinity either side of the heading define it; null if the camera is not level enough.
 */
export function horizonLine(vp: Mat4): [number, number, number] | null {
  const hl = Math.hypot(vp[3], vp[11]);
  if (hl < 1e-6) return null;
  const hx = vp[3] / hl, hz = vp[11] / hl, pts: [number, number][] = [];
  for (const yaw of [-0.4, 0.4]) {
    const c = Math.cos(yaw), s = Math.sin(yaw), dx = hx * c - hz * s, dz = hx * s + hz * c, w = vp[3] * dx + vp[11] * dz;
    if (w <= 1e-6) return null;
    pts.push([(vp[0] * dx + vp[8] * dz) / w, (vp[1] * dx + vp[9] * dz) / w]);
  }
  const dx = pts[1][0] - pts[0][0], dy = pts[1][1] - pts[0][1], len = Math.hypot(dx, dy) || 1;
  const sign = dx >= 0 ? 1 : -1, a = (-dy / len) * sign, b = (dx / len) * sign;
  return [a, b, -(a * pts[0][0] + b * pts[0][1])];
}

/** Bilinear elevation in metres at normalised (u east, v south). */
export function elevation(hm: Uint16Array, u: number, v: number) {
  const n = DEM.size - 1, x = Math.min(n, Math.max(0, u * n)), y = Math.min(n, Math.max(0, v * n));
  const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, i1 = Math.min(n, i + 1), j1 = Math.min(n, j + 1);
  const at = (a: number, b: number) => hm[b * DEM.size + a];
  const t = at(i, j) * (1 - fx) + at(i1, j) * fx, b = at(i, j1) * (1 - fx) + at(i1, j1) * fx;
  return t * (1 - fy) + b * fy;
}
/** World units are km; Y is exaggerated elevation. */
export const toWorld = (u: number, v: number, metres: number): Vec3 => [u * DEM.widthKm, (metres / 1000) * EXAGGERATION, v * DEM.widthKm];

const VS = `#version 300 es
in vec2 aUv; in float aH; in vec3 aN;
uniform mat4 uVP; uniform float uW, uEx;
out float vM; out vec3 vP; out vec2 vUv; out vec3 vN;
void main() {
  vec3 p = vec3(aUv.x * uW, aH * 0.001 * uEx, aUv.y * uW);
  vM = aH; vP = p; vUv = aUv; vN = aN;
  gl_Position = uVP * vec4(p, 1.0);
}`;

// Glow profile by clip-space distance to the horizon (positive above it): wide into the sky, tight over the land.
const BAND = `float band(float d) { float s = d > 0.0 ? 0.10 : 0.035; return exp(-d * d / (s * s)); }`;

const FS = `#version 300 es
precision highp float;
in float vM; in vec3 vP; in vec2 vUv; in vec3 vN;
uniform vec3 uCam, uPaper, uInk, uIndex, uGlow, uHorizon; uniform vec2 uFog, uRes;
out vec4 o;
${BAND}
float iso(float c, float px) {
  float w = fwidth(c);
  // Lines fade out where contours crowd below ~3 px apart, so distance never turns into moire.
  return (1.0 - smoothstep(0.0, px, abs(fract(c - 0.5) - 0.5) / max(w, 1e-5))) * (1.0 - smoothstep(0.18, 0.45, w));
}
void main() {
  // Hillshade lit from the north-west, as on printed relief charts.
  float shade = clamp(dot(normalize(vN), normalize(vec3(-0.6, 0.7, -0.4))), 0.0, 1.0);
  // On a dark ground the multiplicative shade vanishes, so lit slopes also gain a little index-colour light (zero by day).
  float lum = dot(uPaper, vec3(0.299, 0.587, 0.114));
  vec3 col = uPaper * (0.86 + 0.14 * shade) + uIndex * 0.17 * shade * (1.0 - lum);
  col = mix(col, uInk, 0.42 * iso(vM / 100.0, 1.0));
  col = mix(col, uIndex, 0.55 * iso(vM / 500.0, 1.4));
  float dist = distance(vP, uCam);
  float fog = smoothstep(uFog.x, uFog.y, dist);
  // Ground seen at a grazing angle dissolves before the fog distance does, so far ridges never end in a cut line.
  float haze = 0.85 * (1.0 - smoothstep(0.02, 0.16, -normalize(vP - uCam).y)) * smoothstep(6.0, 22.0, dist);
  float edge = smoothstep(0.0, 0.14, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
  // The haze colour is the sky's colour at this very pixel (glow included), so terrain and sky meet without a seam.
  vec2 nd = gl_FragCoord.xy / uRes * 2.0 - 1.0;
  vec3 sky = uPaper + uGlow * band(dot(uHorizon.xy, nd) + uHorizon.z);
  o = vec4(mix(sky, col, (1.0 - max(fog, haze)) * edge), 1.0);
}`;

// Full-screen triangle at the far plane: with LEQUAL it only shades pixels the terrain left uncovered.
const SKY_VS = `#version 300 es
out vec2 vNd;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)) * 2.0 - 1.0;
  vNd = p; gl_Position = vec4(p, 1.0, 1.0);
}`;
const SKY_FS = `#version 300 es
precision highp float;
in vec2 vNd;
uniform vec3 uPaper, uGlow, uHorizon;
out vec4 o;
${BAND}
void main() { o = vec4(uPaper + uGlow * band(dot(uHorizon.xy, vNd) + uHorizon.z), 1.0); }`;

export const rgb = (hex: string): Vec3 => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255) as Vec3;

export type TerrainRenderer = {
  draw(vp: Mat4, eye: Vec3, fog: [number, number]): void;
  /** Re-tints the chart (0..1 RGB). Fog, haze and the sky follow `paper`, so the relief always dissolves into the page; `glow` (0..1) is the horizon band. */
  setColors(paper: Vec3, ink: Vec3, index: Vec3, glow?: number): void;
  resize(w: number, h: number, dpr: number): void;
  dispose(): void;
};

/** Returns null when WebGL2 or shader compilation is unavailable: the caller keeps its static fallback. */
export function createTerrainRenderer(canvas: HTMLCanvasElement, hm: Uint16Array, grid: number, colors = { paper: '#F6F8FB', ink: '#2F8CFF', index: '#1D5FB8' }): TerrainRenderer | null {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
  if (!gl || gl.isContextLost()) return null;
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const link = (vsrc: string, fsrc: string) => {
    const v = shader(gl.VERTEX_SHADER, vsrc), f = shader(gl.FRAGMENT_SHADER, fsrc), p = gl.createProgram();
    if (!v || !f || !p) return null;
    gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    return gl.getProgramParameter(p, gl.LINK_STATUS) ? { p, v, f } : null;
  };
  const main = link(VS, FS);
  if (!main) return null;
  const prog = main.p;
  // The sky is garnish: if it fails to build, the terrain still dissolves into the clear colour.
  const sky = link(SKY_VS, SKY_FS);

  // Grid of `grid` x `grid` vertices sampled from the heightmap (every 2nd pixel on small screens).
  const step = (DEM.size - 1) / (grid - 1), uv = new Float32Array(grid * grid * 2), h = new Uint16Array(grid * grid), nrm = new Float32Array(grid * grid * 3);
  const cell = DEM.widthKm / (grid - 1), at = (i: number, j: number) => hm[Math.round(Math.min(grid - 1, Math.max(0, j)) * step) * DEM.size + Math.round(Math.min(grid - 1, Math.max(0, i)) * step)];
  for (let j = 0; j < grid; j++) for (let i = 0; i < grid; i++) {
    const k = j * grid + i;
    uv[k * 2] = i / (grid - 1); uv[k * 2 + 1] = j / (grid - 1);
    h[k] = at(i, j);
    // Smooth per-vertex normal from central differences, in the same exaggerated world units as the mesh.
    const dx = ((at(i + 1, j) - at(i - 1, j)) * 0.001 * EXAGGERATION) / (2 * cell), dz = ((at(i, j + 1) - at(i, j - 1)) * 0.001 * EXAGGERATION) / (2 * cell);
    const l = Math.hypot(dx, 1, dz);
    nrm.set([-dx / l, 1 / l, -dz / l], k * 3);
  }
  const idx = new Uint16Array((grid - 1) * (grid - 1) * 6);
  for (let j = 0, p = 0; j < grid - 1; j++) for (let i = 0; i < grid - 1; i++) {
    const a = j * grid + i, b = a + 1, c = a + grid, d = c + 1;
    idx.set([a, c, b, b, c, d], p); p += 6;
  }
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);
  const buffers = [gl.createBuffer()!, gl.createBuffer()!, gl.createBuffer()!, gl.createBuffer()!];
  const attrib = (buf: WebGLBuffer, data: BufferSource, name: string, size: number, type: number, normalized: boolean) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, type, normalized, 0, 0);
  };
  attrib(buffers[0], uv, 'aUv', 2, gl.FLOAT, false);
  attrib(buffers[1], h, 'aH', 1, gl.UNSIGNED_SHORT, false);
  attrib(buffers[3], nrm, 'aN', 3, gl.FLOAT, false);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers[2]); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  gl.bindVertexArray(null);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const loc = { vp: u('uVP'), w: u('uW'), ex: u('uEx'), cam: u('uCam'), paper: u('uPaper'), ink: u('uInk'), index: u('uIndex'), fog: u('uFog'), glow: u('uGlow'), horizon: u('uHorizon'), res: u('uRes') };
  const su = (n: string) => (sky ? gl.getUniformLocation(sky.p, n) : null);
  const skyLoc = { paper: su('uPaper'), glow: su('uGlow'), horizon: su('uHorizon') };
  const paper = rgb(colors.paper), NO_HORIZON = [0, 1, -9];
  gl.useProgram(prog);
  gl.uniform1f(loc.w, DEM.widthKm); gl.uniform1f(loc.ex, EXAGGERATION);
  gl.uniform3fv(loc.paper, paper); gl.uniform3fv(loc.ink, rgb(colors.ink)); gl.uniform3fv(loc.index, rgb(colors.index));
  gl.uniform3fv(loc.glow, [0, 0, 0]);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(paper[0], paper[1], paper[2], 1);
  if (sky) { gl.useProgram(sky.p); gl.uniform3fv(skyLoc.paper, paper); gl.uniform3fv(skyLoc.glow, [0, 0, 0]); }

  return {
    resize(w, hgt, dpr) {
      canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.max(1, Math.round(hgt * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(prog); gl.uniform2f(loc.res, canvas.width, canvas.height);
    },
    setColors(p, ink, index, glow = 0) {
      // Cielo at a low gain: added to the sky it reads as a thin band of light, never as a second colour.
      const g = [0.184 * glow * 0.3, 0.549 * glow * 0.3, glow * 0.3];
      gl.useProgram(prog);
      gl.uniform3fv(loc.paper, p); gl.uniform3fv(loc.ink, ink); gl.uniform3fv(loc.index, index); gl.uniform3fv(loc.glow, g);
      if (sky) { gl.useProgram(sky.p); gl.uniform3fv(skyLoc.paper, p); gl.uniform3fv(skyLoc.glow, g); }
      gl.clearColor(p[0], p[1], p[2], 1);
    },
    draw(vp, eye, fog) {
      const hz = horizonLine(vp) ?? NO_HORIZON;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniformMatrix4fv(loc.vp, false, vp); gl.uniform3fv(loc.cam, eye); gl.uniform2f(loc.fog, fog[0], fog[1]); gl.uniform3fv(loc.horizon, hz);
      gl.bindVertexArray(vao);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
      gl.bindVertexArray(null);
      if (sky) { gl.useProgram(sky.p); gl.uniform3fv(skyLoc.horizon, hz); gl.drawArrays(gl.TRIANGLES, 0, 3); }
    },
    dispose() {
      buffers.forEach(b => gl.deleteBuffer(b));
      // No loseContext(): a re-run of the effect on the same canvas gets this context back and must find it usable.
      gl.deleteVertexArray(vao);
      for (const l of [main, sky]) if (l) { gl.deleteProgram(l.p); gl.deleteShader(l.v); gl.deleteShader(l.f); }
    },
  };
}
