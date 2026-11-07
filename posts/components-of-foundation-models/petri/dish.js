/**
 * dish.js — PetriDish class (Canvas renderer).
 *
 * Renders one culture inside a glass-edged Canvas circle.
 * Uses Canvas 2D for crisp retina rendering. Visual style is flat / graphic —
 * clean fills, thin separating strokes, no simulated depth or gradients.
 *
 * API:
 *   const dish = new PetriDish({ seed: 42, molds: [...], agar: {...} });
 *   dish.build(d3Selection, 'dish-0');
 *   dish.renderAt(50);
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { rng32, growingBlobPath, smoothstep } from './utils.js';
import { Culture } from './culture.js';

export class PetriDish {
  constructor({ seed, culture, molds, agar, dim = 200, R = 95 }) {
    this.seed    = seed;
    this.culture = culture instanceof Culture ? culture
                 : culture                    ? new Culture(culture)
                 : new Culture({ molds: molds ?? [], agar });
    this.dim     = dim;
    this.R       = R;
    this.cx      = dim / 2;
    this.cy      = dim / 2;
    this.particles = [];
  }

  // ── Build ───────────────────────────────────────────────────────────────────

  build(container, id) {
    this._id = id;
    const dpr = window.devicePixelRatio || 1;

    this._canvas = container.append('canvas')
      .attr('width',  Math.round(this.dim * dpr))
      .attr('height', Math.round(this.dim * dpr))
      .style('width',   '100%')
      .style('display', 'block')
      .node();

    const rng = rng32(this.seed);
    this.particles = this.culture.generateParticles(this.cx, this.cy, this.R, rng);

    return this;
  }

  // ── Animate ─────────────────────────────────────────────────────────────────

  renderAt(t) {
    if (!this._canvas) return;
    const ctx = this._canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.dim, this.dim);

    this._withClip(ctx, () => {
      this._drawAgar(ctx);

      for (const p of this.particles) {
        const age = Math.max(0, t - p.birth);
        const gf  = smoothstep(Math.min(1, age / Math.max(p.growSteps ?? 20, 1)));
        if (gf < 0.001) continue;

        if (p.type === 'growing')     this._drawBlob(ctx, p, t, gf);
        if (p.type === 'growingLine') this._drawLine(ctx, p, gf);
      }

      this._drawShine(ctx);
    });

    this._drawGlass(ctx);
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  _drawAgar(ctx) {
    const { color, opacity } = this.culture.agar;
    // White base so the agar tint reads correctly regardless of canvas background.
    ctx.fillStyle   = '#FEFCF8';
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, this.dim, this.dim);
    ctx.fillStyle   = color;
    ctx.globalAlpha = opacity;
    ctx.fillRect(0, 0, this.dim, this.dim);
    ctx.globalAlpha = 1;
  }

  _drawBlob(ctx, p, t, gf) {
    const pathStr = growingBlobPath(p.cx, p.cy, p.maxR, p.nPts, p.pSeed, t, p.birth,
                      { vary: p.vary, growSteps: p.growSteps });
    if (!pathStr) return;

    const hex  = this._colorHex(p, t);
    const path = new Path2D(pathStr);

    ctx.save();
    ctx.globalAlpha = gf * p.op;
    ctx.fillStyle   = hex;
    ctx.fill(path);

    // Thin separating stroke — creates visual layering without faking 3D.
    ctx.globalAlpha = gf * p.op * 0.30;
    ctx.strokeStyle = '#1C1410';
    ctx.lineWidth   = 0.6;
    ctx.stroke(path);

    ctx.restore();
  }

  _drawLine(ctx, p, gf) {
    const hex = this._colorHex(p, 0);
    ctx.save();
    ctx.globalAlpha = gf * p.op;
    ctx.strokeStyle = hex;
    ctx.lineWidth   = p.sw;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(p.x1, p.y1);
    ctx.lineTo(p.x1 + (p.x2 - p.x1) * gf, p.y1 + (p.y2 - p.y1) * gf);
    ctx.stroke();
    ctx.restore();
  }

  _drawShine(ctx) {
    const grad = ctx.createRadialGradient(
      this.cx - this.R * 0.14, this.cy - this.R * 0.24, 0,
      this.cx,                  this.cy,                  this.R
    );
    grad.addColorStop(0,    'rgba(255,255,255,0.14)');
    grad.addColorStop(0.50, 'rgba(255,255,255,0.03)');
    grad.addColorStop(1,    'rgba(255,255,255,0.00)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.dim, this.dim);
  }

  _drawGlass(ctx) {
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(28,20,16,0.60)';
    ctx.lineWidth   = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.R - 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.20)';
    ctx.lineWidth   = 1;
    ctx.stroke();
  }

  _withClip(ctx, fn) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.R, 0, Math.PI * 2);
    ctx.clip();
    fn();
    ctx.restore();
  }

  _colorHex(p, t) {
    const cs = p.colorSpec;
    if (!cs) return '#888888';
    if (cs.isDynamic) return cs.fill({ t, birth: p.birth });
    return cs.baseColor;
  }
}
