"""
Generate SVG figures for the components-of-foundation-models post.
Run from the post directory: python3 figures/generate.py
"""

from pathlib import Path

from viz import svg, palette as P

OUT = Path(__file__).parent

# ── Shared plot geometry ──────────────────────────────────────────────────────
PX0, PX1 = 52, 430
PY0, PY1 = 28, 210

# 5 vertical + 4 horizontal grid lines
V_GRID = svg.evenly_spaced(PX0, PX1, 5)
H_GRID = svg.evenly_spaced(PY0, PY1, 4)


# ── Fig 1: linear regression equation diagram ─────────────────────────────────
def fig_linreg_eq():
    return svg.wrap(650, 165, "\n".join([
        # Panel 1: Weights
        f'  <rect x="8" y="18" width="180" height="130" rx="8" fill="{P.BG}" stroke="{P.GREY_LINE}" stroke-width="1.5"/>',
        f'  <rect x="52" y="25" width="92" height="22" rx="11" fill="{P.NEAR_BLACK}"/>',
        f'  <text x="98" y="41" text-anchor="middle" font-size="12" font-weight="bold" fill="{P.BG}">weights</text>',
        f'  <rect x="24" y="58" width="148" height="58" rx="5" fill="{P.CARD_FILL}" stroke="{P.GREY_LINE}" stroke-width="1"/>',
        f'  <text x="98" y="82" text-anchor="middle" font-size="14" fill="{P.NEAR_BLACK}" font-family="monospace">&#946;&#8320; = 2.4</text>',
        f'  <text x="98" y="103" text-anchor="middle" font-size="14" fill="{P.NEAR_BLACK}" font-family="monospace">&#946;&#8321; = 0.8</text>',
        f'  <text x="98" y="136" text-anchor="middle" font-size="10" fill="{P.MUTED}" font-style="italic">learned numbers</text>',
        # Operator +
        f'  <text x="203" y="92" text-anchor="middle" font-size="26" fill="{P.NEAR_BLACK}" font-weight="bold">+</text>',
        # Panel 2: Architecture
        f'  <rect x="218" y="18" width="210" height="130" rx="8" fill="{P.BG}" stroke="{P.GREY_LINE}" stroke-width="1.5"/>',
        f'  <rect x="257" y="25" width="132" height="22" rx="11" fill="{P.MUTED}"/>',
        f'  <text x="323" y="41" text-anchor="middle" font-size="12" font-weight="bold" fill="{P.BG}">architecture</text>',
        f'  <text x="323" y="90" text-anchor="middle" font-size="20" fill="{P.NEAR_BLACK}" font-family="Georgia,serif">y = &#946;&#8320; + &#946;&#8321;x</text>',
        f'  <text x="323" y="113" text-anchor="middle" font-size="10" fill="{P.MUTED}" font-style="italic">the equation&#8217;s shape</text>',
        f'  <text x="323" y="134" text-anchor="middle" font-size="9" fill="{P.GHOST}" font-family="monospace">(slots for the weights)</text>',
        # Operator =
        f'  <text x="443" y="92" text-anchor="middle" font-size="26" fill="{P.NEAR_BLACK}" font-weight="bold">=</text>',
        # Panel 3: Model
        f'  <rect x="458" y="18" width="184" height="130" rx="8" fill="#F5F4FF" stroke="{P.ACCENT_L}" stroke-width="2"/>',
        f'  <rect x="502" y="25" width="96" height="22" rx="11" fill="{P.ACCENT_L}"/>',
        f'  <text x="550" y="41" text-anchor="middle" font-size="12" font-weight="bold" fill="{P.NEAR_BLACK}">model</text>',
        f'  <text x="550" y="88" text-anchor="middle" font-size="18" fill="{P.ACCENT}" font-family="Georgia,serif">y = 2.4 + 0.8x</text>',
        f'  <text x="550" y="111" text-anchor="middle" font-size="10" fill="{P.MUTED}" font-style="italic">ready for inference</text>',
        f'  <text x="550" y="134" text-anchor="middle" font-size="9" fill="{P.GHOST}" font-family="monospace">linear regression</text>',
    ]))


# ── Fig 2: foundation model components diagram ────────────────────────────────
def fig_fm_components():
    return svg.wrap(650, 185, "\n".join([
        # Panel 1: Tensor Weights
        f'  <rect x="8" y="18" width="180" height="150" rx="8" fill="{P.BG}" stroke="{P.GREY_LINE}" stroke-width="1.5"/>',
        f'  <rect x="34" y="25" width="120" height="22" rx="11" fill="{P.NEAR_BLACK}"/>',
        f'  <text x="94" y="41" text-anchor="middle" font-size="12" font-weight="bold" fill="{P.BG}">tensor weights</text>',
        # Stacked card effect (depth illusion)
        '  <rect x="20" y="62" width="138" height="18" rx="3" fill="#E8DDD5" stroke="#C0AFA5" stroke-width="0.8"/>',
        '  <rect x="20" y="58" width="138" height="18" rx="3" fill="#F0E8E0" stroke="#C8B8AC" stroke-width="0.8"/>',
        f'  <rect x="20" y="54" width="138" height="18" rx="3" fill="{P.CARD_FILL}" stroke="{P.NEAR_BLACK}" stroke-width="1.2"/>',
        f'  <text x="89" y="67" text-anchor="middle" font-size="8.5" fill="{P.NEAR_BLACK}" font-family="monospace">model.safetensors</text>',
        f'  <text x="89" y="90" text-anchor="middle" font-size="10" fill="{P.MUTED}">&#215; ~1 trillion numbers</text>',
        f'  <text x="89" y="107" text-anchor="middle" font-size="9" fill="{P.GHOST}" font-style="italic">one per connection</text>',
        f'  <text x="94" y="154" text-anchor="middle" font-size="10" fill="{P.MUTED}" font-style="italic">what was learned</text>',
        # Operator +
        f'  <text x="203" y="102" text-anchor="middle" font-size="26" fill="{P.NEAR_BLACK}" font-weight="bold">+</text>',
        # Panel 2: Architecture
        f'  <rect x="218" y="18" width="210" height="150" rx="8" fill="{P.BG}" stroke="{P.GREY_LINE}" stroke-width="1.5"/>',
        f'  <rect x="257" y="25" width="132" height="22" rx="11" fill="{P.MUTED}"/>',
        f'  <text x="323" y="41" text-anchor="middle" font-size="12" font-weight="bold" fill="{P.BG}">architecture</text>',
        f'  <rect x="238" y="58" width="170" height="22" rx="4" fill="{P.CARD_FILL}" stroke="{P.GREY_LINE}" stroke-width="1.2"/>',
        f'  <text x="323" y="73" text-anchor="middle" font-size="10" fill="{P.NEAR_BLACK}" font-family="monospace">attention layer</text>',
        f'  <rect x="238" y="84" width="170" height="22" rx="4" fill="{P.CARD_FILL}" stroke="{P.GREY_LINE}" stroke-width="1.2"/>',
        f'  <text x="323" y="99" text-anchor="middle" font-size="10" fill="{P.NEAR_BLACK}" font-family="monospace">feedforward layer</text>',
        f'  <text x="323" y="124" text-anchor="middle" font-size="10" fill="{P.MUTED}" font-style="italic">&#215; N layers</text>',
        f'  <text x="323" y="154" text-anchor="middle" font-size="10" fill="{P.MUTED}" font-style="italic">how to process</text>',
        # Operator =
        f'  <text x="443" y="102" text-anchor="middle" font-size="26" fill="{P.NEAR_BLACK}" font-weight="bold">=</text>',
        # Panel 3: Foundation Model
        f'  <rect x="458" y="18" width="184" height="150" rx="8" fill="#F5F4FF" stroke="{P.ACCENT_L}" stroke-width="2"/>',
        f'  <rect x="472" y="25" width="156" height="22" rx="11" fill="{P.ACCENT_L}"/>',
        f'  <text x="550" y="41" text-anchor="middle" font-size="12" font-weight="bold" fill="{P.NEAR_BLACK}">foundation model</text>',
        f'  <text x="550" y="70" text-anchor="middle" font-size="9.5" fill="{P.NEAR_BLACK}" font-family="monospace">&#8220;text input&#8221;</text>',
        f'  <line x1="550" y1="76" x2="550" y2="93" stroke="{P.ACCENT_L}" stroke-width="2"/>',
        f'  <polygon points="544,90 556,90 550,97" fill="{P.ACCENT_L}"/>',
        f'  <rect x="508" y="99" width="84" height="22" rx="5" fill="{P.ACCENT_L}"/>',
        f'  <text x="550" y="114" text-anchor="middle" font-size="11" fill="{P.NEAR_BLACK}" font-weight="bold">generate</text>',
        f'  <line x1="550" y1="122" x2="550" y2="136" stroke="{P.ACCENT_L}" stroke-width="2"/>',
        f'  <polygon points="544,133 556,133 550,140" fill="{P.ACCENT_L}"/>',
        f'  <text x="550" y="154" text-anchor="middle" font-size="9.5" fill="{P.ACCENT}" font-family="monospace">&#8220;Text Input... Text Output&#8230;&#8221;</text>',
    ]))


# ── Figs 3–5: reachable space series ─────────────────────────────────────────
def fig_linreg():
    # Regression line: (PX0,206) → (PX1,38); at x=241 → y=122
    parts = [
        svg.card(480, 250),
        svg.pill("linear regression", 240, 130),
        svg.plot_rect(PX0, PX1, PY0, PY1),
        svg.grid(PX0, PX1, PY0, PY1, V_GRID, H_GRID),
        svg.line(PX0, 206, PX1, 38, stroke=P.ACCENT, stroke_width=3,
                 stroke_linecap="round"),
        svg.dot(241, 122, fill=P.ACCENT),
        svg.axes(PX0, PX1, PY0, PY1),
        svg.text(308, 57, "reachable", font_size=9, fill=P.ACCENT,
                 italic=True, bold=True),
        svg.line(316, 60, 316, 74, stroke=P.ACCENT, stroke_width=1,
                 stroke_dasharray="3,2"),
        svg.text(88, 52, "unreachable", font_size=9, fill=P.GHOST,
                 anchor="start", italic=True),
        svg.text(285, 202, "unreachable", font_size=9, fill=P.GHOST,
                 anchor="start", italic=True),
    ]
    return svg.wrap(480, 250, "\n".join(parts))


def fig_poly():
    parts = [
        svg.card(480, 250),
        svg.pill("polynomial regression", 230, 174),
        svg.plot_rect(PX0, PX1, PY0, PY1),
        svg.grid(PX0, PX1, PY0, PY1, V_GRID, H_GRID),
        (f'  <polygon points="52,176 150,132 260,83 430,30 430,68 260,143 150,172 52,210"'
         f' fill="{P.ACCENT_L}" fill-opacity="0.55" stroke="{P.ACCENT_L}"'
         f' stroke-width="1.5" stroke-opacity="0.8" stroke-linejoin="round"/>'),
        svg.dot(241, 130, fill=P.ACCENT),
        svg.axes(PX0, PX1, PY0, PY1),
        svg.text(168, 118, "reachable region", font_size=9, fill=P.ACCENT,
                 anchor="start", italic=True, bold=True),
        svg.text(88, 52, "unreachable", font_size=9, fill=P.GHOST,
                 anchor="start", italic=True),
        svg.text(285, 202, "unreachable", font_size=9, fill=P.GHOST,
                 anchor="start", italic=True),
    ]
    return svg.wrap(480, 250, "\n".join(parts))


def fig_foundation():
    parts = [
        svg.card(480, 250),
        svg.pill("foundation model", 240, 138),
        svg.plot_rect(PX0, PX1, PY0, PY1, fill=P.ACCENT_L, opacity=0.40),
        (f'  <rect x="{PX0}" y="{PY0}" width="{PX1-PX0}" height="{PY1-PY0}"'
         f' fill="none" stroke="{P.ACCENT_L}" stroke-width="1.5" stroke-opacity="0.6" rx="2"/>'),
        svg.grid(PX0, PX1, PY0, PY1, V_GRID, H_GRID, stroke=P.BG),
        svg.dot(241, 90, fill=P.NEAR_BLACK),
        svg.axes(PX0, PX1, PY0, PY1),
        svg.text(130, 52, "???", font_size=9,
                 anchor="start", italic=True, bold=True),
    ]
    return svg.wrap(480, 250, "\n".join(parts))


# ── Write files ───────────────────────────────────────────────────────────────
FIGURES = {
    "fig-linreg-eq.svg":     fig_linreg_eq,
    "fig-fm-components.svg": fig_fm_components,
    "fig-linreg.svg":        fig_linreg,
    "fig-poly.svg":          fig_poly,
    "fig-foundation.svg":    fig_foundation,
}

if __name__ == "__main__":
    for name, fn in FIGURES.items():
        path = OUT / name
        path.write_text(fn())
        print(f"Wrote {path}")
