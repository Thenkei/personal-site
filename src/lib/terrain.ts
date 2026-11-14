/**
 * Procedural terrain + contour extraction.
 *
 * Heightfield = a handful of gaussian hills + low-frequency ridging, from a
 * seeded PRNG so a given seed always yields the same map. Contours are
 * extracted with marching squares (linear interpolation on cell edges), which
 * is what real topographic tools do on a DEM — just at a much coarser grid.
 */

export interface TerrainOptions {
  seed: number;
  width: number;
  height: number;
  /** Grid cell size in viewBox units. Smaller = smoother lines, more work. */
  cell?: number;
  /** Number of contour intervals between min and max height. */
  levels?: number;
}

export interface Contour {
  /** Normalised height (0–1) this line is drawn at. */
  level: number;
  /** Every 5th line is an "index contour" — drawn heavier, like on a real map. */
  index: boolean;
  d: string;
}

export interface Terrain {
  contours: Contour[];
  /** Normalised (0–1) height at viewBox coordinates. */
  heightAt: (x: number, y: number) => number;
  /** Highest point within the always-visible part of the map. */
  summit: { x: number; y: number };
}

/** mulberry32 — tiny, fast, good-enough PRNG for visuals. */
function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Hill {
  x: number;
  y: number;
  r: number;
  h: number;
}

function buildField(seed: number, width: number, height: number) {
  const rand = prng(seed);
  const between = (lo: number, hi: number) => lo + rand() * (hi - lo);

  // The dominant massif sits on the right so the hero copy (left) stays legible.
  const hills: Hill[] = [
    { x: width * between(0.68, 0.82), y: height * between(0.3, 0.55), r: between(240, 320), h: 1 },
  ];
  for (let i = 0; i < 6; i++) {
    hills.push({
      x: between(-0.1, 1.1) * width,
      y: between(-0.1, 1.1) * height,
      r: between(110, 260),
      h: between(0.25, 0.7),
    });
  }

  const p1 = between(0, Math.PI * 2);
  const p2 = between(0, Math.PI * 2);
  const p3 = between(0, Math.PI * 2);

  return (x: number, y: number): number => {
    let z = 0;
    for (const hill of hills) {
      const dx = x - hill.x;
      const dy = y - hill.y;
      z += hill.h * Math.exp(-(dx * dx + dy * dy) / (2 * hill.r * hill.r));
    }
    // Ridging: low-amplitude interfering waves break up the perfect gaussians.
    z += 0.07 * Math.sin(x * 0.011 + p1) * Math.cos(y * 0.013 + p2);
    z += 0.04 * Math.sin((x + y) * 0.021 + p3);
    z += 0.025 * Math.sin(x * 0.043 - y * 0.031 + p1 + p2);
    return z;
  };
}

const round = (n: number) => Math.round(n * 10) / 10;

export function generateTerrain({ seed, width, height, cell = 10, levels = 18 }: TerrainOptions): Terrain {
  const raw = buildField(seed, width, height);
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;

  const grid = new Float32Array(cols * rows);
  let min = Infinity;
  let max = -Infinity;
  // The summit marker is searched only inside the zone that stays on screen
  // whatever the viewport crop (`slice`), right of the hero copy.
  const zone = { x0: width * 0.55, x1: width * 0.9, y0: height * 0.15, y1: height * 0.8 };
  let summit = { x: (zone.x0 + zone.x1) / 2, y: (zone.y0 + zone.y1) / 2 };
  let summitZ = -Infinity;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = i * cell;
      const y = j * cell;
      const v = raw(x, y);
      grid[j * cols + i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
      if (v > summitZ && x >= zone.x0 && x <= zone.x1 && y >= zone.y0 && y <= zone.y1) {
        summitZ = v;
        summit = { x, y };
      }
    }
  }
  const span = max - min || 1;
  for (let k = 0; k < grid.length; k++) grid[k] = (grid[k] - min) / span;

  const contours: Contour[] = [];
  for (let l = 1; l < levels; l++) {
    const t = l / levels;
    contours.push({ level: t, index: l % 5 === 0, d: march(grid, cols, rows, cell, t) });
  }

  return {
    contours,
    heightAt: (x, y) => Math.min(1, Math.max(0, (raw(x, y) - min) / span)),
    summit,
  };
}

/**
 * Marching squares for a single iso-level. Emits unjoined segments as one
 * path; with round caps and an opaque stroke they read as continuous lines,
 * and skipping the segment-stitching pass keeps this ~40 lines.
 */
function march(grid: Float32Array, cols: number, rows: number, cell: number, t: number): string {
  const parts: string[] = [];
  const lerp = (a: number, b: number) => (t - a) / (b - a);

  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const tl = grid[j * cols + i];
      const tr = grid[j * cols + i + 1];
      const br = grid[(j + 1) * cols + i + 1];
      const bl = grid[(j + 1) * cols + i];
      const code = (tl > t ? 8 : 0) | (tr > t ? 4 : 0) | (br > t ? 2 : 0) | (bl > t ? 1 : 0);
      if (code === 0 || code === 15) continue;

      const x = i * cell;
      const y = j * cell;
      const top = () => [x + cell * lerp(tl, tr), y] as const;
      const right = () => [x + cell, y + cell * lerp(tr, br)] as const;
      const bottom = () => [x + cell * lerp(bl, br), y + cell] as const;
      const left = () => [x, y + cell * lerp(tl, bl)] as const;
      const seg = (a: readonly [number, number], b: readonly [number, number]) =>
        parts.push(`M${round(a[0])} ${round(a[1])}L${round(b[0])} ${round(b[1])}`);

      switch (code) {
        case 1:
        case 14:
          seg(left(), bottom());
          break;
        case 2:
        case 13:
          seg(bottom(), right());
          break;
        case 3:
        case 12:
          seg(left(), right());
          break;
        case 4:
        case 11:
          seg(top(), right());
          break;
        case 6:
        case 9:
          seg(top(), bottom());
          break;
        case 7:
        case 8:
          seg(left(), top());
          break;
        case 5: // saddle
          seg(left(), top());
          seg(bottom(), right());
          break;
        case 10: // saddle
          seg(top(), right());
          seg(left(), bottom());
          break;
      }
    }
  }
  return parts.join('');
}
