

## Goal
Build a **new Portfolio v2** section (parallel to the current one — keep the old one intact for now) with a stronger IP-Holding narrative, tag-based metadata, profitability/traction signals for **active** brands, and a layout that finally works on mobile.

## Strategy: duplicate, don't replace
- Current `VorvnPortfolioSection.tsx` stays untouched.
- New file: `VorvnPortfolioSectionV2.tsx`.
- In `Index.tsx`, swap the import to V2 (one line). Old file remains in repo as a fallback — easy A/B / rollback.

## New design vision (mobile-first card rows)

Replace the desktop-grid accordion with a **stacked card row** that reads identically on phone and desktop. Each brand = one expandable row, but the row itself is a structured card — not a single horizontal line that collapses on mobile.

### Collapsed row (always visible)

```text
┌───────────────────────────────────────────────────────────┐
│  ●  COOK WARRIORS                              [ + ]      │
│     Premium kitchenware · Eggscalibur                     │
│                                                           │
│  [CONSUMER GOODS] [DTC] [USA] [UAE]                       │
└───────────────────────────────────────────────────────────┘
```

- **Status dot** (pulsing green = active, hollow = in dev) — leftmost, always.
- **Brand name** in Inter Tight medium, uppercase, larger than today.
- **One-line pitch** (new short field, ~60 chars) — gives context without expanding.
- **Tags row** as proper TAG UI — pills with mono caps, 1px border, rounded-none (per design system: no rounded edges → square pills with subtle border). Two tag families, visually distinct:
  - **Sector tags** — foreground border (e.g. `CONSUMER GOODS`, `DTC`)
  - **Geo tags** — dim border + globe-style prefix dot (e.g. `· USA`, `· UAE`)
- **+ / ×** affordance on the right.

### Expanded panel

Two-column on desktop (`lg:grid-cols-[1.1fr_1fr]`), single-column stack on mobile.

**Left column — Brand intel**
- Large featured logo (or wordmark fallback, as today).
- Full description paragraph.
- **Metrics strip** (active brands only) — 3 small stat blocks:
  ```text
  STATUS         MARKETS         SINCE
  Profitable     USA · UAE       2024
  ```
  Numbers in Inter Tight medium ~24px, labels in JetBrains Mono 9px caps. Pulled from new `metrics` field in `brands.ts` — strings only, no live data, fully editable per-brand. Hidden for `dev` brands; replaced by a single `IN DEVELOPMENT — Q3 2026` line.
- Action links (right-arrow style, as user previously requested for CTAs):
  - `Visit brand →`
  - `Download deck →`

**Right column — Visual**
- Same auto-scrolling 300×300 gallery, but:
  - On mobile: collapses to a single fixed 4:3 hero image (lighter, no infinite scroll on small screens — perf + clarity).
  - On desktop: gallery height matches left column, smaller (240×240) so the row doesn't feel oversized.

### Section header (rewritten copy direction)

Current: *"The brands and intellectual property we design, build, and own…"*

New (more IP-Holding, more accurate):
> **Portfolio.** Six brands. One holding. Every IP designed, owned, and operated in-house — from Hong Kong, Bali, and Marrakech. No licenses. No partners on the cap table. Just brands we built to last.

Also adds a small meta-strip under the headline:
```text
6 BRANDS · 2 ACTIVE · 4 IN DEVELOPMENT · 3 CONTINENTS
```
Computed automatically from `BRANDS_DATA`.

## Data model changes (`src/data/brands.ts`)

Add three optional fields per brand. No breaking changes — old portfolio still reads what it needs.

```ts
{
  // ...existing fields
  sectorTags: ['Consumer Goods', 'DTC'],     // replaces freeform "sector" string
  geoTags:    ['USA', 'UAE'],
  pitch:      'Premium kitchenware · Eggscalibur',  // ~60 char one-liner
  metrics: {                                  // active brands only
    status:  'Profitable',     // or 'Scaling', 'Launch phase'
    since:   '2024',
    channel: 'DTC + Amazon',   // optional
  },
  devTimeline: 'Q3 2026',      // dev brands only
}
```

The existing `tags` array stays for backwards compatibility with v1 — v2 reads from the new structured fields.

## i18n updates (`locales/*.json`)

New `portfolio.v2` block with: rewritten `intro`, `metaStrip` template, `metricsLabels` (`status`, `markets`, `since`), `inDevelopmentSince`. Updated for all 6 languages (EN drafted, others get translated copies of the same structure).

The per-brand `pitch` field is added to each `brands[i]` entry in every locale.

## Files

| File | Action |
|---|---|
| `src/components/sections/VorvnPortfolioSectionV2.tsx` | **new** — full implementation |
| `src/data/brands.ts` | extend with `sectorTags`, `geoTags`, `pitch`, `metrics`, `devTimeline` |
| `src/i18n/locales/en.json` (+ fr/es/zh/id/ar) | add `portfolio.v2` block + `pitch` per brand |
| `src/pages/Index.tsx` | swap `VorvnPortfolioSection` → `VorvnPortfolioSectionV2` |
| `mem://features/portfolio-accordion` | update to reflect new structure |

## Mobile-friendliness checklist
- All text scales via `clamp()`, no fixed `lg:` reveals.
- Tags wrap freely (`flex-wrap gap-2`).
- Gallery → single static image under `md`.
- Tap targets ≥44px on the toggle.
- Description max-width caps at full container on mobile (no `max-w-[440px]` clipping).
- Status dot + name always sit on first line; tags row reflows under.

## Two open decisions for you

1. **Profitability wording** — for active brands, what's safest/preferred?
   a) `Profitable` / `Scaling` (concrete, asserts strength)
   b) `Revenue-generating` (factual, neutral)
   c) Skip the status field, just show `SINCE 2024 · MARKETS USA · UAE`
2. **Dev brands in metrics strip** — show a `Target launch: Q3 2026` line, or leave blank with just the status dot?

If you don't answer, I default to **1a + show target launch** — the boldest, most IP-Holding read.

