"""
SVG helper functions for blog figures.
Each function returns a string of SVG elements (no <svg> wrapper).
Assemble parts and call wrap() to produce a complete SVG file.

Usage:
    from viz import svg, palette as P

    content = "\\n".join([
        svg.card(480, 250),
        svg.pill("my chart", 240, 120),
        svg.plot_rect(52, 430, 28, 210),
        svg.grid(52, 430, 28, 210, [147, 241, 336], [74, 119, 165]),
        svg.axes(52, 430, 28, 210),
    ])
    svg_string = svg.wrap(480, 250, content)
"""

from . import palette as P


def wrap(w, h, content, max_width=650):
    """Full <svg> element. content is an SVG fragment string."""
    style = (
        f"width:100%;max-width:{max_width}px;"
        "display:block;margin:0 auto;font-family:Georgia,serif;"
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {w} {h}" style="{style}">\n'
        f'{content}\n'
        f'</svg>'
    )


def card(w, h, fill=None, stroke=None, stroke_width=1, rx=8):
    """Full-bleed background card."""
    fill = fill or P.BG
    stroke = stroke or P.GREY_LINE
    return (
        f'  <rect x="0" y="0" width="{w}" height="{h}" fill="{fill}"'
        f' rx="{rx}" stroke="{stroke}" stroke-width="{stroke_width}"/>'
    )


def pill(label, cx, pill_width, fill=None, text_fill=None, y=5):
    """Rounded pill badge. cx is the horizontal center."""
    fill = fill or P.ACCENT_L
    text_fill = text_fill or P.NEAR_BLACK
    x = cx - pill_width // 2
    rect = (
        f'  <rect x="{x}" y="{y}" width="{pill_width}"'
        f' height="18" rx="9" fill="{fill}"/>'
    )
    label_el = (
        f'  <text x="{cx}" y="{y + 12}" text-anchor="middle"'
        f' font-size="10.5" font-weight="bold"'
        f' fill="{text_fill}">{label}</text>'
    )
    return rect + "\n" + label_el


def plot_rect(x0, x1, y0, y1, fill=None, opacity=1.0, rx=2):
    """Filled plot area rectangle (unreachable region or full fill)."""
    fill = fill or P.GREY_BG
    op = f' fill-opacity="{opacity}"' if opacity < 1.0 else ""
    return (
        f'  <rect x="{x0}" y="{y0}"'
        f' width="{x1 - x0}" height="{y1 - y0}"'
        f' fill="{fill}"{op} rx="{rx}"/>'
    )


def grid(x0, x1, y0, y1, v_xs, h_ys, stroke=None, opacity=0.7):
    """Grid lines. v_xs and h_ys are lists of pixel positions."""
    stroke = stroke or P.GREY_LINE
    lines = []
    for x in v_xs:
        lines.append(
            f'  <line x1="{x}" y1="{y0}" x2="{x}" y2="{y1}"'
            f' stroke="{stroke}" stroke-width="0.7" opacity="{opacity}"/>'
        )
    for y in h_ys:
        lines.append(
            f'  <line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}"'
            f' stroke="{stroke}" stroke-width="0.7" opacity="{opacity}"/>'
        )
    return "\n".join(lines)


def axes(x0, x1, y0, y1, x_label="input", y_label="output",
         stroke=None, opacity=0.35):
    """X and Y axes with arrowheads and labels."""
    stroke = stroke or P.NEAR_BLACK
    op = opacity
    x1e = x1 + 6
    y0e = y0 - 6
    return "\n".join([
        f'  <line x1="{x0}" y1="{y1}" x2="{x1e}" y2="{y1}"'
        f' stroke="{stroke}" stroke-width="1.5" opacity="{op}"/>',
        f'  <polygon points="{x1e+2},{y1} {x1e-5},{y1-4} {x1e-5},{y1+4}"'
        f' fill="{stroke}" opacity="{op}"/>',
        f'  <text x="{x1e+8}" y="{y1+4}" font-size="10" fill="{stroke}"'
        f' opacity="{op}" font-style="italic">{x_label}</text>',
        f'  <line x1="{x0}" y1="{y1}" x2="{x0}" y2="{y0e}"'
        f' stroke="{stroke}" stroke-width="1.5" opacity="{op}"/>',
        f'  <polygon points="{x0},{y0e-2} {x0-4},{y0e+6} {x0+4},{y0e+6}"'
        f' fill="{stroke}" opacity="{op}"/>',
        f'  <text x="{x0+2}" y="{y0e-5}" font-size="10" fill="{stroke}"'
        f' opacity="{op}" font-style="italic">{y_label}</text>',
    ])


def dot(cx, cy, r=5.5, fill=None, stroke=None, stroke_width=2):
    """Inference dot / data point."""
    fill = fill or P.ACCENT
    stroke = stroke or P.BG
    return (
        f'  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"'
        f' stroke="{stroke}" stroke-width="{stroke_width}"/>'
    )


def line(x1, y1, x2, y2, stroke=None, stroke_width=2,
         stroke_linecap=None, stroke_dasharray=None):
    """Straight line segment."""
    stroke = stroke or P.ACCENT
    attrs = f' stroke="{stroke}" stroke-width="{stroke_width}"'
    if stroke_linecap:
        attrs += f' stroke-linecap="{stroke_linecap}"'
    if stroke_dasharray:
        attrs += f' stroke-dasharray="{stroke_dasharray}"'
    return f'  <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"{attrs}/>'


def text(x, y, content, font_size=10, fill=None, anchor="middle",
         italic=False, bold=False, font_family=None):
    """SVG text element."""
    fill = fill or P.NEAR_BLACK
    attrs = f' text-anchor="{anchor}" font-size="{font_size}" fill="{fill}"'
    if italic:
        attrs += ' font-style="italic"'
    if bold:
        attrs += ' font-weight="bold"'
    if font_family:
        attrs += f' font-family="{font_family}"'
    return f'  <text x="{x}" y="{y}"{attrs}>{content}</text>'


def evenly_spaced(start, end, count):
    """Return `count` positions evenly spaced between start and end."""
    step = (end - start) / (count + 1)
    return [round(start + step * i) for i in range(1, count + 1)]
