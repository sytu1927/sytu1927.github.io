import { PetriPalette } from "./palette.js";
import { C }           from "./color-spec.js";

// Four vivid chromogenic agars — one per column.
const a1 = { color: '#A8B820', opacity: 0.48 }; // lime-yellow
const a2 = { color: '#9050C8', opacity: 0.24 }; // soft violet
const a3 = { color: '#1858C8', opacity: 0.26 }; // cobalt blue
const a4 = { color: '#28B080', opacity: 0.30 }; // vivid teal-green

// Mold palette — medium grey-green, matching real Aspergillus/Penicillium.
// Not near-black; visible texture against vivid agar.
const M = {
  niger:  { color: '#606860', secondColor: '#909890' }, // medium grey
  fumi:   { color: '#587868', secondColor: '#88A898' }, // sage-grey
  flavus: { color: '#68684C', secondColor: '#98987A' }, // olive-grey
  penic:  { color: '#507080', secondColor: '#80A0B0' }, // slate-teal
  purp:   { color: '#5C5870', secondColor: '#8C88A0' }, // purple-grey
};

new PetriPalette({
  container: '#petri-root',
  dishes: [

    // Dish 1 — vivid colony chaos (lime agar)
    { seed: 42, agar: a1, molds: [
      { growth: 'spread', color: '#F88820', opacity: 0.75, maxR: 0.65, growSpeed: 40, vary: 0.82, nPts: 16, origin: [ 0.12, -0.04], startStep:  0 },
      { growth: 'spread', color: '#08C8A8', opacity: 0.68, maxR: 0.72, growSpeed: 44, vary: 0.82, nPts: 16, origin: [-0.14,  0.10], startStep:  2 },
      { growth: 'spread', color: '#E82040', opacity: 0.72, maxR: 0.48, growSpeed: 34, vary: 0.78, nPts: 14, origin: [-0.44, -0.30], startStep:  3 },
      { growth: 'spread', color: '#D030A0', opacity: 0.68, maxR: 0.42, growSpeed: 30, vary: 0.80, nPts: 13, origin: [ 0.26,  0.34], startStep:  1 },
      { growth: 'fluffy', ...M.fumi,  opacity: 0.88, maxR: 0.26, growSpeed: 28, vary: 0.44, nPts: 10, origin: [-0.20, -0.44], startStep: 14 },
      { growth: 'fluffy', ...M.fumi,  opacity: 0.84, maxR: 0.22, growSpeed: 24, vary: 0.42, nPts:  9, origin: [ 0.28, -0.42], startStep: 18 },
      { growth: 'lace',   ...M.flavus, opacity: 0.82, maxR: 0.26, growSpeed: 36, vary: 0.26,          origin: [-0.08,  0.44], startStep: 20 },
      { growth: 'fluffy', ...M.penic, opacity: 0.88, maxR: 0.32, growSpeed: 30, vary: 0.42, nPts: 12, origin: [ 0.46, -0.26], startStep: 22 },
      { growth: 'fluffy', ...M.penic, opacity: 0.84, maxR: 0.28, growSpeed: 26, vary: 0.38, nPts: 10, origin: [ 0.44,  0.42], startStep: 30 },
      ...Array.from({ length: 26 }, (_, i) => {
        const r = Math.sqrt(((i * 11 + 3) % 26) / 26) * 0.82;
        const a = i * 2.3999632;
        return {
          growth: 'even', nPts: 9,
          color:     i % 3 === 0 ? '#EEE8D8' : (i % 3 === 1 ? '#F8F4EC' : '#F0EDE4'),
          opacity:   0.95 + (i % 3) * 0.015,
          maxR:      0.042 + (i % 7) * 0.016,
          growSpeed: 7 + (i % 6) * 2,
          vary:      0.20 + (i % 5) * 0.06,
          origin:    [r * Math.cos(a), r * Math.sin(a)],
          startStep: 13 + Math.round(i * 1.9),
        };
      }),
      { growth: 'agate', color: '#EAE4D4', secondColor: '#C8A050', opacity: 0.94, maxR: 0.17, growSpeed: 34, origin: [-0.03, 0.47], startStep: 26 },
    ]},

    // Dish 2 — vivid teal pool + white satellite ring (violet agar)
    { seed: 77, agar: a2, molds: [
      { growth: 'spread', color: '#10C0A8', opacity: 0.68, maxR: 0.80, growSpeed: 48, vary: 0.72, nPts: 15, origin: [0, 0], startStep: 0 },
      { growth: 'fluffy', ...M.fumi, opacity: 0.88, maxR: 0.28, growSpeed: 26, vary: 0.34, nPts: 11, origin: [0, 0], startStep: 8 },
      ...Array.from({ length: 8 }, (_, i) => ({
        growth: 'even', nPts: 9,
        color:     i % 2 === 0 ? '#F4F0E4' : '#EEE8DC',
        opacity:   0.95, maxR: 0.11, growSpeed: 10, vary: 0.24,
        origin:    [0.44 * Math.cos(i * Math.PI / 4), 0.44 * Math.sin(i * Math.PI / 4)],
        startStep: 18 + i * 3,
      })),
      { growth: 'slime', color: '#181008', opacity: 0.72, maxR: 0.65, origin: [0.06, 0.04], startStep: 44 },
    ]},

    // Dish 3 — periwinkle concentric rings (cobalt agar)
    { seed: 15, agar: a3, molds: [
      { growth: 'rings', color: C.accentL, secondColor: C.accentD, opacity: 0.92, maxR: 0.86, growSpeed: 52, vary: 0.22, nPts: 14, origin: [0, 0], startStep: 0 },
    ]},

    // Dish 4 — dark branches on teal
    { seed: 7, agar: a4, molds: [
      { growth: 'branches', color: '#1C1414', opacity: 0.88, maxR: 0.84, growSpeed: 60, vary: 0.58, nPts: 12, origin: [0, 0], startStep: 0 },
      { growth: 'even',     color: '#F0EAD8', opacity: 0.82, maxR: 0.24, growSpeed: 20, vary: 0.42, nPts: 10, origin: [0.06, 0.04], startStep: 30 },
    ]},

    // Dish 5 — crimson + magenta tendrils (lime agar)
    { seed: 99, agar: a1, molds: [
      { growth: 'tendrils', color: '#C82248', opacity: 0.90, maxR: 0.84, growSpeed: 68, vary: 0.52, nPts: 9, origin: [0.00, 0.00], startStep:  0 },
      { growth: 'tendrils', color: '#8C2890', opacity: 0.74, maxR: 0.65, growSpeed: 56, vary: 0.48, nPts: 9, origin: [0.06, 0.03], startStep: 15 },
    ]},

    // Dish 6 — packed mold colonies (violet agar: yellow-green spread + medium grey molds)
    { seed: 55, agar: a2, molds: [
      { growth: 'spread',  color: '#C8C820', opacity: 0.50, maxR: 0.72, growSpeed: 40, vary: 0.72, nPts: 14, origin: [ 0.05,  0.00], startStep:  0 },
      { growth: 'fluffy', ...M.niger,  opacity: 0.90, intersection: 'collide', maxR: 0.38,                              origin: [ 0.40,  0.10], startStep:  5 },
      { growth: 'fluffy', ...M.fumi,   opacity: 0.88, intersection: 'collide', maxR: 0.34, growSpeed: 30, vary: 0.30,   origin: [-0.30,  0.42], startStep: 10 },
      { growth: 'fluffy', ...M.flavus, opacity: 0.86, intersection: 'collide', maxR: 0.32, growSpeed: 28, vary: 0.40, nPts: 11, origin: [ 0.15, -0.48], startStep: 14 },
      { growth: 'fluffy', ...M.penic,  opacity: 0.88, intersection: 'collide', maxR: 0.36, vary: 0.32,                 origin: [-0.46, -0.18], startStep: 18 },
      { growth: 'fluffy', ...M.purp,   opacity: 0.86, intersection: 'collide', maxR: 0.38,                              origin: [ 0.32,  0.42], startStep: 22 },
      { growth: 'fluffy', ...M.fumi,   opacity: 0.88, intersection: 'collide', maxR: 0.34, growSpeed: 30, vary: 0.30,   origin: [-0.08,  0.12], startStep: 26 },
      { growth: 'fluffy', ...M.niger,  opacity: 0.86, intersection: 'collide', maxR: 0.32, growSpeed: 28, vary: 0.40, nPts: 11, origin: [ 0.44, -0.30], startStep: 30 },
    ]},

    // Dish 7 — white→periwinkle spiral (cobalt agar)
    { seed: 13, agar: a3, molds: (() => {
      const turns = 2.5, nBlobs = 14;
      return Array.from({ length: nBlobs }, (_, i) => {
        const t = i / nBlobs;
        const a = t * turns * 2 * Math.PI;
        const r = 0.10 + t * 0.76;
        return {
          growth: 'even', nPts: 11,
          color:     i < 5 ? '#F4F0E8' : (i < 10 ? '#BCB4FF' : '#E0DCFC'),
          opacity:   0.90 + t * 0.08,
          maxR:      0.13 + t * 0.06,
          growSpeed: 10,
          vary:      0.60,
          origin:    [r * Math.cos(a), r * Math.sin(a)],
          startStep: Math.round(t * 68),
        };
      });
    })() },

    // Dish 8 — dense ecosystem (teal agar: pink + crimson spreads, medium grey molds)
    { seed: 23, agar: a4, molds: [
      { growth: 'spread',   color: '#D030A0', opacity: 0.58, maxR: 0.68, growSpeed: 38, vary: 0.75, nPts: 14, origin: [ 0.18,  0.12], startStep:  0 },
      { growth: 'spread',   color: '#D04840', opacity: 0.52, maxR: 0.58, vary: 0.70, nPts: 13,                origin: [-0.20, -0.15], startStep:  5 },
      { growth: 'rings',    color: C.accentL, secondColor: C.accentD, opacity: 0.72, maxR: 0.42, growSpeed: 30, nPts: 13, origin: [ 0.28, -0.26], startStep: 14 },
      { growth: 'rings',    color: C.accentL, secondColor: C.accentD, opacity: 0.72, maxR: 0.42, growSpeed: 30, nPts: 13, origin: [-0.08,  0.36], startStep: 20 },
      { growth: 'tendrils', color: '#D4D840', opacity: 0.64, maxR: 0.46, growSpeed: 40, nPts: 10,              origin: [ 0.10, -0.18], startStep: 22 },
      { growth: 'fluffy',   ...M.fumi,  opacity: 0.88, maxR: 0.36,                                             origin: [-0.34, -0.22], startStep: 20 },
      { growth: 'fluffy',   ...M.niger, opacity: 0.90, maxR: 0.38, growSpeed: 30, vary: 0.30,                  origin: [ 0.36,  0.20], startStep: 28 },
      { growth: 'fluffy',   ...M.penic, opacity: 0.86, maxR: 0.35, growSpeed: 28, vary: 0.40, nPts: 11,        origin: [-0.15,  0.38], startStep: 35 },
      { growth: 'slime',    color: '#1C1008', opacity: 0.74, maxR: 0.72, origin: [ 0.28,  0.24], startStep: 38 },
      { growth: 'slime',    color: '#080818', opacity: 0.70, maxR: 0.68, origin: [-0.28, -0.30], startStep: 46 },
    ]},

    // Dish 9 — dark lace garden (lime agar)
    { seed: 17, agar: a1, molds: [
      { growth: 'spread', color: '#10C8A0', opacity: 0.40, maxR: 0.75, growSpeed: 44, vary: 0.68, nPts: 13, origin: [-0.10,  0.08], startStep:  2 },
      { growth: 'lace',   ...M.fumi,   opacity: 0.90, maxR: 0.46,               origin: [ 0.00,  0.00], startStep:  0 },
      { growth: 'lace',   ...M.flavus, opacity: 0.86, maxR: 0.40, growSpeed: 36, origin: [ 0.44,  0.18], startStep: 10 },
      { growth: 'lace',   ...M.penic,  opacity: 0.88, maxR: 0.38, growSpeed: 38, origin: [-0.42, -0.20], startStep: 18 },
      { growth: 'lace',   ...M.niger,  opacity: 0.84, maxR: 0.36, growSpeed: 34, origin: [ 0.16, -0.46], startStep: 26 },
    ]},

    // Dish 10 — agate cross-sections (violet agar)
    { seed: 31, agar: a2, molds: [
      { growth: 'agate', color: '#D4A858', secondColor: '#F4E8C0', opacity: 0.94, maxR: 0.46, growSpeed: 42, origin: [ 0.00,  0.00], startStep:  0 },
      { growth: 'agate', color: '#B85040', secondColor: '#F0C0B0', opacity: 0.90, maxR: 0.40, growSpeed: 38, origin: [ 0.46,  0.20], startStep: 12 },
      { growth: 'agate', color: '#6888A8', secondColor: '#D8E8F4', opacity: 0.88, maxR: 0.36, growSpeed: 36, origin: [-0.38, -0.30], startStep: 20 },
    ]},

    // Dish 11 — white dots (cobalt agar: maximum contrast)
    { seed: 53, agar: a3, molds: [
      { growth: 'dots', color: '#F4F0E4', opacity: 0.97, maxR: 0.90, growSpeed: 32, origin: [0, 0], startStep:  0 },
      { growth: 'dots', color: '#E8E0D0', opacity: 0.88, maxR: 0.72, growSpeed: 26, origin: [0, 0], startStep: 10 },
      { growth: 'dots', color: '#D4C8B0', opacity: 0.74, maxR: 0.55, growSpeed: 20, origin: [0, 0], startStep: 20 },
    ]},

    // Dish 12 — mixed ecology (teal agar)
    { seed: 71, agar: a4, molds: [
      { growth: 'lace',  ...M.niger, opacity: 0.88, maxR: 0.42,                origin: [-0.30,  0.28], startStep:  0 },
      { growth: 'agate', color: '#C87040', secondColor: '#F0D0A0', opacity: 0.92, maxR: 0.38, growSpeed: 38, origin: [ 0.34, -0.22], startStep:  8 },
      { growth: 'dots',  color: '#F4F0E4', opacity: 0.92, maxR: 0.68, growSpeed: 28, origin: [ 0.06,  0.04], startStep: 16 },
      { growth: 'slime', color: '#1A0808', opacity: 0.74, maxR: 0.68, origin: [-0.08, -0.12], startStep: 36 },
    ]},

  ],
  columns: 4,
}).render();
