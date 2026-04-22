---
name: Brand Identity
description: VORVN v2.0 visual rules — Light UI, cream + black only, no transparency, no rounded, no buttons
type: design
---

# VORVN Brand Identity v2.0 — Light UI

## Color system (strict, no exceptions)
- **Background**: `#f1f0ec` (cream) — token `--bg` / `hsl(var(--bg))`
- **Foreground**: `#000000` (pure black) — token `--foreground`
- All other tokens (`--mid`, `--dim`, `--rule`, `--surface`) collapse to solid black or solid cream. They exist only so legacy class names (`text-mid`, `border-rule`) keep working.
- **No transparency** anywhere except subtle grain overlay (0.045 multiply) and mobile menu scrim.
- **No grays.** Hierarchy comes from font size, font weight, and spacing — never from gray tones.

## Geometry
- **Zero rounded corners.** Enforced globally via `* { border-radius: 0 !important }` in `src/index.css`.
- This kills `rounded-full`, `rounded-md`, etc. site-wide. Status dots, founder photo, tag pills, dropdowns — all sharp rectangles.

## CTAs
- **No buttons.** Every CTA is the `.arrow-link` utility:
  - Text + 1px solid black underline (2px below baseline)
  - `→` arrow appended via `::after` (auto-flips to `←` in RTL)
  - On hover: arrow translates 4px in reading direction
  - Font: Inter Tight 500
- Defined in `src/index.css`. Use as `<button class="arrow-link text-[15px]">Label</button>` or `<Link className="arrow-link">Label</Link>`.

## Texture
- Global SVG turbulence grain at `body::after`, `opacity: 0.045`, `mix-blend-mode: multiply` — reads as subtle paper grain on cream.

## Toasts (sonner)
- Cream bg, black border, black text, sharp corners, mono uppercase action buttons.
- Configured in `src/components/ui/sonner.tsx`.
