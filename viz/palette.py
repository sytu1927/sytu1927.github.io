# Blog-wide color palette — single source of truth.
# Import as: from viz import palette as P  then use P.ACCENT, P.BG, etc.

# ── Core ──────────────────────────────────────────────────────────────────────
BG         = "#FEFCF8"   # page background — near-white with warmth
NEAR_BLACK = "#1C1410"   # body text, headings, navbar background

# ── Accent: periwinkle ────────────────────────────────────────────────────────
ACCENT_L   = "#BCB4FF"   # fills, pills, decorative — too light for text
ACCENT     = "#6060C8"   # links, inline code, text uses
ACCENT_D   = "#4848A8"   # hover states

# ── Supporting ────────────────────────────────────────────────────────────────
MUTED      = "#7A6050"   # secondary text — figcaptions, TOC, muted labels
GHOST      = "#B0988A"   # very muted — tiny annotations inside figures

# ── Figure infrastructure ─────────────────────────────────────────────────────
GREY_BG    = "#E6E6F0"   # cool grey — unreachable plot area
GREY_LINE  = "#CCCCD8"   # cool grey — card borders, grid lines
CARD_FILL  = "#F0F0F8"   # cool off-white — input fields, inner cards

# ── Visualization highlight series ───────────────────────────────────────────
# Use these for alternate data series, callout elements, etc.
# Never use for text — contrast is too low.
VIZ_PEACH  = "#FFBe98"   # warm peach
VIZ_LEMON  = "#E9FC87"   # lemon yellow
