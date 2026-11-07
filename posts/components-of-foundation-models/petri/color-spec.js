/**
 * color-spec.js — ColorSpec: a typed color definition.
 *
 * Supported types:
 *   solid    — plain hex/rgb fill
 *   radial   — radial gradient, center → edge
 *   linear   — linear gradient along an angle
 *   hatch    — repeating line texture pattern
 *   age      — interpolates between two colors as a particle ages
 *
 * ColorSpec is pure data — no D3 or DOM imports.
 * Dish.js reads .needsDefs / .defSpec to build SVG <defs> elements,
 * and calls .fill(opts) to get the right SVG fill value at render time.
 *
 * Usage:
 *   ColorSpec.solid('#6060C8')
 *   ColorSpec.radial(['#BCB4FF', '#4848A8'])
 *   ColorSpec.linear(['#E9FC87', '#6060C8'], 90)
 *   ColorSpec.hatch('#7A6050', { spacing: 5, angle: 45 })
 *   ColorSpec.age('#BCB4FF', '#1C1410', { over: 40 })
 *
 *   // Plain strings are auto-promoted by toColorSpec():
 *   toColorSpec('#6060C8')  → ColorSpec.solid('#6060C8')
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

  // Vivid dish palette
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

  // Biological mold body colors
  moss:    '#7A8A78',
  ash:     '#9AA4A0',
  forest:  '#546454',
  dust:    '#A8A49C',
  slate:   '#6A7C80',
  lobeL:   '#C4CCC0',
  lobeAsh: '#D8E0DC',
  lobeMoss:'#B4BEB0',
};

// ── Internal helpers ──────────────────────────────────────────────────────────

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const m = full.match(/.{2}/g);
  return m ? m.map(x => parseInt(x, 16)) : [128, 128, 128];
}

function lerpColor(a, b, t) {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return `rgb(${Math.round(ar + (br - ar) * t)},` +
             `${Math.round(ag + (bg - ag) * t)},` +
             `${Math.round(ab + (bb - ab) * t)})`;
}

// Accept both shorthand string arrays and explicit {at, color} stop objects.
function normalizeStops(stops) {
  if (!stops || stops.length === 0) return [];
  if (typeof stops[0] === 'string') {
    return stops.map((color, i) => ({ at: i / Math.max(stops.length - 1, 1), color }));
  }
  return stops;
}

// ── ColorSpec class ───────────────────────────────────────────────────────────

export class ColorSpec {
  constructor(def) {
    // Accept bare strings as a solid shorthand.
    this._def = typeof def === 'string' ? { type: 'solid', value: def } : { ...def };
  }

  get type() { return this._def.type; }

  /**
   * Most representative hex/rgb value — used by the Canvas renderer to build
   * gradients without parsing the full def structure.
   */
  get baseColor() {
    const d = this._def;
    if (d.type === 'solid') return d.value;
    if (d.type === 'radial') {
      const stops = normalizeStops(d.stops ?? []);
      return stops[Math.min(1, stops.length - 1)]?.color ?? '#888888';
    }
    if (d.type === 'age') return d.from;
    return d.color ?? d.value ?? '#888888';
  }

  /**
   * True if this spec must be re-evaluated every render step.
   * Dish will call .fill({ t, birth }) per frame for dynamic specs.
   */
  get isDynamic() {
    return this._def.type === 'age';
  }

  /**
   * True if this spec requires a <defs> element in the SVG.
   * Dish calls .defSpec and builds the element once at dish creation.
   */
  get needsDefs() {
    return ['radial', 'linear', 'hatch'].includes(this._def.type);
  }

  /**
   * Plain description of the SVG <defs> element to create.
   * Dish reads this and builds the actual D3 elements — ColorSpec stays DOM-free.
   *
   * Returns one of:
   *   { kind: 'gradient', gradientType: 'radialGradient'|'linearGradient',
   *     attrs: {...}, stops: [{at, color}] }
   *   { kind: 'pattern', attrs: {...}, children: [{ tag, attrs }] }
   *   null  — for types that don't need defs
   */
  get defSpec() {
    const d = this._def;

    if (d.type === 'radial') {
      return {
        kind: 'gradient',
        gradientType: 'radialGradient',
        attrs: { cx: '50%', cy: '50%', r: '50%',
                 fx: d.focalX ?? d.focal ?? '40%',
                 fy: d.focalY ?? d.focal ?? '35%' },
        stops: normalizeStops(d.stops),
      };
    }

    if (d.type === 'linear') {
      const a = ((d.angle ?? 0) * Math.PI) / 180;
      return {
        kind: 'gradient',
        gradientType: 'linearGradient',
        attrs: {
          x1: `${50 - Math.cos(a) * 50}%`, y1: `${50 - Math.sin(a) * 50}%`,
          x2: `${50 + Math.cos(a) * 50}%`, y2: `${50 + Math.sin(a) * 50}%`,
        },
        stops: normalizeStops(d.stops),
      };
    }

    if (d.type === 'hatch') {
      const sp = d.spacing ?? 5;
      return {
        kind: 'pattern',
        attrs: { width: sp, height: sp,
                 patternUnits: 'userSpaceOnUse',
                 patternTransform: `rotate(${d.angle ?? 45})` },
        children: [{
          tag: 'line',
          attrs: { x1: 0, y1: 0, x2: 0, y2: sp,
                   stroke: d.color, 'stroke-width': d.weight ?? 1 },
        }],
      };
    }

    return null;
  }

  /**
   * SVG fill value for a particle at render time.
   *
   * For solid / gradient / hatch: the fill is static; call once at creation.
   *   Pass { id } to get the url(#id) reference for gradient/hatch types.
   * For age: returns an interpolated color; call every render step with { t, birth }.
   *
   * @param {{ id?: string, t?: number, birth?: number }} opts
   * @returns {string} CSS fill value
   */
  fill({ id, t, birth } = {}) {
    const d = this._def;

    if (d.type === 'solid') return d.value;

    if (d.type === 'radial' || d.type === 'linear' || d.type === 'hatch') {
      if (id) return `url(#${id})`;
      // Fallback: first stop color if defs haven't been registered yet.
      const stops = normalizeStops(d.stops ?? [d.color]);
      return stops[0]?.color ?? '#888888';
    }

    if (d.type === 'age') {
      const age  = Math.max(0, (t ?? 0) - (birth ?? 0));
      const frac = Math.min(age / (d.over ?? 50), 1);
      return lerpColor(d.from, d.to, frac);
    }

    return '#888888';
  }

  // ── Static factories ────────────────────────────────────────────────────────

  /** Plain hex/rgb fill. */
  static solid(value) {
    return new ColorSpec({ type: 'solid', value });
  }

  /**
   * Radial gradient, center → edge.
   * @param {string[]|{at,color}[]} stops
   * @param {{ focal?: string }} [opts]  focal point offsets (default: '40%'/'35%')
   */
  static radial(stops, opts = {}) {
    return new ColorSpec({ type: 'radial', stops, ...opts });
  }

  /**
   * Linear gradient.
   * @param {string[]|{at,color}[]} stops
   * @param {number} [angle=0]  degrees; 0 = left→right, 90 = top→bottom
   */
  static linear(stops, angle = 0) {
    return new ColorSpec({ type: 'linear', stops, angle });
  }

  /**
   * Radial gradient for volumetric-looking round colonies.
   * Center is lightened by `lightness` fraction toward white; edge is the base color.
   * Focal point is offset toward upper-left to simulate a spherical sheen.
   * @param {string} color  base hex color
   * @param {{ lightness?: number }} [opts]  0–1, how much to mix toward white (default 0.42)
   */
  static blob(color, { lightness = 0.48 } = {}) {
    const [r, g, b] = hexToRgb(color);
    // Highlight center — mix toward white
    const lr = Math.round(r + (255 - r) * lightness);
    const lg = Math.round(g + (255 - g) * lightness);
    const lb = Math.round(b + (255 - b) * lightness);
    // Shadow rim — darken edge slightly so even pale colors show depth
    const dr = Math.round(r * 0.72);
    const dg = Math.round(g * 0.72);
    const db = Math.round(b * 0.72);
    return new ColorSpec({
      type: 'radial',
      stops: [
        { at: 0,    color: `rgb(${lr},${lg},${lb})` },
        { at: 0.60, color },
        { at: 1,    color: `rgb(${dr},${dg},${db})` },
      ],
      focalX: '38%',
      focalY: '28%',
    });
  }

  /**
   * Repeating hatch line pattern.
   * @param {string} color
   * @param {{ spacing?: number, angle?: number, weight?: number }} [opts]
   */
  static hatch(color, opts = {}) {
    return new ColorSpec({ type: 'hatch', color, ...opts });
  }

  /**
   * Interpolates from→to as a particle ages past its birth step.
   * @param {string} from   color when newly born
   * @param {string} to     color after `over` steps of age
   * @param {{ over?: number }} [opts]  transition length in steps (default: 50)
   */
  static age(from, to, opts = {}) {
    return new ColorSpec({ type: 'age', from, to, over: opts.over ?? 50 });
  }
}

/**
 * Normalize any color value to a ColorSpec.
 * Accepts: ColorSpec instance, hex string, or raw def object.
 */
export function toColorSpec(value) {
  if (value instanceof ColorSpec) return value;
  return new ColorSpec(value);
}
