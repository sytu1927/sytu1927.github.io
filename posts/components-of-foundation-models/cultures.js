/**
 * cultures.js — post-level color palette and mold factories.
 *
 * This file is specific to the "Components of Foundation Models" post.
 * The petri/ directory is a generic rendering library; this is the config.
 *
 * Usage in index.qmd:
 *   import { C, spread, fluffy, slime, ... } from "./cultures.js";
 */

// ── Palette ───────────────────────────────────────────────────────────────────

export const C = {
  // Core blog palette
  near:    '#1C1410',
  accentL: '#BCB4FF',
  accent:  '#6060C8',
  accentD: '#4848A8',
  muted:   '#7A6050',
  ghost:   '#B0988A',
  peach:   '#FFBe98',
  lemon:   '#E9FC87',

  // Vivid dish palette — agar backgrounds and spread organisms
  pink:    '#FF4FA0',
  magenta: '#CC44BB',
  teal:    '#14B8A6',
  cobalt:  '#3B82F6',
  green:   '#22C55E',
  orange:  '#F97316',
  crimson: '#DC2626',
  purple:  '#7C3AED',
  violet:  '#8B5CF6',
  amber:   '#F59E0B',
  rose:    '#FB7185',
  sky:     '#38BDF8',
  lime:    '#A3E635',
  mint:    '#A8DDD0',

  // Biological mold body colors (desaturated, grey-green, earthy)
  moss:    '#7A8A78',
  ash:     '#9AA4A0',
  forest:  '#546454',
  dust:    '#A8A49C',
  slate:   '#6A7C80',
  lobeL:   '#C4CCC0',   // light lobe color for fluffy molds
  lobeAsh: '#D8E0DC',   // lighter ash lobe
  lobeMoss:'#B4BEB0',   // mid lobe
};

// ── Mold factories ────────────────────────────────────────────────────────────
// Each factory returns a plain mold config with sensible defaults.
// Pass origin and startStep; override any other property as needed.

export const spread   = (cfg) => ({ pattern: 'even',     opacity: 0.38, maxR: 0.60, growSpeed: 32, vary: 0.72, nPts: 13, ...cfg });
export const blob     = (cfg) => ({ pattern: 'even',     opacity: 0.72, maxR: 0.55, growSpeed: 30, vary: 0.80, nPts: 14, ...cfg });
export const fluffy   = (cfg) => ({ pattern: 'fluffy',   opacity: 0.90, maxR: 0.42, growSpeed: 35, vary: 0.35, nPts: 12, intersection: 'overlap', color: C.moss, secondColor: C.lobeMoss, ...cfg });
export const rings    = (cfg) => ({ pattern: 'rings',    opacity: 0.82, maxR: 0.88, growSpeed: 55, vary: 0.25, nPts: 14, color: C.accentL, secondColor: C.accentD, ...cfg });
export const tendrils = (cfg) => ({ pattern: 'tendrils', opacity: 0.72, maxR: 0.82, growSpeed: 70, vary: 0.50, nPts: 9,  color: C.lemon, ...cfg });
export const branches = (cfg) => ({ pattern: 'branches', opacity: 0.72, maxR: 0.82, growSpeed: 65, vary: 0.65, nPts: 12, color: C.near,  ...cfg });
export const slime    = (cfg) => ({ pattern: 'slime',    opacity: 0.75, maxR: 0.75, growSpeed: 52, color: '#1A0A08', ...cfg });
