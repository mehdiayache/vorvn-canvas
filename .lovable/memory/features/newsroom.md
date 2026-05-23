---
name: Newsroom
description: v3 file-based publishing — one JSON per language per article, English fallback, no covers
type: feature
---

# Newsroom (v3)

## Filename convention
`src/content/newsroom/YYYY-MM-DD-{lang}-{id}.json`
- `{lang}` ∈ en, fr, es, zh, id, ar
- `{id}` = kebab-case slug, identical across languages
- English file is REQUIRED per article; other languages optional and fall back to `en`

## JSON schema (flat, one language per file)
```json
{
  "slug": "...", "lang": "en", "date": "YYYY-MM-DD",
  "updated": "YYYY-MM-DD",
  "type": "essay|news|collaboration|analysis",
  "author": { "name": "...", "title": "..." },
  "title": "...", "excerpt": "...",
  "body": [ { "type": "p|h2|h3|list|quote|image", ... } ]
}
```

## Rules
- Author fallback: Mehdi Ayache / CEO & Founder when `author` omitted
- TM/® symbols are mandatory on brand names (Cook Warriors™, VORVN™, etc.) — including title/excerpt
- No `cover` images. No default OG image for articles — site default is reused.
- Inline links via `[label](url)` inside any `text`. External auto-opens new tab.
- `title` ≤ 60 chars (warn), `excerpt` ≤ 160 chars (warn)
- Cross-file fields (`date`, `type`, `updated`, `author.name`) must match the `en` file within a group

## Routing
- `/:lang/newsroom` — index, lists articles in requested lang (else en fallback per row)
- `/:lang/newsroom/:slug` — serves requested lang file else en; `<html lang>` reflects the served language
- hreflang alternates per-article are restricted to languages that actually exist; `x-default` always points to `/en/...`

## Sharing
`VorvnShareRow`: Copy link · WhatsApp · X · LinkedIn

## Files
- `src/lib/newsroom.ts` — loader (groups by slug, picks lang with en fallback)
- `src/components/sections/VorvnNewsroomBlock.tsx` — block renderer
- `src/pages/Newsroom.tsx`, `src/pages/NewsroomArticle.tsx`
- `src/components/SeoHead.tsx` — supports `hreflangLangs` subset + `articleMeta.servedLang`
- `scripts/validate-newsroom.mjs` — pre-build schema/filename validator
- `scripts/prerender.mjs` — emits per-lang static HTML + sitemap + JSON-LD
