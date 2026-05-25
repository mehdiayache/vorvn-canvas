## Goal

Stop Google Search Console from reporting "Redirect error" on newsroom articles, and make every article discoverable via sitemap.

## Changes

### 1. Switch BASE_URL from `www.vorvn.com` → `vorvn.com` (apex)

Files to update (single constant in each):
- `scripts/prerender.mjs` — `BASE_URL`
- `src/components/SeoHead.tsx` — `BASE_URL`
- `scripts/indexnow-ping.mjs` — base URL
- `scripts/verify-seo.mjs` — if it hardcodes the host

Effect: canonical, hreflang, OG, Twitter, IndexNow pings, and JSON-LD all point at `https://vorvn.com/...`, which is the host Netlify already serves directly — no www→apex 301 anymore.

### 2. Kill the trailing-slash 301 on prerendered routes

Add to `netlify.toml`, **above** the existing SPA fallback:

```toml
# Serve prerendered HTML for clean URLs without redirecting to add a trailing slash.
[[redirects]]
  from = "/:lang/newsroom/:slug"
  to   = "/:lang/newsroom/:slug/index.html"
  status = 200

[[redirects]]
  from = "/:lang/newsroom"
  to   = "/:lang/newsroom/index.html"
  status = 200

[[redirects]]
  from = "/:lang/contact"
  to   = "/:lang/contact/index.html"
  status = 200

[[redirects]]
  from = "/:lang"
  to   = "/:lang/index.html"
  status = 200
```

Effect: `https://vorvn.com/en/newsroom/<slug>` returns 200 directly with the prerendered file — no 301 chain. Canonical matches URL exactly.

### 3. Tighten the SPA fallback (no more soft-404)

Replace the current global `/* → /index.html 200` with a fallback that only catches paths inside known language roots, and let everything else 404 naturally:

```toml
[[redirects]]
  from = "/:lang/*"
  to   = "/:lang/index.html"
  status = 200
  conditions = {Path = ["/en/*","/fr/*","/es/*","/zh/*","/id/*","/ar/*"]}
```

Unknown roots will hit React Router's `NotFound` only when accessed via a known lang prefix; truly unknown paths return Netlify's 404.

### 4. Auto-generate the sitemap

Replace hand-edited `public/sitemap.xml` with a build-time generator.

- **New file:** `scripts/generate-sitemap.mjs`
  - `BASE_URL = 'https://vorvn.com'`
  - Reads `src/content/newsroom/*.json` to discover slugs + `updated`/`date`
  - Emits entries for:
    - 6 × `/{lang}` (with full hreflang block + image entry like today)
    - 6 × `/{lang}/contact` (with hreflang)
    - 6 × `/{lang}/newsroom` (with hreflang)
    - Per article × per available language `/{lang}/newsroom/{slug}` with hreflang restricted to languages that actually exist for that article
    - `/legal/privacy`, `/legal/notice` (English-only)
  - `lastmod` = article `updated` for article rows, today's date for static rows
  - Writes to `public/sitemap.xml` (Vite copies to `dist/`)
- **Delete:** existing hand-edited `public/sitemap.xml` content (script overwrites)
- **Wire-up:** add `prebuild` and `predev` to `package.json`:
  ```json
  "predev":   "node scripts/generate-sitemap.mjs",
  "prebuild": "node scripts/validate-newsroom.mjs && node scripts/generate-sitemap.mjs"
  ```
  (Keep existing `build` chain intact; just prepend sitemap generation.)

### 5. Update `public/robots.txt`

Change the `Sitemap:` directive to `https://vorvn.com/sitemap.xml`.

## Verification (after deploy)

Run from local terminal:

```bash
curl -sI https://vorvn.com/en/newsroom/meme-we-made-real-cook-warriors-method
# expect: HTTP/2 200 (no 301)

curl -s https://vorvn.com/sitemap.xml | grep -c newsroom
# expect: > 0
```

In Google Search Console:
- Submit `https://vorvn.com/sitemap.xml`
- Use "Test live URL" on the article, then "Request indexing"
- Ensure a **Domain property** for `vorvn.com` exists

## Out of scope

- No changes to article content, design, or React components.
- No change to the prerender content pipeline (it already produces correct HTML — only its `BASE_URL` constant changes).
- No Helmet migration (prerender + `SeoHead` already covers per-route head).
