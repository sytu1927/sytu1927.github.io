/**
 * culture.js — Culture class (dish configuration).
 *
 * A Culture holds a flat array of mold config objects, each specifying:
 *
 *   growth       string        — 'even'|'spread'|'rings'|'tendrils'|'branches'|
 *                                'fluffy'|'slime'|'lace'|'agate'|'dots'
 *   color        string        — primary fill color
 *   secondColor  string|null   — lobe/ring secondary color (optional)
 *   opacity      number        — max opacity 0–1
 *   intersection string        — 'overlap'|'collide' (default 'overlap')
 *   maxR         number        — max radius as fraction of dish radius
 *   growSpeed    number        — steps to grow to full size
 *   vary         number        — shape variance 0–1
 *   nPts         number        — Catmull-Rom control point count
 *   origin       [fx, fy]      — position as fraction of dish radius from center
 *   startStep    number        — training step when this mold begins growing
 *
 * Library-level defaults for each growth type are in GROWTH_DEFAULTS; only
 * specify the properties you want to override in your mold config object.
 *
 * Culture.generateParticles() resolves every mold config into a flat particle
 * array, applying 'collide' intersection logic (each collide mold's growth radius
 * is capped at half the distance to its nearest collide neighbor).
 */

import * as Patterns from './patterns.js';
import { ColorSpec, C } from './color-spec.js';

// ── Library defaults per growth type ──────────────────────────────────────────

const GROWTH_DEFAULTS = {
  spread:   { opacity: 0.38, maxR: 0.60, growSpeed: 32, vary: 0.72, nPts: 13 },
  even:     { opacity: 0.72, maxR: 0.55, growSpeed: 30, vary: 0.80, nPts: 14 },
  fluffy:   { color: C.moss, secondColor: C.lobeMoss, opacity: 0.90, maxR: 0.42, growSpeed: 35, vary: 0.35, nPts: 12, intersection: 'overlap' },
  rings:    { color: C.accentL, secondColor: C.accentD, opacity: 0.82, maxR: 0.88, growSpeed: 55, vary: 0.25, nPts: 14 },
  tendrils: { color: C.lemon, opacity: 0.72, maxR: 0.82, growSpeed: 70, vary: 0.50, nPts: 9  },
  branches: { color: C.near,  opacity: 0.72, maxR: 0.82, growSpeed: 65, vary: 0.65, nPts: 12 },
  slime:    { color: '#1A0A08', opacity: 0.75, maxR: 0.75, growSpeed: 52 },
  lace:     { color: C.ash, secondColor: C.lobeAsh, opacity: 0.88, maxR: 0.46, growSpeed: 40, vary: 0.20, nPts: 10 },
  agate:    { color: C.violet, secondColor: '#ECE8F8', opacity: 0.95, maxR: 0.50, growSpeed: 45, vary: 0.12, nPts: 14 },
  dots:     { color: '#EDE8E0', opacity: 0.92, maxR: 0.88, growSpeed: 30 },
};

const PATTERN_FNS = {
  spread:   Patterns.even,
  even:     Patterns.even,
  fluffy:   Patterns.fluffy,
  rings:    Patterns.rings,
  tendrils: Patterns.tendrils,
  branches: Patterns.branches,
  slime:    Patterns.slime,
  lace:     Patterns.lace,
  agate:    Patterns.agate,
  dots:     Patterns.dots,
};

function colorSpecFor({ color = '#888888', texture, fill, growth } = {}) {
  if (texture === 'hatch') return ColorSpec.hatch(color, { spacing: 5, angle: 45, weight: 1.5 });
  if (fill === 'solid') return ColorSpec.solid(color);
  // Round blob growth types get a radial gradient by default for volumetric depth.
  // Use fill:'solid' on a mold to opt out.
  if (fill === 'radial' || (!fill && (growth === 'even' || growth === 'spread'))) {
    return ColorSpec.blob(color);
  }
  return ColorSpec.solid(color);
}

export class Culture {
  /**
   * @param {object} config
   * @param {Array}  config.molds  flat mold config objects (see file header)
   * @param {object} [config.agar]            dish background medium
   * @param {string} [config.agar.color]      fill color
   * @param {number} [config.agar.opacity]    fill opacity 0–1
   */
  constructor({ molds = [], agar = {} } = {}) {
    this._molds = molds;
    this.agar   = { color: '#F4F4F8', opacity: 0.14, ...agar };
  }

  /**
   * @param {number}   cx   dish center x in SVG units
   * @param {number}   cy   dish center y in SVG units
   * @param {number}   R    dish radius in SVG units
   * @param {function} rng  seeded PRNG
   * @returns {object[]} flat particle array for all molds in this culture
   */
  generateParticles(cx, cy, R, rng) {
    // Resolve fractional origins to SVG coordinates, merging growth defaults.
    const instances = this._molds.map(m => {
      const growth   = m.growth ?? m.pattern ?? 'even';
      const defaults = GROWTH_DEFAULTS[growth] ?? {};
      const merged   = { ...defaults, ...m, growth };
      return {
        config: merged,
        ox: cx + (merged.origin?.[0] ?? 0) * R,
        oy: cy + (merged.origin?.[1] ?? 0) * R,
        startStep: merged.startStep ?? 0,
      };
    });

    const particles = [];

    instances.forEach(({ config, ox, oy, startStep }, i) => {
      let maxAllowed = (config.maxR ?? 0.65) * R;

      // Collide mode: limit radius to half the distance to the nearest other
      // collide mold so that territories meet rather than overlap.
      if (config.intersection === 'collide') {
        let nearest = Infinity;
        instances.forEach(({ config: other, ox: ox2, oy: oy2 }, j) => {
          if (i !== j && other.intersection === 'collide') {
            const dx = ox - ox2, dy = oy - oy2;
            nearest = Math.min(nearest, Math.sqrt(dx * dx + dy * dy));
          }
        });
        if (nearest < Infinity) maxAllowed = Math.min(maxAllowed, nearest * 0.52);
      }

      const ctx     = { ...config, _colorSpec: colorSpecFor(config) };
      const fn      = PATTERN_FNS[config.growth] ?? Patterns.even;
      const isFuzzy = ['fluffy', 'lace'].includes(config.growth);
      fn(ox, oy, maxAllowed, startStep, ctx, rng).forEach(p => {
        particles.push({ ...p, _growth: config.growth, _isFuzzy: isFuzzy });
      });
    });

    return particles;
  }
}
