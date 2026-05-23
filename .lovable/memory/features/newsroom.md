---
name: Newsroom
description: File-based JSON-per-article publishing, 6 langs required, prerendered + sitemap auto. Schema v2 with author fallback, cover image, inline images, attributed quotes, dateModified, sharing.
type: feature
---

# Newsroom

Flat, file-based publishing. Each article is one JSON in `src/content/newsroom/` holding all 6 languages. No CMS, no database, no admin UI.

## File naming

`src/content/newsroom/YYYY-MM-DD-slug.json` — filename must match `${date}-${slug}.json` or validation fails.

## JSON schema (v2)

```json
{
  "slug": "unique-slug",
  "date": "2026-05-23",
  "updated": "2026-06-01",          // optional, drives dateModified + sitemap lastmod
  "type": "essay|news|collaboration",
  "author": {                        // optional, each field falls back independently
    "name": "Mehdi Ayache",
    "title": "CEO & Founder"
  },
  "cover": "/newsroom/<slug>/cover.jpg",  // optional, 1200x630, used as OG image when set
  "translations": {
    "en": {
      "title": "...",
      "excerpt": "...",
      "coverAlt": "...",             // required only when cover is set
      "body": [ ...blocks ]
    },
    "fr": { ... }, "es": { ... }, "zh": { ... }, "id": { ... }, "ar": { ... }
  }
}
```

All 6 languages required. Validator (`scripts/validate-newsroom.mjs`) runs before build.

## Author fallback

If `author` (or any of its fields) is missing → defaults to **Mehdi Ayache / CEO & Founder**. Implemented in `resolveAuthor()` in `src/lib/newsroom.ts` AND mirrored in `scripts/prerender.mjs`.

## Block types in body[]

- `{ "type": "p", "text": "..." }` — supports inline `[label](url)` links, external URLs open in new tab
- `{ "type": "h2", "text": "..." }` / `{ "type": "h3", "text": "..." }`
- `{ "type": "quote", "text": "...", "attribution": "Name" }` — attribution optional, renders as pull-quote
- `{ "type": "list", "items": ["...", "..."] }`
- `{ "type": "image", "src": "/newsroom/<slug>/img.jpg", "alt": "...", "caption": "..." }` — caption optional, validator checks src exists in /public

## Images

Stored under `public/newsroom/<slug>/`. Self-contained per article — easy to delete cleanly. Validator verifies referenced files exist.

## SEO baked in

Per article, prerender emits:
- `<title>`, `<meta description>`, canonical, hreflang ×6 + x-default
- `og:type=article`, `og:image` (cover when set, else default site OG), full og:* set
- `article:published_time`, `article:modified_time`, `article:author`, `article:section`
- Twitter `summary_large_image`
- JSON-LD `Article` (with author Person + jobTitle, publisher Organization) and `BreadcrumbList` (Home › Newsroom › Article, localized labels)

Newsroom index page also emits `CollectionPage` + `ItemList` JSON-LD enumerating all articles.

Sitemap: `<lastmod>` uses `updated || date`. Per-article hreflang block included automatically.

IndexNow: reads sitemap, so every article URL ×6 langs pings automatically on each deploy.

## Sharing

`VorvnShareRow` component at bottom of every article. Buttons: Copy link, WhatsApp, X, LinkedIn. All native `<a>` or clipboard API — zero third-party scripts.

## Quote design

Pull-quote with oversized decorative `"` opening mark (low opacity, RTL-aware), 22-26px Inter Tight, border-start anchor, `<cite>` for attribution in JetBrains Mono.
