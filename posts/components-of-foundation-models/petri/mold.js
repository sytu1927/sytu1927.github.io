/**
 * mold.js — Mold class.
 *
 * A Mold is a reusable type definition for a microbial colony. It describes
 * the visual and growth attributes of one kind of organism; it does not know
 * its position in the dish.
 *
 * To place a mold in a dish, see Culture (culture.js):
 *   { type: moldInstance, origin: [fx, fy], startStep: N }
 *
 * Attributes:
 *   color        hex string — primary/dominant organism color
 *   secondColor  hex string — optional secondary color; meaning depends on pattern:
 *                             rings   → aged inner-ring color (old growth shifts here)
 *                             fluffy  → lobe color (lighter, fuzzier edge)
 *   opacity      0–1
 *   texture      'solid' | 'hatch'
 *   pattern      'even' | 'rings' | 'tendrils' | 'branches'
 *   intersection 'overlap'  — this mold grows freely through neighbors
 *                'collide'  — growth stops at the boundary of other collide molds
 *   maxR         max radius as a fraction of the dish radius (0–1)
 *   growSpeed    training steps to reach maxR
 *   vary         shape variance: 0 = circle, 1 = amoeba
 *   nPts         number of Catmull-Rom control points (more = smoother blobs)
 */

import { ColorSpec } from './color-spec.js';
import * as Patterns from './patterns.js';

const PATTERN_FNS = {
  even:     Patterns.even,
  rings:    Patterns.rings,
  tendrils: Patterns.tendrils,
  branches: Patterns.branches,
  fluffy:   Patterns.fluffy,
  slime:    Patterns.slime,
};

export class Mold {
  constructor({
    color        = '#7A6050',
    secondColor  = null,
    opacity      = 0.75,
    texture      = 'solid',
    pattern      = 'even',
    intersection = 'overlap',
    maxR         = 0.65,
    growSpeed    = 20,
    vary         = 0.6,
    nPts         = 10,
  } = {}) {
    this.color        = color;
    this.secondColor  = secondColor;
    this.opacity      = opacity;
    this.texture      = texture;
    this.pattern      = pattern;
    this.intersection = intersection;
    this.maxR         = maxR;
    this.growSpeed    = growSpeed;
    this.vary         = vary;
    this.nPts         = nPts;

    // Computed ColorSpec used as the default fill for pattern functions.
    this._colorSpec = this._buildColorSpec();
  }

  _buildColorSpec() {
    if (this.texture === 'hatch') {
      return ColorSpec.hatch(this.color, { spacing: 5, angle: 45, weight: 1.5 });
    }
    return ColorSpec.solid(this.color);
  }

  /**
   * Generate particles for one instance of this mold.
   *
   * @param {number}   ox          origin x in SVG coords
   * @param {number}   oy          origin y in SVG coords
   * @param {number}   dishR       dish radius in SVG units (for context)
   * @param {number}   startStep   training step when this instance starts growing
   * @param {number}   maxAllowed  actual max radius in SVG units
   *                               (may be less than maxR*dishR for collide molds)
   * @param {function} rng         seeded PRNG
   * @returns {object[]} flat particle array
   */
  generateParticles(ox, oy, dishR, startStep, maxAllowed, rng) {
    const fn = PATTERN_FNS[this.pattern] ?? Patterns.even;
    return fn(ox, oy, maxAllowed, startStep, this, rng);
  }
}
