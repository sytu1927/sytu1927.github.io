/**
 * cultures.js — Mold type presets and dish (Culture) configurations.
 *
 * M holds reusable plain-object mold configs. Each entry is spread into the
 * Culture's molds array alongside origin and startStep placement:
 *   { ...M.fluffyMoss, origin: [0.44, 0.12], startStep: 10 }
 *
 * Layer convention (array order = render order, bottom → top):
 *   1. wash / spread molds  — large translucent background regions
 *   2. rings / branches     — structured mid-layer organisms
 *   3. fluffy molds         — opaque lobed colonies on top
 *   4. slime molds          — filamentous networks threading over everything
 */

import { Culture } from './culture.js';
import { C }       from './color-spec.js';
export { C };

// ── Mold type presets ─────────────────────────────────────────────────────────

export const M = {

  // ── Streak ──────────────────────────────────────────────────────────────────
  streakBody: { color: C.muted,  opacity: 0.78, pattern: 'even', maxR: 0.35, growSpeed: 22, vary: 0.72, nPts: 13 },
  streakCore: { color: C.near,   opacity: 0.55, pattern: 'even', maxR: 0.18, growSpeed: 15, vary: 0.50, nPts: 11 },

  // ── Patch ───────────────────────────────────────────────────────────────────
  patchMain:  { color: C.peach,   opacity: 0.72, pattern: 'even', maxR: 0.55, growSpeed: 30, vary: 0.80, nPts: 14 },
  patchSat:   { color: C.muted,   opacity: 0.55, pattern: 'even', maxR: 0.22, growSpeed: 20, vary: 0.85, nPts: 11 },
  patchHigh:  { color: C.lemon,   opacity: 0.45, pattern: 'even', maxR: 0.20, growSpeed: 18, vary: 0.70, nPts: 10 },

  // ── Rings ───────────────────────────────────────────────────────────────────
  ringsCore:  { color: C.accentL, secondColor: C.accentD, opacity: 0.82, pattern: 'rings', maxR: 0.88, growSpeed: 55, vary: 0.25, nPts: 14 },

  // ── Branches ────────────────────────────────────────────────────────────────
  branchMain:  { color: C.near,  opacity: 0.72, pattern: 'branches', maxR: 0.82, growSpeed: 65, vary: 0.65, nPts: 12 },
  branchGhost: { color: C.ghost, opacity: 0.45, pattern: 'even',     maxR: 0.25, growSpeed: 22, vary: 0.75, nPts: 11 },

  // ── Starburst ───────────────────────────────────────────────────────────────
  starMain:   { color: C.lemon,   opacity: 0.72, pattern: 'tendrils', maxR: 0.82, growSpeed: 70, vary: 0.50, nPts: 9 },
  starAccent: { color: C.accentL, opacity: 0.60, pattern: 'tendrils', maxR: 0.60, growSpeed: 60, vary: 0.50, nPts: 9 },

  // ── Foundation base layers ──────────────────────────────────────────────────
  foundBase:   { color: C.near,    opacity: 0.42, pattern: 'even',     maxR: 0.55, growSpeed: 35, vary: 0.80, nPts: 13 },
  foundRing:   { color: C.accentD, secondColor: C.accentL, opacity: 0.60, pattern: 'rings',    maxR: 0.42, growSpeed: 30, vary: 0.30, nPts: 13 },
  foundTend:   { color: C.peach,   opacity: 0.50, pattern: 'tendrils', maxR: 0.45, growSpeed: 40, vary: 0.65, nPts: 10 },

  // ── Vivid spread organisms ──────────────────────────────────────────────────
  spreadViolet: { color: C.violet,  opacity: 0.42, pattern: 'even', maxR: 0.68, growSpeed: 38, vary: 0.75, nPts: 14 },
  spreadPink:   { color: C.pink,    opacity: 0.36, pattern: 'even', maxR: 0.62, growSpeed: 32, vary: 0.72, nPts: 13 },
  spreadCobalt: { color: C.cobalt,  opacity: 0.38, pattern: 'even', maxR: 0.58, growSpeed: 30, vary: 0.70, nPts: 13 },
  spreadTeal:   { color: C.teal,    opacity: 0.36, pattern: 'even', maxR: 0.60, growSpeed: 34, vary: 0.73, nPts: 14 },
  spreadOrange: { color: C.orange,  opacity: 0.34, pattern: 'even', maxR: 0.56, growSpeed: 30, vary: 0.70, nPts: 13 },
  spreadRose:   { color: C.rose,    opacity: 0.38, pattern: 'even', maxR: 0.60, growSpeed: 32, vary: 0.72, nPts: 13 },
  spreadLime:   { color: C.lime,    opacity: 0.34, pattern: 'even', maxR: 0.55, growSpeed: 28, vary: 0.68, nPts: 12 },

  // ── Fluffy colonies — opaque lobed grey molds ────────────────────────────────
  // color = core (darker), secondColor = lobes (lighter/fuzzier edge)
  fluffyMoss:    { color: C.moss,    secondColor: C.lobeMoss, opacity: 0.90, pattern: 'fluffy', intersection: 'overlap', maxR: 0.42, growSpeed: 35, vary: 0.35, nPts: 12 },
  fluffyAsh:     { color: C.ash,     secondColor: C.lobeAsh,  opacity: 0.92, pattern: 'fluffy', intersection: 'overlap', maxR: 0.38, growSpeed: 30, vary: 0.30, nPts: 12 },
  fluffyForest:  { color: C.forest,  secondColor: C.lobeL,    opacity: 0.88, pattern: 'fluffy', intersection: 'overlap', maxR: 0.35, growSpeed: 28, vary: 0.40, nPts: 11 },
  fluffyDust:    { color: C.dust,    secondColor: C.lobeAsh,  opacity: 0.90, pattern: 'fluffy', intersection: 'overlap', maxR: 0.40, growSpeed: 32, vary: 0.32, nPts: 12 },
  fluffySlate:   { color: C.slate,   secondColor: C.lobeL,    opacity: 0.88, pattern: 'fluffy', intersection: 'overlap', maxR: 0.38, growSpeed: 30, vary: 0.36, nPts: 11 },

  // Collide variants — same morphology but respect territory boundaries
  fluffyMossC:   { color: C.moss,   secondColor: C.lobeMoss, opacity: 0.90, pattern: 'fluffy', intersection: 'collide', maxR: 0.38, growSpeed: 35, vary: 0.35, nPts: 12 },
  fluffyAshC:    { color: C.ash,    secondColor: C.lobeAsh,  opacity: 0.92, pattern: 'fluffy', intersection: 'collide', maxR: 0.34, growSpeed: 30, vary: 0.30, nPts: 12 },
  fluffyForestC: { color: C.forest, secondColor: C.lobeL,    opacity: 0.88, pattern: 'fluffy', intersection: 'collide', maxR: 0.32, growSpeed: 28, vary: 0.40, nPts: 11 },
  fluffyDustC:   { color: C.dust,   secondColor: C.lobeAsh,  opacity: 0.90, pattern: 'fluffy', intersection: 'collide', maxR: 0.36, growSpeed: 32, vary: 0.32, nPts: 12 },

  // ── Slime mold networks ──────────────────────────────────────────────────────
  slimeDark:    { color: '#1A0A08',  opacity: 0.78, pattern: 'slime', maxR: 0.78, growSpeed: 55 },
  slimeCrimson: { color: '#5A0A0A',  opacity: 0.72, pattern: 'slime', maxR: 0.72, growSpeed: 50 },
  slimeTeal:    { color: '#062A28',  opacity: 0.72, pattern: 'slime', maxR: 0.68, growSpeed: 48 },
  slimePurple:  { color: '#2A1040',  opacity: 0.70, pattern: 'slime', maxR: 0.70, growSpeed: 52 },

  // Cluster molds — scattered collide blobs
  cluster:    { color: C.peach, opacity: 0.72, pattern: 'even', intersection: 'collide', maxR: 0.35, growSpeed: 30, vary: 0.78, nPts: 13 },
  clusterAlt: { color: C.muted, opacity: 0.60, pattern: 'even', intersection: 'collide', maxR: 0.28, growSpeed: 26, vary: 0.72, nPts: 12 },
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

// ── Culture (dish) configurations ─────────────────────────────────────────────

export const cultures = {

  // Simple streak along a diagonal axis.
  streak: new Culture({
    agar: { color: C.mint, opacity: 0.22 },
    molds: [
      { ...M.streakBody, origin: [-0.44, -0.08], startStep:  0 },
      { ...M.streakBody, origin: [ 0.00,  0.00], startStep:  5 },
      { ...M.streakBody, origin: [ 0.44,  0.08], startStep: 10 },
      { ...M.streakCore, origin: [-0.10, -0.02], startStep:  8 },
      { ...M.streakCore, origin: [ 0.10,  0.02], startStep: 10 },
    ],
  }),

  // Dense central colony with satellite growth, fluffy on top.
  patch: new Culture({
    agar: { color: C.mint, opacity: 0.22 },
    molds: [
      { ...M.spreadRose,  origin: [ 0.05,  0.05], startStep:  0 },
      { ...M.patchMain,   origin: [ 0.00,  0.00], startStep:  5 },
      { ...M.patchSat,    origin: [ 0.35, -0.20], startStep: 15 },
      { ...M.patchSat,    origin: [-0.30,  0.30], startStep: 20 },
      { ...M.patchHigh,   origin: [ 0.08, -0.07], startStep: 25 },
      { ...M.fluffyDust,  origin: [ 0.20,  0.18], startStep: 30 },
    ],
  }),

  // Concentric age-gradient rings.
  rings: new Culture({
    agar: { color: C.mint, opacity: 0.22 },
    molds: [
      { ...M.ringsCore, origin: [0, 0], startStep: 0 },
    ],
  }),

  // Branching lobes from a central hub.
  branches: new Culture({
    agar: { color: C.mint, opacity: 0.22 },
    molds: [
      { ...M.branchMain,  origin: [0, 0],        startStep:  0 },
      { ...M.branchGhost, origin: [0.08, 0.04],  startStep: 30 },
    ],
  }),

  // Radiating tendrils — high visual complexity.
  starburst: new Culture({
    agar: { color: C.mint, opacity: 0.22 },
    molds: [
      { ...M.starMain,   origin: [ 0.00,  0.00], startStep:  0 },
      { ...M.starAccent, origin: [ 0.06,  0.03], startStep: 15 },
    ],
  }),

  // Scattered fluffy colonies that collide at territory boundaries.
  clusters: new Culture({
    agar: { color: C.mint, opacity: 0.22 },
    molds: [
      { ...M.spreadViolet,  origin: [ 0.05,  0.00], startStep:  0 },
      { ...M.fluffyMossC,   origin: [ 0.40,  0.10], startStep:  5 },
      { ...M.fluffyAshC,    origin: [-0.30,  0.42], startStep: 10 },
      { ...M.fluffyForestC, origin: [ 0.15, -0.48], startStep: 14 },
      { ...M.fluffyDustC,   origin: [-0.46, -0.18], startStep: 18 },
      { ...M.fluffyMossC,   origin: [ 0.32,  0.42], startStep: 22 },
      { ...M.fluffyAshC,    origin: [-0.08,  0.12], startStep: 26 },
      { ...M.fluffyForestC, origin: [ 0.44, -0.30], startStep: 30 },
    ],
  }),

  // Logarithmic spiral — blobs arranged along a 2.5-turn arm.
  spiral: new Culture({
    agar: { color: C.mint, opacity: 0.22 },
    molds: (() => {
      const turns = 2.5, nBlobs = 14;
      return Array.from({ length: nBlobs }, (_, i) => {
        const t = i / nBlobs;
        const a = t * turns * 2 * Math.PI;
        const r = 0.1 + t * 0.75;
        return {
          color:       i < 5 ? C.accentD : (i < 10 ? C.accent : C.accentL),
          secondColor: i < 5 ? C.accentL : null,
          opacity:     0.68 + t * 0.20,
          pattern:     'even',
          maxR:        0.14 + t * 0.06,
          growSpeed:   10,
          vary:        0.65,
          origin:      [r * Math.cos(a), r * Math.sin(a)],
          startStep:   Math.round(t * 70),
        };
      });
    })(),
  }),

  // Dense multi-mold coverage with fluffy and slime layers.
  foundation: new Culture({
    agar: { color: C.mint, opacity: 0.22 },
    molds: [
      // Background spreads
      { ...M.spreadViolet, origin: [ 0.18,  0.12], startStep:  0 },
      { ...M.spreadCobalt, origin: [-0.20, -0.15], startStep:  5 },
      { ...M.foundBase,    origin: [ 0.00,  0.28], startStep:  8 },
      // Mid-layer structured growth
      { ...M.foundRing,    origin: [ 0.28, -0.26], startStep: 15 },
      { ...M.foundRing,    origin: [-0.08,  0.36], startStep: 20 },
      { ...M.foundTend,    origin: [ 0.10, -0.18], startStep: 22 },
      // Fluffy colonies on top
      { ...M.fluffyMoss,   origin: [-0.34, -0.22], startStep: 20 },
      { ...M.fluffyAsh,    origin: [ 0.36,  0.20], startStep: 28 },
      { ...M.fluffyForest, origin: [-0.15,  0.38], startStep: 35 },
      // Slime networks threading over everything — two origins, offset
      { ...M.slimeDark,    origin: [ 0.30,  0.25], startStep: 38 },
      { ...M.slimePurple,  origin: [-0.28, -0.30], startStep: 46 },
    ],
  }),

  // Scattered fluffy colonies on vivid agar with slime threading through.
  colony: new Culture({
    agar: { color: C.mint, opacity: 0.22 },
    molds: [
      // Translucent colored wash underneath
      { ...M.spreadViolet, origin: [-0.08,  0.05], startStep:  0 },
      { ...M.spreadTeal,   origin: [ 0.15, -0.10], startStep:  8 },
      // Fluffy grey colonies — appear in sequence around the dish
      { ...M.fluffyMoss,   origin: [ 0.44,  0.12], startStep: 10 },
      { ...M.fluffyAsh,    origin: [-0.40,  0.28], startStep: 16 },
      { ...M.fluffyDust,   origin: [ 0.18, -0.44], startStep: 20 },
      { ...M.fluffySlate,  origin: [-0.44, -0.22], startStep: 24 },
      { ...M.fluffyMoss,   origin: [ 0.30,  0.40], startStep: 28 },
      { ...M.fluffyForest, origin: [-0.12,  0.44], startStep: 32 },
      { ...M.fluffyAsh,    origin: [ 0.44, -0.30], startStep: 36 },
      // Slime network grows last — origin offset so it reads differently per seed
      { ...M.slimeCrimson, origin: [ 0.22, -0.18], startStep: 42 },
      { ...M.slimeTeal,    origin: [-0.28,  0.20], startStep: 50 },
    ],
  }),

};
