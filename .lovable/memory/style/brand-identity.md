---
name: Brand Identity
description: VORVN v2.1 visual rules — Light UI, cream + black, fully rounded geometry, no buttons
type: design
---

# VORVN Brand Identity v2.1 — Light UI, Rounded

## Color system (strict, no exceptions)
- **Background**: `#f1f0ec` (cream) — token `--bg` / `hsl(var(--bg))`
- **Foreground**: `#000000` (pure black) — token `--foreground`
- All other tokens (`--mid`, `--dim`, `--rule`, `--surface`) collapse to solid black or solid cream. Legacy class names (`text-mid`, `border-rule`) keep working.
- **No transparency** anywhere except subtle grain overlay (0.045 multiply) and mobile menu scrim.
- **No grays.** Hierarchy comes from font size, font weight, and spacing — never from gray tones.

## Geometry — FULLY ROUNDED (v2.1 reversal)
Tokens defined in `src/index.css`:
- `--radius: 16px` — default for cards and blocks
- `--radius-pill: 9999px` — full pill for chips, badges, status dots
- `--radius-tag: 9999px` — tag pills
- `--radius-input: 12px` — inputs and textareas

Helper utility classes (use these instead of raw `rounded-*`):
- `.r-pill` → 9999px (full pill / circle)
- `.r-tag` → 9999px
- `.r-input` → 12px
- `.r-card` → 16px

**No `border-radius: 0` global override.** v2.0's "no rounded" rule has been reversed.

## CTAs
- **No buttons.** Every CTA is the `.arrow-link` utility (text + 1px black underline + → arrow that nudges 4px on hover, ← in RTL).
- Topic radio chips, language switcher use full pill background fills (black on hover/active, cream text).

## Texture
- Global SVG turbulence grain at `body::after`, `opacity: 0.045`, `mix-blend-mode: multiply`.

## Toasts (sonner)
- Cream bg, black border, **rounded-2xl** corners, full-pill action/cancel/close buttons.
- Configured in `src/components/ui/sonner.tsx`.
