/**
 * generators.js — shape generator functions for PetriDish cultures.
 *
 * Each generator is a pure function:
 *   fn(cx, cy, R, rng, culture) → particles[]
 *
 * Generators are responsible for spatial layout only — they never
 * hardcode colors or timing. Instead they ask the Culture:
 *   culture.color(i)         → ColorSpec for slot i (wraps around)
 *   culture.birthAt(0–1)     → concrete training step
 *   culture.deathAt(isFringe)→ death step or null
 *
 * Particle format:
 *   { type: 'path', d, colorSpec, op, birth, death }
 *   { type: 'dot',  x, y, r, colorSpec, op, birth, death }
 *   { type: 'line', x1, y1, x2, y2, colorSpec, sw, op, birth, death }
 *
 * All generators are exported as named functions so cultures.js can
 * reference them directly:  import { rings, branches } from './generators.js'
 */

import { blobPath } from './utils.js';

// ── Internal particle factories ───────────────────────────────────────────────

function blob(cx, cy, r, nPts, colorSpec, op, birth, death, rng, vary) {
  return {
    type: 'path',
    d: blobPath(cx, cy, r, nPts, rng, vary),
    colorSpec,
    op,
    birth: birth ?? 0,
    death: death ?? null,
  };
}

function dot(x, y, r, colorSpec, op, birth, death) {
  return { type: 'dot', x, y, r, colorSpec, op, birth: birth ?? 0, death: death ?? null };
}

// ── Generators ────────────────────────────────────────────────────────────────

/**
 * streak — a linear smear along a fixed axis.
 * Simple, directional, plateaus early.
 * Analogous to a linear regression: a constrained, predictable shape.
 *
 * Color slots:
 *   0  dominant fill (main streak body)
 *   1  secondary fill (central overlay, darker/denser)
 *   2  accent (fringe blobs at the tips — die back if culture.shrinks)
 */
export function streak(cx, cy, R, rng, culture) {
  const p = [];
  const a = Math.PI * (0.25 + rng() * 0.08);

  // Three large blobs along the streak axis.
  [-0.44, 0, 0.44].forEach((t, i) => {
    p.push(blob(
      cx + t * R * Math.cos(a), cy + t * R * Math.sin(a),
      R * 0.3, 9, culture.color(0), 0.78,
      culture.birthAt(i / 2 * 0.7), null, rng
    ));
  });

  // Two denser overlay blobs toward the center.
  [-0.1, 0.1].forEach((t, i) => {
    p.push(blob(
      cx + t * R * Math.cos(a), cy + t * R * Math.sin(a),
      R * 0.14, 7, culture.color(1), 0.62,
      culture.birthAt(0.4 + i * 0.1), null, rng
    ));
  });

  // Fringe tip blobs — die back if the culture shrinks.
  [-0.65, 0.65].forEach(t => {
    p.push(blob(
      cx + t * R * Math.cos(a), cy + t * R * Math.sin(a),
      R * 0.11, 7, culture.color(2), 0.42,
      culture.birthAt(0.65), culture.deathAt(true), rng
    ));
  });

  return p;
}

/**
 * patch — a dense central blob with ragged satellite growth.
 * Grows to a fixed circular territory, then holds.
 * Analogous to a low-degree polynomial: more expressive than a line, still bounded.
 *
 * Color slots:
 *   0  dominant fill (main patch)
 *   1  secondary fill (satellite blobs, ragged edge)
 *   2  accent (highlight overlay, appears mid-growth)
 */
export function patch(cx, cy, R, rng, culture) {
  const p = [];

  // Large central blob — the core territory.
  p.push(blob(cx, cy, R * 0.52, 11, culture.color(0), 0.72, culture.birthAt(0), null, rng));

  // Four satellite blobs growing outward at different angles.
  for (let i = 0; i < 4; i++) {
    const a = rng() * 2 * Math.PI;
    const r = R * (0.1 + rng() * 0.3);
    p.push(blob(
      cx + r * Math.cos(a), cy + r * Math.sin(a),
      R * (0.1 + rng() * 0.18), 8, culture.color(1), 0.55,
      culture.birthAt(0.2 + i * 0.15), null, rng
    ));
  }

  // Accent overlay — lighter texture that emerges mid-growth.
  p.push(blob(cx + R * 0.08, cy - R * 0.07, R * 0.22, 9, culture.color(2), 0.5,
    culture.birthAt(0.6), null, rng));

  // A darker trailing blob that fades back if the culture shrinks.
  p.push(blob(cx - R * 0.1, cy + R * 0.06, R * 0.18, 8, culture.color(1), 0.4,
    culture.birthAt(0.8), culture.deathAt(true), rng));

  return p;
}

/**
 * rings — concentric colored bands growing outward from the center.
 * Each color slot is one ring; the number of rings equals the palette length.
 * Uses a low vary (0.25) to keep rings nearly circular.
 *
 * Color slots:
 *   0  innermost ring (appears first)
 *   1  second ring
 *   …
 *   n  outermost ring (appears last)
 *
 * DOM order: outermost blob pushed first, innermost last.
 * SVG painter's algorithm then renders innermost on top → concentric effect.
 */
export function rings(cx, cy, R, rng, culture) {
  const p = [];
  const nRings = Math.min(culture.colors.length, 7);

  // Push outermost first so the innermost ends up last in the DOM (renders on top).
  for (let i = nRings - 1; i >= 0; i--) {
    const rf   = (i + 1) / nRings * 0.90;
    const frac = nRings > 1 ? i / (nRings - 1) : 0;
    p.push(blob(cx, cy, rf * R, 12, culture.color(i), 0.82,
      culture.birthAt(frac), null, rng, 0.25));
  }

  return p;
}

/**
 * branches — radial lobes extending from a central hub, with sub-lobes.
 * Hierarchical, directional — like a decision tree grown outward.
 *
 * Color slots:
 *   0  primary lobe fill (main branches)
 *   1  secondary fill (sub-lobes — die back if culture.shrinks)
 */
export function branches(cx, cy, R, rng, culture) {
  const p = [];

  // Central hub.
  p.push(blob(cx, cy, R * 0.12, 7, culture.color(0), 0.82, culture.birthAt(0), null, rng));

  for (let i = 0; i < 6; i++) {
    const a    = (i / 6) * 2 * Math.PI + (rng() - 0.5) * 0.4;
    const dist = R * (0.38 + rng() * 0.28);
    const bx   = cx + dist * Math.cos(a);
    const by   = cy + dist * Math.sin(a);
    const br   = R * (0.18 + rng() * 0.12);

    p.push(blob(bx, by, br, 9, culture.color(0), 0.62 + rng() * 0.2,
      culture.birthAt(i / 6 * 0.8), null, rng));

    // Up to two sub-lobes per branch — fringe, may die back.
    for (let j = 0; j < 2; j++) {
      const a2 = a + (rng() - 0.5) * 0.55;
      const d2 = dist + br * (0.6 + rng() * 0.5);
      if (d2 < R * 0.92) {
        p.push(blob(
          cx + d2 * Math.cos(a2), cy + d2 * Math.sin(a2),
          br * (0.35 + rng() * 0.4), 8, culture.color(1), 0.5 + rng() * 0.2,
          culture.birthAt(i / 6 * 0.8 + 0.15 + j * 0.05),
          culture.deathAt(true), rng
        ));
      }
    }
  }

  return p;
}

/**
 * starburst — tight radial spikes, each composed of three blobs at
 * increasing distance from center. Lobe color shifts from accent to primary
 * toward the tips.
 *
 * Color slots:
 *   0  inner lobe fill (closest to center)
 *   1  mid lobe fill
 *   2  tip fill (farthest from center)
 */
export function starburst(cx, cy, R, rng, culture) {
  const p = [];
  const nSpikes = 9 + Math.floor(rng() * 3);

  for (let i = 0; i < nSpikes; i++) {
    const a   = (i / nSpikes) * 2 * Math.PI + (rng() - 0.5) * 0.15;
    const len = R * (0.55 + rng() * 0.28);

    // Three blobs per spike: inner → mid → tip.
    [0.3, 0.6, 0.9].forEach((t, j) => {
      const bx = cx + t * len * Math.cos(a) + (rng() - 0.5) * R * 0.05;
      const by = cy + t * len * Math.sin(a) + (rng() - 0.5) * R * 0.05;
      const br = R * (0.14 - j * 0.025) * (0.7 + rng() * 0.6);
      p.push(blob(bx, by, br, 8, culture.color(j), 0.7 - j * 0.08,
        culture.birthAt(i / nSpikes * 0.7 + j * 0.05), null, rng));
    });
  }

  return p;
}

/**
 * clusters — scattered independent islands that grow at different times.
 * Some islands (isFringe) die back after the plateau if culture.shrinks.
 * Demonstrates that not all growth persists — local optima, not global ones.
 *
 * Color slots:
 *   0  cluster core fill
 *   1  satellite fill (smaller blobs around each cluster)
 *   2  accent (optional third color if palette is long enough)
 */
export function clusters(cx, cy, R, rng, culture) {
  const p = [];

  for (let c = 0; c < 7; c++) {
    const a    = (c / 7) * 2 * Math.PI + (rng() - 0.5) * 0.5;
    const dist = R * (0.25 + rng() * 0.45);
    const bx   = cx + dist * Math.cos(a);
    const by   = cy + dist * Math.sin(a);
    const br   = R * (0.14 + rng() * 0.14);

    // First three clusters are on the fringe and may die back.
    const isFringe = c < 3;

    p.push(blob(bx, by, br, 9, culture.color(0), 0.72,
      culture.birthAt(c / 7 * 0.6), culture.deathAt(isFringe), rng));

    // Two satellite blobs per cluster.
    for (let s = 0; s < 2; s++) {
      const sa = rng() * 2 * Math.PI;
      const sd = br * (0.6 + rng() * 0.9);
      p.push(blob(
        bx + sd * Math.cos(sa), by + sd * Math.sin(sa),
        br * (0.3 + rng() * 0.4), 7, culture.color(1), 0.5 + rng() * 0.2,
        culture.birthAt(c / 7 * 0.6 + 0.1), culture.deathAt(isFringe), rng
      ));
    }
  }

  return p;
}

/**
 * spiral — blobs placed along a logarithmic spiral.
 * Continuous structured growth; the pattern only becomes legible late.
 * Color cycles through the full palette as the spiral unwinds.
 *
 * Color slots:  all slots used in rotation along the spiral arm.
 */
export function spiral(cx, cy, R, rng, culture) {
  const p = [];
  const turns = 2.5;
  const nBlobs = 14;

  for (let i = 0; i < nBlobs; i++) {
    const t  = i / nBlobs;
    const a  = t * turns * 2 * Math.PI;
    const r  = R * (0.1 + t * 0.78);
    const jx = (rng() - 0.5) * R * 0.07;
    const jy = (rng() - 0.5) * R * 0.07;

    p.push(blob(
      cx + r * Math.cos(a) + jx, cy + r * Math.sin(a) + jy,
      R * (0.14 + rng() * 0.1), 9, culture.color(i),
      0.68 + rng() * 0.22, culture.birthAt(t), null, rng
    ));
  }

  return p;
}

/**
 * foundation — dense, uniform coverage across all colors and all 100 steps.
 * Never plateaus; every training step adds something new.
 * Represents a foundation model: fills the space, never stops evolving.
 *
 * Color slots:  all slots used in rotation, both for background and detail.
 */
export function foundation(cx, cy, R, rng, culture) {
  const p = [];

  // Six large low-opacity background blobs arranged radially.
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * 2 * Math.PI;
    p.push(blob(
      cx + R * 0.22 * Math.cos(a), cy + R * 0.22 * Math.sin(a),
      R * (0.42 + rng() * 0.28), 11, culture.color(i), 0.42,
      culture.birthAt(rng() * 0.2), null, rng
    ));
  }

  // Twenty medium blobs spread uniformly across the full 100 steps.
  for (let i = 0; i < 20; i++) {
    const a = rng() * 2 * Math.PI;
    const r = R * Math.sqrt(rng()) * 0.9;
    p.push(blob(
      cx + r * Math.cos(a), cy + r * Math.sin(a),
      R * (0.1 + rng() * 0.22), 9, culture.color(i),
      0.52 + rng() * 0.3, culture.birthAt(rng()), null, rng
    ));
  }

  return p;
}
