/**
 * patterns.js — growth pattern functions for Mold instances.
 *
 * Each exported function produces a flat array of particles for one mold
 * instance. Particles of type 'growing' have their SVG path recomputed
 * each render step by dish.js via growingBlobPath().
 *
 * Signature:
 *   patternFn(ox, oy, maxR, startStep, mold, rng) → particle[]
 *
 * Particle format (growing):
 *   { type:'growing', cx, cy, maxR, nPts, pSeed, vary, growSteps,
 *     colorSpec, op, birth, death }
 */

import { ColorSpec } from './color-spec.js';

// ── Internal factory ──────────────────────────────────────────────────────────

function gp(cx, cy, maxR, nPts, pSeed, vary, growSteps, colorSpec, op, birth) {
  return { type: 'growing', cx, cy, maxR, nPts, pSeed, vary, growSteps, colorSpec, op, birth, death: null };
}

// ── Patterns ──────────────────────────────────────────────────────────────────

/**
 * even — single growing blob that expands from the origin.
 */
export function even(ox, oy, maxR, startStep, mold, rng) {
  const pSeed = (rng() * 0xFFFFFF) >>> 0;
  return [gp(ox, oy, maxR, mold.nPts, pSeed, mold.vary, mold.growSpeed, mold._colorSpec, mold.opacity, startStep)];
}

/**
 * rings — concentric growing rings emanating from the origin.
 *
 * Inner rings are born first; if the mold has an ageColor, all rings use
 * ColorSpec.age so that older (inner) rings visually age toward ageColor
 * while freshly born (outer) rings start at mold.color.
 */
export function rings(ox, oy, maxR, startStep, mold, rng) {
  const nRings    = 5;
  const growSteps = mold.growSpeed;
  const interval  = Math.max(2, Math.round(growSteps * 0.5 / nRings));
  const p = [];

  // Push outermost first so innermost renders on top (painter's algorithm).
  for (let i = nRings - 1; i >= 0; i--) {
    const pSeed = (rng() * 0xFFFF) >>> 0;
    const frac  = (i + 1) / nRings;

    const colorSpec = (mold.color && mold.secondColor)
      ? ColorSpec.age(mold.color, mold.secondColor, { over: interval * (nRings - 1) })
      : mold._colorSpec;

    p.push(gp(
      ox, oy,
      maxR * frac,
      mold.nPts + i,
      pSeed,
      mold.vary * (0.4 + frac * 0.6),
      growSteps,
      colorSpec,
      mold.opacity * (0.55 + frac * 0.45),
      startStep + i * interval,
    ));
  }

  return p;
}

/**
 * tendrils — radiating filaments extending from the origin.
 * Each tendril is a chain of small growing blobs along a fixed direction.
 */
export function tendrils(ox, oy, maxR, startStep, mold, rng) {
  const nTendrils = 6 + Math.round(rng() * 3);
  const p = [];

  for (let i = 0; i < nTendrils; i++) {
    const angle = (i / nTendrils) * 2 * Math.PI + (rng() - 0.5) * 0.4;
    const len   = maxR * (0.55 + rng() * 0.4);

    for (let j = 0; j < 3; j++) {
      const frac  = (j + 1) / 3;
      const dist  = len * frac;
      const jx    = (rng() - 0.5) * maxR * 0.07;
      const jy    = (rng() - 0.5) * maxR * 0.07;
      const pSeed = (rng() * 0xFFFF) >>> 0;
      const birth = startStep + Math.round(
        ((i / nTendrils) * 0.4 + frac * 0.6) * mold.growSpeed
      );

      p.push(gp(
        ox + dist * Math.cos(angle) + jx,
        oy + dist * Math.sin(angle) + jy,
        maxR * Math.max(0.06, 0.14 - j * 0.025),
        7, pSeed,
        0.45 + mold.vary * 0.25,
        12,
        mold._colorSpec,
        mold.opacity * (1 - j * 0.1),
        birth,
      ));
    }
  }

  return p;
}

/**
 * fluffy — dense lobed colony: round core + ring of overlapping peripheral lobes.
 *
 * Mimics Penicillium/Aspergillus morphology: a solid interior with a rough,
 * cauliflower-like edge made of many small overlapping blobs.
 *
 * Color slots:
 *   mold.color     — core fill (darker, denser)
 *   mold.secondColor  — lobe fill (lighter, fuzzier edge) — falls back to mold.color
 */
export function fluffy(ox, oy, maxR, startStep, mold, rng) {
  const p = [];
  const nLobes = 10 + Math.round(rng() * 6);  // 10–16 lobes

  // Core — round, dense, high-opacity base.
  const coreSeed = (rng() * 0xFFFF) >>> 0;
  p.push(gp(
    ox, oy,
    maxR * 0.54,
    mold.nPts, coreSeed,
    0.28,            // very low vary → nearly round
    mold.growSpeed,
    mold._colorSpec,
    mold.opacity,
    startStep,
  ));

  // Lobe ring — born clockwise around the core as the colony expands.
  const lobeColorSpec = mold.secondColor ? ColorSpec.solid(mold.secondColor) : mold._colorSpec;
  const lobeRingR = maxR * 0.68;

  for (let i = 0; i < nLobes; i++) {
    const a      = (i / nLobes) * 2 * Math.PI + (rng() - 0.5) * 0.25;
    const r      = lobeRingR * (0.80 + rng() * 0.38);
    const lr     = maxR * (0.18 + rng() * 0.14);
    const pSeed  = (rng() * 0xFFFF) >>> 0;
    // Stagger lobe births clockwise over first 72% of growSpeed.
    const birth  = startStep + Math.round((i / nLobes) * mold.growSpeed * 0.72);

    p.push(gp(
      ox + r * Math.cos(a),
      oy + r * Math.sin(a),
      lr, 9, pSeed,
      0.42 + rng() * 0.22,
      mold.growSpeed * 0.42,
      lobeColorSpec,
      mold.opacity * 0.90,
      birth,
    ));
  }

  return p;
}

// ── Slime helpers ─────────────────────────────────────────────────────────────

/**
 * Recursively build a branching arm tree as growingLine particles.
 * Each segment grows from its start point toward its endpoint over growSteps.
 * Child segments start growing when their parent is ~60% drawn.
 */
function buildSlimeArm(ox, oy, angle, length, depth, birthStep, stagger, sw, mold, rng, results) {
  const ex = ox + length * Math.cos(angle);
  const ey = oy + length * Math.sin(angle);

  results.push({
    type:      'growingLine',
    x1: ox, y1: oy,
    x2: ex, y2: ey,
    sw:        Math.max(0.4, sw),
    colorSpec: mold._colorSpec,
    op:        mold.opacity * (0.35 + depth * 0.20),
    birth:     Math.round(birthStep),
    growSteps: Math.max(4, stagger * 0.85),
    death:     null,
  });

  if (depth > 1) {
    const nBranches  = depth >= 3 ? (2 + Math.round(rng() * 1)) : 2;
    const childBirth = birthStep + stagger * 0.60;
    for (let i = 0; i < nBranches; i++) {
      const spread      = nBranches === 3 ? 0.55 : 0.72;
      const branchAngle = angle + (i - (nBranches - 1) / 2) * spread + (rng() - 0.5) * 0.28;
      const branchLen   = length * (0.48 + rng() * 0.30);
      buildSlimeArm(ex, ey, branchAngle, branchLen, depth - 1, childBirth, stagger * 0.82, sw * 0.68, mold, rng, results);
    }
  }
}

/**
 * slime — Physarum-style branching filament network.
 *
 * Thin dark stroked lines radiate from the origin and branch recursively.
 * Each segment draws itself progressively (tip extends outward) using the
 * growingLine particle type.
 */
export function slime(ox, oy, maxR, startStep, mold, rng) {
  const results  = [];
  const nArms    = 3 + Math.round(rng() * 3);  // 3–6 primary arms
  const depth    = 3;
  const stagger  = mold.growSpeed / (depth + 1);

  for (let i = 0; i < nArms; i++) {
    const angle    = (i / nArms) * 2 * Math.PI + (rng() - 0.5) * 0.6;
    const armLen   = maxR * (0.38 + rng() * 0.42);
    const armBirth = startStep + Math.round((i / nArms) * mold.growSpeed * 0.22);
    const sw       = 1.6 + rng() * 0.9;

    buildSlimeArm(ox, oy, angle, armLen, depth, armBirth, stagger, sw, mold, rng, results);
  }

  return results;
}

/**
 * lace — solid core with a dense fringed / ruffled edge.
 *
 * Mimics colonies with intricate, lacey boundaries: a nearly-round interior
 * blob plus a dense ring of small lobes born progressively around the perimeter.
 */
export function lace(ox, oy, maxR, startStep, mold, rng) {
  const p = [];

  // Solid core — low vary so it stays nearly round
  const coreSeed = (rng() * 0xFFFF) >>> 0;
  p.push(gp(ox, oy, maxR * 0.58, mold.nPts ?? 10, coreSeed, 0.14,
    mold.growSpeed, mold._colorSpec, mold.opacity, startStep));

  // Dense fringe — many small lobes along and beyond the core edge
  const nFringe = 26 + Math.round(rng() * 12);
  for (let i = 0; i < nFringe; i++) {
    const a     = (i / nFringe) * 2 * Math.PI + (rng() - 0.5) * 0.25;
    const dist  = maxR * (0.44 + rng() * 0.32);
    const fr    = maxR * (0.07 + rng() * 0.09);
    const pSeed = (rng() * 0xFFFF) >>> 0;
    const birth = startStep + Math.round(mold.growSpeed * (0.22 + rng() * 0.48));
    p.push(gp(
      ox + dist * Math.cos(a), oy + dist * Math.sin(a),
      fr, 7, pSeed, 0.48 + rng() * 0.32, 10,
      mold._colorSpec, mold.opacity * (0.65 + rng() * 0.30),
      birth,
    ));
  }
  return p;
}

/**
 * agate — concentric filled rings with alternating colors.
 *
 * Mimics the cross-section of an agate stone: opaque rings painted outside-in
 * so each inner ring covers the previous, leaving visible color bands.
 * Requires high opacity (≥ 0.90) for the banding effect to read clearly.
 *
 * Color slots:
 *   mold.color       — odd rings (1st, 3rd, …)
 *   mold.secondColor — even rings (2nd, 4th, …) — falls back to mold.color
 */
export function agate(ox, oy, maxR, startStep, mold, rng) {
  const p = [];
  const nRings = 6 + Math.round(rng() * 3);
  const altSpec = mold.secondColor ? ColorSpec.solid(mold.secondColor) : mold._colorSpec;

  // Outside → inside: innermost particle rendered last (on top)
  for (let i = 0; i < nRings; i++) {
    const frac  = 1 - i / nRings;
    const pSeed = (rng() * 0xFFFF) >>> 0;
    const cs    = (i % 2 === 0) ? mold._colorSpec : altSpec;
    const birth = startStep + Math.round((i / nRings) * mold.growSpeed * 0.30);
    p.push(gp(ox, oy, maxR * frac, mold.nPts ?? 14, pSeed,
      0.08 + rng() * 0.06, mold.growSpeed, cs, mold.opacity, birth));
  }
  return p;
}

/**
 * dots — scattered small round colonies across the dish.
 *
 * Mimics bacterial colonies: 15–37 small nearly-circular blobs placed
 * uniformly at random across the scatter radius, born at staggered steps.
 */
export function dots(ox, oy, maxR, startStep, mold, rng) {
  const p = [];
  const nDots = 15 + Math.round(rng() * 22);

  for (let i = 0; i < nDots; i++) {
    const r     = maxR * Math.sqrt(rng());   // sqrt for uniform disk distribution
    const a     = rng() * 2 * Math.PI;
    const pSeed = (rng() * 0xFFFF) >>> 0;
    const dotR  = maxR * (0.025 + rng() * 0.045);
    const birth = startStep + Math.round(rng() * mold.growSpeed * 0.80);
    p.push(gp(
      ox + r * Math.cos(a), oy + r * Math.sin(a),
      dotR, 7, pSeed, 0.10 + rng() * 0.10,
      5 + Math.round(rng() * 8),
      mold._colorSpec, mold.opacity, birth,
    ));
  }
  return p;
}

/**
 * branches — central hub with radiating lobes and optional sub-lobes.
 */
export function branches(ox, oy, maxR, startStep, mold, rng) {
  const p = [];

  const hubSeed = (rng() * 0xFFFF) >>> 0;
  p.push(gp(ox, oy, maxR * 0.14, mold.nPts, hubSeed, 0.4, 10, mold._colorSpec, mold.opacity, startStep));

  for (let i = 0; i < 6; i++) {
    const a     = (i / 6) * 2 * Math.PI + (rng() - 0.5) * 0.4;
    const dist  = maxR * (0.35 + rng() * 0.3);
    const br    = maxR * (0.18 + rng() * 0.1);
    const pSeed = (rng() * 0xFFFF) >>> 0;
    const birth = startStep + Math.round(i / 6 * mold.growSpeed * 0.8);

    p.push(gp(
      ox + dist * Math.cos(a),
      oy + dist * Math.sin(a),
      br, mold.nPts, pSeed, mold.vary, 15, mold._colorSpec, mold.opacity * 0.8, birth,
    ));

    // Sub-lobe — added only if it fits within the dish territory.
    if (rng() > 0.4) {
      const a2   = a + (rng() - 0.5) * 0.6;
      const d2   = dist + br * (0.7 + rng() * 0.4);
      if (d2 < maxR * 0.92) {
        const subSeed = (rng() * 0xFFFF) >>> 0;
        p.push(gp(
          ox + d2 * Math.cos(a2),
          oy + d2 * Math.sin(a2),
          br * (0.4 + rng() * 0.3), 8, subSeed, mold.vary, 12,
          mold._colorSpec, mold.opacity * 0.65,
          startStep + Math.round((i / 6 * 0.8 + 0.2) * mold.growSpeed),
        ));
      }
    }
  }

  return p;
}
