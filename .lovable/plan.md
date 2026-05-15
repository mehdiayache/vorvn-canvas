## Problem

Bing scans raw HTML (no JS execution on first pass). Our SPA's `<h1>` lives inside React components and only appears after hydration, so the prerendered HTML served to Bingbot contains zero heading tags. Confirmed via `curl https://vorvn.com/en/` — no `<h*>` in source.

## Fix

Inject a static, semantically meaningful, **per-language** `<h1>` into the prerendered `<body>` of every localized homepage and the apex `index.html`, placed **outside** `#root` so React hydration never overwrites it. Visually hide with `sr-only` (CSS clip technique) — invisible to users, fully readable by Bingbot/Googlebot.

This keeps the existing visible hero design 100% unchanged. The visible hero `<h1>` stays inside React; crawlers see the static one first; users see the React one after hydration. Two `<h1>` tags on one page is technically tolerated by Google/Bing (HTML5 allows multiple), but to stay strictly correct we'll downgrade the visible hero from `<h1>` to a styled `<div role="heading" aria-level="1">` — same a11y, only the prerendered one counts as the SEO H1.

### Per-language H1 copy (keyword-rich, ~80 chars)

| Lang | H1 |
|---|---|
| en | VORVN — Autonomous IP & Brand Designers in Hong Kong and Bali |
| fr | VORVN — Concepteurs autonomes de marques et PI à Hong Kong et Bali |
| es | VORVN — Diseñadores autónomos de marcas y PI en Hong Kong y Bali |
| zh | VORVN — 香港与巴厘岛的自主知识产权与品牌设计公司 |
| id | VORVN — Perancang IP & Merek Independen di Hong Kong dan Bali |
| ar | VORVN — مصمّمو علامات وملكية فكرية مستقلون في هونغ كونغ وبالي |

Contact pages get an analogous H1 ("Contact VORVN — …"). Legal pages already have proper H1s in their React components, but we'll bake a static one too for consistency.

## Implementation

1. **`scripts/prerender.mjs`**
   - Add a `H1_COPY` map (home + contact, all 6 langs).
   - Add `injectBodyH1(html, h1Text)` that inserts `<h1 class="sr-only">…</h1>` immediately after `<body>` (before `<div id="root">`).
   - Call it for every generated file (6 home + 6 contact + 2 legal + apex root).

2. **`src/index.css`**
   - Confirm `.sr-only` utility exists (Tailwind ships it by default — verify, otherwise no change).

3. **`src/components/sections/VorvnHero.tsx`**
   - Change the visible `<h1>` to `<div role="heading" aria-level={1}>` to avoid duplicate H1s. Visual styling unchanged.

4. **No other changes.** Sitemap, IndexNow, head meta, etc. all stay as-is.

## Verification

After publish:
```
curl -s https://vorvn.com/en/ | grep -o '<h1[^>]*>[^<]*</h1>'
curl -s https://vorvn.com/fr/ | grep -o '<h1[^>]*>[^<]*</h1>'
curl -s https://vorvn.com/    | grep -o '<h1[^>]*>[^<]*</h1>'
```
Each should return the localized H1. Then re-run the Bing Site Scan — the H1 notice will clear.
