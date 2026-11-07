/**
 * utils.js — shared math utilities for the petri dish system.
 * No DOM, no D3, no side effects.
 */

// ── Seeded PRNG ───────────────────────────────────────────────────────────────

/**
 * Returns a seeded pseudo-random number generator (Mulberry32).
 * Call the returned function repeatedly to get reproducible floats in [0, 1).
 *
 * @param {number} seed  integer seed
 * @returns {function} rng — call rng() → number in [0, 1)
 */
export function rng32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Catmull-Rom closed curve ──────────────────────────────────────────────────

/**
 * Convert an array of [x, y] points into a closed SVG cubic-bezier path
 * that smoothly interpolates through every point (uniform Catmull-Rom).
 */
function catmullRomClosed(pts) {
  const n = pts.length;
  if (n < 2) return '';

  let d = `M ${pts[0][0]},${pts[0][1]}`;

  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
  }

  return d + ' Z';
}

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Deterministic float in [0, 1) from two integers.
 * Used by growingBlobPath to give each control point a stable per-seed offset.
 */
function hashFloat(a, b) {
  let x = (Math.imul((a | 0) ^ 0xdeadbeef, 0x9e3779b9) + (b | 0)) | 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

// ── Smooth step ───────────────────────────────────────────────────────────────

export function smoothstep(x) {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

// ── Growing blob path ─────────────────────────────────────────────────────────

/**
 * Generate an organic closed blob path that grows from nothing to full radius.
 *
 * Recomputed every render step. The radius expands via smoothstep easing and
 * the outline morphs between two stable hash-derived shapes over the same
 * curve — size and shape move in lockstep, no sudden pop-in.
 *
 * @param {number}   cx          center x
 * @param {number}   cy          center y
 * @param {number}   maxR        full radius when grown
 * @param {number}   nPts        number of Catmull-Rom control points
 * @param {number}   pSeed       integer — determines characteristic blob shape
 * @param {number}   t           current training step (float ok)
 * @param {number}   birth       step when this particle was born
 * @param {object}   [opts]
 * @param {number}   [opts.vary=0.65]       shape variance (0=circle, 1=amoeba)
 * @param {number}   [opts.growSteps=20]    steps to reach full size
 * @returns {string} SVG path data, or '' if still too small to render
 */
export function growingBlobPath(cx, cy, maxR, nPts, pSeed, t, birth, {
  vary = 0.65, growSteps = 20,
} = {}) {
  const age      = Math.max(0, t - birth);
  const growFrac = Math.min(1, age / Math.max(growSteps, 1));
  const r        = maxR * smoothstep(growFrac);
  if (r < 0.5) return '';

  const morph = smoothstep(growFrac);
  const seedB = (pSeed ^ 0x5A5A5A5A) >>> 0;

  const pts = Array.from({ length: nPts }, (_, i) => {
    // Angular position — slightly jittered so control points aren't evenly spaced.
    // Jitter is scaled by vary so low-vary (nearly round) blobs stay round.
    const baseA = (i / nPts) * 2 * Math.PI;
    const aJit  = (hashFloat(pSeed + 12345, i) - 0.5) * (Math.PI / nPts) * 0.55 * vary;
    const a     = baseA + aJit;

    // Primary radial variation (smooth, large-scale lobe structure).
    const vA = hashFloat(pSeed, i) * vary;
    const vB = hashFloat(seedB,  i) * vary;
    const v  = vA + (vB - vA) * morph;

    // Secondary fine variation (independent per-point, centered around 0).
    // Adds small-scale bumps on top of the large lobes.
    const f1A = (hashFloat(pSeed + 7919, i) - 0.5) * vary * 0.22;
    const f1B = (hashFloat(seedB  + 7919, i) - 0.5) * vary * 0.22;
    const fine = f1A + (f1B - f1A) * morph;

    const dr = r * Math.max(0.1, 1 - vary * 0.5 + v + fine);
    return [cx + dr * Math.cos(a), cy + dr * Math.sin(a)];
  });
  return catmullRomClosed(pts);
}
