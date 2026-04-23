

# Multilingual SEO — Make Google Understand Your 6 Languages

## The Problem (in plain words)

When Google visits `vorvn.com/fr`, it currently downloads an HTML file that says **in English**:
- Title: "VORVN — Autonomous IP & Brand Holdings"
- Description: "VORVN is an independent IP & brand holdings company..."
- Canonical: not set yet

Then JavaScript runs and *replaces* the meta tags with the French ones. Google does eventually run JavaScript — but:
1. It takes a second crawl pass (sometimes weeks later)
2. It's unreliable, especially for non-English pages
3. Until then, all 6 language URLs look identical to Google → it picks one and ignores the rest, or worse, treats them as duplicates of the homepage

That's exactly the symptom you're describing: "I search VORVN and only get the homepage, languages don't show up properly."

## The Solution: Prerender at Build Time

We generate **real static HTML files** for every language, with the correct title/description/canonical/hreflang already baked in **before** JavaScript runs. Google sees the right content on the first visit. No waiting. No guessing.

```text
Before:                          After:
/fr → index.html (English meta)  /fr/index.html (French meta, French hreflang, canonical=/fr)
      ↓ JS runs                  /es/index.html (Spanish meta, canonical=/es)
      ↓ meta swapped             /zh/index.html (Chinese meta, canonical=/zh)
      ↓ Google maybe re-crawls   /ar/index.html (Arabic meta, dir=rtl, canonical=/ar)
      → confused result          → Google indexes each language correctly
```

## What Will Change

### 1. Build-time prerendering (the core fix)
- Add `vite-plugin-prerender-spa` (or a simple custom Node script) that runs after `vite build`
- For each route in this list, output a real HTML file with localized `<title>`, `<meta description>`, `<link canonical>`, `<link hreflang>` × 6 + x-default, OG tags, and JSON-LD already inside `<head>`:
  - `/en`, `/fr`, `/es`, `/zh`, `/id`, `/ar`
  - `/en/contact`, `/fr/contact`, `/es/contact`, `/zh/contact`, `/id/contact`, `/ar/contact`
  - `/legal/privacy`, `/legal/notice` (English only)
- Also write the right `<html lang="xx" dir="...">` attribute per file
- The React app still hydrates normally on top — no UX change

### 2. Audit translation completeness
- Read all 6 `src/i18n/locales/*.json` files and diff them against `en.json`
- Report any missing keys (so Google doesn't crawl half-translated pages)
- Fix any English fallback leaks found

### 3. Improve meta descriptions per language
- Current titles/descriptions in `SeoHead.tsx` are good but a bit generic. We'll tighten them so each language has unique, search-optimized copy (~155 chars desc, keyword-rich)
- Add a language-aware `<title>` tag for the **root `/`** redirect HTML (currently English-only) so even the redirect page has correct meta

### 4. Sitemap upgrade
- Current sitemap is correct but lists `lastmod` as `2025-04-20`. Update to current date and verify all 14 URLs (6 home + 6 contact + 2 legal) resolve to prerendered files
- Confirm `robots.txt` correctly references it (already does)

### 5. Per-language JSON-LD enrichment
- Add `WebSite` schema with `inLanguage` and `potentialAction` (SearchAction stub) on home for each locale
- Localize `Organization.description` per language
- Add `BreadcrumbList` schema on contact pages

### 6. Verification tooling (one-time)
- After build, run a small script that opens each prerendered `dist/<lang>/index.html` and asserts: title is non-English-default, canonical points to itself, all 6 hreflang links present, `<html lang>` matches
- Print a green/red report so we know it worked before deploy

## Technical details

- **Prerender approach**: Use `vite-plugin-prerender` with `puppeteer` (renders React → static HTML), OR a leaner custom script using the existing `SeoHead` component output. Recommend the plugin route — battle-tested, no maintenance.
- **Build pipeline**: Hooks into existing `npm run build`. Netlify picks up the new files automatically — no `netlify.toml` change needed (the existing SPA fallback still handles non-prerendered paths).
- **No runtime cost**: Prerendering happens at build time only. Bundle size, load time, hydration are unchanged.
- **Hydration safety**: We'll confirm `SeoHead` doesn't double-inject conflicting tags after hydration (it currently re-emits, which is fine — same content).
- **Files touched**: `vite.config.ts` (add plugin), `package.json` (add devDep), `src/components/SeoHead.tsx` (minor tightening), `src/i18n/locales/*.json` (fill gaps if any), `public/sitemap.xml` (refresh dates), new `scripts/verify-seo.mjs` (post-build check).

## Expected result

- Search "VORVN" on Google.fr → French homepage shows up with French title and description
- Search "VORVN Bali" → relevant language version surfaces based on user locale
- Google Search Console "International Targeting" → all 6 hreflang pairs validate green
- No more "duplicate content" warnings between language versions
- Each `/contact` page indexes separately per language

