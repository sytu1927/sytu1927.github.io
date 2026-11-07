/**
 * palette.js — PetriPalette class.
 *
 * PetriPalette renders a grid of PetriDish instances with shared
 * slider and play controls for stepping through training steps.
 *
 * Usage:
 *   import { PetriPalette } from './petri/palette.js';
 *   import { cultures }     from './petri/cultures.js';
 *
 *   new PetriPalette({
 *     container: '#petri-root',
 *     dishes: [
 *       { seed: 42, culture: cultures.rings },
 *       { seed: 77, culture: cultures.branches },
 *       { seed: 15, culture: cultures.starburst },
 *       { seed: 7,  culture: cultures.patch },
 *       { seed: 99, culture: cultures.clusters },
 *       { seed: 55, culture: cultures.spiral },
 *     ],
 *     columns: 3,
 *   }).render();
 */

import * as d3    from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { PetriDish } from './dish.js';

export class PetriPalette {
  /**
   * @param {object}          config
   * @param {string|Element}  config.container  CSS selector or DOM element to render into
   * @param {Array}           config.dishes     array of { seed, culture } configs or PetriDish instances
   * @param {number}          [config.columns=3]  grid columns
   * @param {number}          [config.steps=100]  maximum training step value
   * @param {number}          [config.speed=140]  ms per step during autoplay
   */
  constructor({ container, dishes = [], columns = 3, gap = '0', steps = 100, speed = 550 }) {
    this._root    = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    this._dishConfigs = dishes;
    this._columns     = columns;
    this._gap         = gap;
    this._steps       = steps;
    this._speed       = speed;   // ms per training step

    this._dishes   = [];    // PetriDish instances, populated by render()
    this._tFloat   = 0;     // current training step as a float (drives rendering)
    this._playing  = false;
    this._rafId    = null;

    // D3 selections for control elements — set during _buildControls()
    this._stepEl   = null;
    this._sliderEl = null;
    this._playBtn  = null;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Build all dishes and controls into the container element.
   * @returns {this}
   */
  render() {
    if (!this._root) {
      console.error('PetriPalette: container not found');
      return this;
    }

    const wrap = d3.select(this._root)
      .append('div')
      .style('margin',      '2.5rem auto')
      .style('max-width',   '800px')
      .style('font-family', 'Georgia, serif');

    // Dish grid.
    const grid = wrap.append('div')
      .style('display',               'grid')
      .style('grid-template-columns', `repeat(${this._columns}, 1fr)`)
      .style('gap',                   this._gap);

    // Build each dish and append it into the grid.
    this._dishes = this._dishConfigs.map((config, i) => {
      const dish = config instanceof PetriDish ? config : new PetriDish(config);
      dish.build(grid, `pd-${i}`);
      return dish;
    });

    this._buildControls(wrap);

    // Start at step 0.
    this.setStep(0);

    // Autoplay when the palette scrolls into view; pause when it leaves.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!this._playing) this._startPlay();
          } else {
            this._stopPlay();
          }
        });
      },
      { threshold: 0.2 }  // trigger when 20% of the palette is visible
    );
    observer.observe(this._root);

    return this;
  }

  /**
   * Jump to a specific training step and update all dishes.
   * Accepts integers (from slider) or floats (from rAF loop).
   * @param {number} t
   */
  setStep(t) {
    this._tFloat = Math.max(0, Math.min(this._steps, t));
    this._dishes.forEach(d => d.renderAt(this._tFloat));
    this._stepEl?.text(Math.floor(this._tFloat));
    this._sliderEl?.property('value', Math.floor(this._tFloat));
  }

  // ── Controls ────────────────────────────────────────────────────────────────

  _buildControls(wrap) {
    const row = wrap.append('div')
      .style('display',      'flex')
      .style('align-items',  'center')
      .style('gap',          '14px')
      .style('margin',       '1.2rem 0 0')
      .style('padding',      '0 2px');

    // "training step N" label.
    const label = row.append('span')
      .style('font-size',   '11px')
      .style('color',       '#7A6050')
      .style('white-space', 'nowrap')
      .style('min-width',   '118px');
    label.append('span').text('training step ');
    this._stepEl = label.append('strong').text(0);

    // Slider.
    this._sliderEl = row.append('input')
      .attr('type',  'range')
      .attr('min',   0)
      .attr('max',   this._steps)
      .attr('value', 0)
      .style('flex',         '1')
      .style('accent-color', '#6060C8')
      .style('cursor',       'pointer')
      .on('input', (event) => {
        this._stopPlay();
        this.setStep(+event.target.value);
      });

    // Play / stop button.
    this._playBtn = row.append('button')
      .style('border',        '1.5px solid #CCCCD8')
      .style('background',    '#FEFCF8')
      .style('color',         '#6060C8')
      .style('padding',       '3px 11px')
      .style('border-radius', '5px')
      .style('cursor',        'pointer')
      .style('font-size',     '13px')
      .style('font-family',   'Georgia, serif')
      .text('▶')
      .on('click', () => this._togglePlay());
  }

  // ── Playback ────────────────────────────────────────────────────────────────

  _togglePlay() {
    this._playing ? this._stopPlay() : this._startPlay();
  }

  _startPlay() {
    this._playing = true;
    this._playBtn?.text('■');
    if (this._tFloat >= this._steps) this.setStep(0);

    // rAF loop — advances _tFloat by (elapsed / speed) each frame so the
    // training step increases as a smooth float rather than a discrete jump.
    let prev = null;
    const tick = (now) => {
      if (!this._playing) return;
      if (prev !== null) {
        const dt = (now - prev) / this._speed;   // fraction of a step elapsed
        this._tFloat = Math.min(this._tFloat + dt, this._steps);
      }
      prev = now;
      this._dishes.forEach(d => d.renderAt(this._tFloat));
      this._stepEl?.text(Math.floor(this._tFloat));
      this._sliderEl?.property('value', Math.floor(this._tFloat));
      if (this._tFloat >= this._steps) { this._stopPlay(); return; }
      this._rafId = requestAnimationFrame(tick);
    };
    this._rafId = requestAnimationFrame(tick);
  }

  _stopPlay() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._playing = false;
    this._playBtn?.text('▶');
  }
}
