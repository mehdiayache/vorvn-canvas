# SEO Audit Remediation Plan — vorvn.com

Addressing the audit in priority order. All work is in this project; nothing touches the CMS brainstorm.

## P1 — Real 404 status for unknown URLs

**Problem:** `/en/does-not-exist` returns HTTP 200 with the home HTML (Netlify `/:lang/*` → `/:lang/index.html` 200 fallback).

**Fix:**
- Remove the catch-all `/en/* → /en/index.html 200` rules from `netlify.toml` for all 6 languages.
- Replace with explicit 200 rules ONLY for the routes we actually own (`/:lang`, `/:lang/contact`, `/:lang/newsroom`, `/:lang/newsroom/:slug`) — these already exist.
- Add a real prerendered `/404.html` (status 404) and a Netlify `[[redirects]]` rule `from = "/*" to = "/404.html" status = 404` as the final fallback.
- Prerender 404 in English only (audit-acceptable; keeps it simple).
- Keep React `NotFound` for client-side mismatches inside valid language roots (rare; fine to render 200 — but we'll align by `<meta name="robots" content="noindex">` on the React 404 so it's never indexed).

## P2 — `/` → `/en` 301

**Problem:** `/` and `/en` both serve 200 with identical HTML.

**Fix:**
- `netlify.toml`: add `from = "/" to = "/en" status = 301` (force = true).
- Remove the `<Route path="/" element={<LanguageRedirect />} />` from `App.tsx` (no longer reachable on prod; keep `LanguageSplash` accessible at e.g. `/choose` if we want stored-language users to re-pick — or drop the splash entirely since first-time visitors will land on `/en` and can use the language switcher).
- Decision in plan: **drop the splash from `/`**. The audit's recommendation is unambiguous; the splash was the cause of the duplicate. Stored-language redirect logic moves into the language switcher only.

## P3 — Trailing slash 301

**Problem:** `/en/` returns 200 alongside canonical `/en`.

**Fix:** Add Netlify redirects BEFORE the 200 rewrite rules:
```
/:lang/  → /:lang  301
/:lang/contact/  → /:lang/contact  301
/:lang/newsroom/  → /:lang/newsroom  301
/:lang/newsroom/:slug/  → /:lang/newsroom/:slug  301
/legal/:slug/  → /legal/:slug  301
```

## P4 — Standardize on `https://vorvn.com` (no `www`)

**Fix:** Replace every `https://www.vorvn.com` with `https://vorvn.com`:
- `src/pages/NewsroomArticle.tsx` (share URLs, line ~19)
- `src/pages/legal/LegalLayout.tsx` (canonical/og, line ~58)
- Grep for any remaining occurrences and fix.

## P5 — Visible prerender (remove hidden div)

**Problem:** `scripts/prerender.mjs` injects SEO content inside `<div hidden aria-hidden="true">`. Risk of cloaking signal.

**Fix:** Two-part change in `scripts/prerender.mjs`:
1. Inject the SEO HTML as **visible** static markup inside `#root` (not a sibling hidden div). React hydration will replace it on mount, so users never see it — but crawlers and non-JS clients do, and it matches what React renders.
2. Wrap with a sentinel comment `<!-- prerender:start -->…<!-- prerender:end -->` for debugging.
3. Verify visually with `node scripts/prerender.mjs` then opening a prerendered HTML — the SEO copy should match the React-rendered copy.

Note: this is the lightest-touch fix. A full "match the real React DOM" pass would require running React SSR (renderToString) — much larger refactor; deferred unless audit pushes back.

## P6 — LCP image: founder photo eager + fetchpriority

**Fix:** `src/components/sections/VorvnFounderSection.tsx` — pass `eager` (or `loading="eager"` + `fetchpriority="high"`) to the founder `LoadingImage`. Verify `LoadingImage` supports these props; extend if needed.

## P7 — Umami / cookie banner alignment (low)

Audit flags Umami loading while consent banner is disabled. Umami is cookieless by default — acceptable per GDPR without consent. **Action:** add a code comment in `index.html` documenting "Umami cookieless — no consent required" so future auditors don't re-flag. No functional change.

## P8 — Out of scope (acknowledged, not doing now)

- **Future-article hreflang fallback**: no current mismatch (all 6 langs present). Will revisit when CMS goes live.
- **Rich GEO / LocalBusiness schema, dedicated location pages**: bigger product decision (do we want local SEO for HK / Bali / Morocco?). Park for separate discussion.
- **Full SSR prerender** (renderToString): big refactor; the visible-div fix in P5 resolves the cloaking risk for now.

## Technical section

### `netlify.toml` final redirect order (top-down)

```
1. /api/contact, /api/newsletter           (functions)
2. /                       → /en           301
3. /:lang/                 → /:lang        301   (+ contact, newsroom, slug variants)
4. /:lang/newsroom/:slug   → .../index.html 200
5. /:lang/newsroom         → .../index.html 200
6. /:lang/contact          → .../index.html 200
7. /:lang                  → .../index.html 200
8. /legal/:slug            → .../index.html 200
9. /*                      → /404.html     404   (final fallback — replaces the per-lang SPA catch-alls)
```

The key change: drop `from = "/en/*" to = "/en/index.html" 200` etc. Those are what cause soft-404s.

### Files touched

- `netlify.toml` — redirects rework
- `scripts/prerender.mjs` — visible injection + 404 prerender
- `scripts/generate-sitemap.mjs` — confirm no `www`, ensure `/404.html` excluded
- `src/App.tsx` — remove `/` route (and `LanguageRedirect` usage)
- `src/components/LanguageRedirect.tsx` — delete (or repurpose into LanguageSwitcher)
- `src/components/LanguageSplash.tsx` — delete if unused after the change
- `src/pages/NewsroomArticle.tsx` — `www.vorvn.com` → `vorvn.com`
- `src/pages/legal/LegalLayout.tsx` — same
- `src/pages/NotFound.tsx` — add `<meta name="robots" content="noindex">` via SeoHead
- `src/components/sections/VorvnFounderSection.tsx` — eager LCP
- `src/components/LoadingImage.tsx` — accept `eager` / `fetchPriority` if missing
- `index.html` — Umami comment

### Verification after build

- `curl -I https://vorvn-canvas-core.lovable.app/` → 301 to `/en` (on Netlify after deploy)
- `curl -I .../en/` → 301 to `/en`
- `curl -I .../en/does-not-exist` → 404
- Inspect prerendered `dist/en/index.html` → SEO copy visible inside `#root`, no hidden div
- Confirm no `www.vorvn.com` strings in `dist/`

## Confirmation needed

One decision before I touch code: **drop the language splash entirely?** The audit's clean answer is `/ → /en` 301, which means the splash never shows on first visit. First-time non-English visitors would land on `/en` and use the header language switcher. Confirm and I'll execute the whole plan.
