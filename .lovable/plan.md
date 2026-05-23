## Goal

Lock the **final** Newsroom JSON schema so it covers everything an article ever needs (author with fallback, cover image, inline images, attributed quotes, updated date), upgrade the article UI (sharing, better pull-quote, image figures), and bring SEO to the state of the art for 2026-2027.

---

## 1. Final JSON schema

Root fields are language-neutral. Everything human-readable lives under `translations.<lang>`. All 6 languages remain required.

```json
{
  "slug": "vorvn-enters-saudi-arabia",
  "date": "2026-05-23",
  "updated": "2026-06-01",
  "type": "news",

  "author": {
    "name": "Mehdi Ayache",
    "title": "CEO & Founder"
  },

  "cover": "/newsroom/vorvn-enters-saudi-arabia/cover.jpg",

  "translations": {
    "en": {
      "title": "VORVN enters Saudi Arabia",
      "excerpt": "A new chapter in the Gulf, starting with Riyadh.",
      "coverAlt": "Riyadh skyline at dusk",
      "body": [
        { "type": "p",     "text": "Today we open our [Riyadh office](https://vorvn.com/contact)." },
        { "type": "h2",    "text": "Why now" },
        { "type": "p",     "text": "..." },
        { "type": "image", "src": "/newsroom/vorvn-enters-saudi-arabia/office.jpg",
                           "alt": "Our team on opening day",
                           "caption": "Opening day, May 2026." },
        { "type": "quote", "text": "Conviction over consensus.",
                           "attribution": "Mehdi Ayache" },
        { "type": "list",  "items": ["First…", "Second…"] }
      ]
    },
    "fr": { "...": "same shape" },
    "es": { "...": "same shape" },
    "zh": { "...": "same shape" },
    "id": { "...": "same shape" },
    "ar": { "...": "same shape" }
  }
}
```

### Field reference

| Field | Required | Notes |
|---|---|---|
| `slug` | yes | Same across all langs. Matches filename. |
| `date` | yes | `YYYY-MM-DD`. Publish date. |
| `updated` | no | `YYYY-MM-DD`. If present → used as `dateModified` + sitemap `<lastmod>`. Falls back to `date`. |
| `type` | yes | `essay` \| `news` \| `collaboration`. Shown as monospace tag. |
| `author` | no | Object `{ name?, title? }`. **Missing fields fall back to "Mehdi Ayache" / "CEO & Founder"**. |
| `cover` | no | Public path (e.g. `/newsroom/<slug>/cover.jpg`). 1200×630 recommended. If missing → no cover hero, no OG image (per your choice). |
| `translations.<lang>.title` | yes | H1 + meta title. |
| `translations.<lang>.excerpt` | yes | Meta description + OG description + timeline preview. |
| `translations.<lang>.coverAlt` | only if `cover` set | Alt text for accessibility + SEO. |
| `translations.<lang>.body[]` | yes, non-empty | Block array. |

### Block types

- `p` — paragraph. Supports inline `[label](url)` links.
- `h2`, `h3` — subheadings.
- `quote` — `{ text, attribution? }`. Upgraded pull-quote design.
- `list` — `{ items: string[] }`. Bulleted.
- `image` — `{ src, alt, caption? }`. Rendered as `<figure>` with `<figcaption>`.

### Image storage

`public/newsroom/<slug>/cover.jpg` (and any inline images). Self-contained per article. JPG for photos, PNG for graphics.

---

## 2. Author fallback

Resolved at render time (and in JSON-LD):

```ts
const author = {
  name: article.author?.name ?? "Mehdi Ayache",
  title: article.author?.title ?? "CEO & Founder",
};
```

Each field falls back independently — guest articles can override just `name`, keep default `title`, or vice versa.

---

## 3. Sharing buttons

Compact row at the **bottom** of each article (cleaner than top+bottom for minimalism). Four actions, all `<a>` tags or one tiny clipboard handler — zero third-party JS.

- **Copy link** — `navigator.clipboard.writeText(url)`, shows a 1.5s "Copied" confirmation in monospace.
- **WhatsApp** — `https://wa.me/?text={title} — {url}`
- **X** — `https://twitter.com/intent/tweet?url={url}&text={title}`
- **LinkedIn** — `https://www.linkedin.com/sharing/share-offsite/?url={url}`

Design: monospace text labels (no icons needed — fits the brand), separated by `·`, hover underline. RTL-aware.

---

## 4. Quote — new pull-quote design

- Inter Tight, **24-28px**, tight leading (`1.35`), `text-foreground`.
- Generous vertical margin (e.g. `my-10`).
- Decorative oversized `"` opening mark (50-60px, low opacity) absolutely positioned, RTL-flipped.
- Optional `attribution` rendered below: JetBrains Mono, 13px, uppercase, preceded by `—`.
- Border-start kept as the structural anchor.
- Wrapped in `<blockquote>` + `<cite>` for semantics.

---

## 5. SEO — full 2026-2027 spec for articles

All injected at prerender time (real HTML for crawlers, not JS).

**Per article HTML head (via `SeoHead` + prerender):**
- `<title>` = article title + ` — VORVN`
- `<meta name="description">` = excerpt
- `<link rel="canonical">` = `https://vorvn.com/{lang}/newsroom/{slug}`
- `<link rel="alternate" hreflang>` ×6 + `x-default`
- `<meta property="og:type" content="article">`
- `og:title`, `og:description`, `og:url`, `og:locale`, `og:locale:alternate` ×5
- `og:image` only if `cover` is set (per your decision)
- `article:published_time`, `article:modified_time`, `article:author`, `article:section` (= type)
- `<meta name="twitter:card" content="summary_large_image">` when cover set, else `summary`

**Per article JSON-LD (two scripts):**

1. `Article`:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Article",
     "headline": "...",
     "description": "...",
     "datePublished": "2026-05-23",
     "dateModified": "2026-06-01",
     "inLanguage": "en",
     "image": ["https://vorvn.com/newsroom/.../cover.jpg"],
     "author":    { "@type": "Person",       "name": "Mehdi Ayache", "jobTitle": "CEO & Founder" },
     "publisher": { "@type": "Organization", "name": "VORVN", "logo": { "@type": "ImageObject", "url": "https://vorvn.com/logo.png" } },
     "mainEntityOfPage": "https://vorvn.com/en/newsroom/slug"
   }
   ```
2. `BreadcrumbList`: Home › Newsroom › Article (localized labels).

**Semantic HTML** in `NewsroomArticle.tsx`:
- `<article>` wrapper
- `<header>` with type tag + `<time datetime="...">` + single `<h1>`
- Author byline in `<p>` with `rel="author"`
- `<figure><img/><figcaption/></figure>` for images
- `<blockquote><p>…</p><cite>…</cite></blockquote>` for quotes
- Body uses `<h2>/<h3>` only (no h1)

**Sitemap & IndexNow:**
- Sitemap already auto-enumerates articles; switch `<lastmod>` to `updated || date`, keep per-article `<xhtml:link rel="alternate" hreflang>` set.
- IndexNow ping list (in `scripts/indexnow-ping.mjs`) extended to include every article URL × 6 languages on each deploy.

**Newsroom index page:**
- `Article` schema not applicable; instead emit `CollectionPage` + `ItemList` JSON-LD listing all article URLs. Helps Google understand the timeline.

---

## 6. Updated validator (`scripts/validate-newsroom.mjs`)

Adds:
- `updated` (optional) must match `YYYY-MM-DD` if present.
- `author`, if present, must be object; `name`/`title` strings if present.
- `cover`, if present, must start with `/`. If present → `coverAlt` required in every language.
- `image` block requires `src` (starts with `/`) and `alt` (string).
- `quote` block `attribution` optional, string if present.
- Verifies referenced image files exist in `public/`.

---

## 7. Sample article rewrite

Rewrite `2026-05-23-welcome-to-the-newsroom.json` to exercise every field (cover + inline image placeholders, an attributed quote, a list, links) so future articles can copy-paste.

We won't generate actual image files — the sample's `cover` field will be omitted (or we can add a 1200×630 placeholder later); per your "no OG image for now" choice this is fine.

---

## 8. Files

**Modify**
- `src/lib/newsroom.ts` — extend `Article` / `Block` types, add `resolveAuthor()`, `getCanonical(article, lang)`.
- `src/components/sections/VorvnNewsroomBlock.tsx` — new `image` block, upgraded `quote` with attribution.
- `src/pages/NewsroomArticle.tsx` — semantic `<article>`, cover figure, share row, author byline.
- `src/components/SeoHead.tsx` — article-specific OG/Twitter/article:* tags, both JSON-LD scripts.
- `scripts/prerender.mjs` — inject new meta + JSON-LD per article, switch sitemap `<lastmod>` to `updated || date`, add `CollectionPage` to index.
- `scripts/indexnow-ping.mjs` — include all per-language article URLs.
- `scripts/validate-newsroom.mjs` — new field validation.
- `src/content/newsroom/2026-05-23-welcome-to-the-newsroom.json` — rewrite as exemplar.
- `src/i18n/locales/*.json` ×6 — add `newsroom.share.copy`, `share.copied`, `share.label`, breadcrumb labels.
- `.lovable/memory/features/newsroom.md` + index — record new schema.

**Create**
- `src/components/VorvnShareRow.tsx` — share buttons component.

**Out of scope (can add later)**
- Real image optimization pipeline (responsive `srcset`, AVIF/WebP) — current setup ships plain `<img loading="lazy">`.
- Default site-wide OG image — explicitly declined for now.
- RSS feed, comments, search, tags.
