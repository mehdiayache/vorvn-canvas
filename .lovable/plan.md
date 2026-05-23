
# Newsroom — Implementation Plan

A file-based "Newsroom": one JSON per article holding all 6 languages, rendered as a reverse-chronological timeline. No CMS, no admin UI. Add an article = drop a JSON file in the repo, commit, deploy.

---

## 1. Content model

### Folder
```text
src/content/newsroom/
  2026-05-23-on-building-quietly.json
  2026-04-10-vorvn-x-partner-x.json
  2026-03-01-from-riyadh.json
```

Filename pattern: `YYYY-MM-DD-slug.json`. Date drives sort, slug drives URL.

### JSON schema (per article)

```json
{
  "slug": "on-building-quietly",
  "date": "2026-05-23",
  "type": "essay",
  "author": "Mehdi Berberos",
  "translations": {
    "en": {
      "title": "On building quietly",
      "excerpt": "Why we don't announce until it ships.",
      "body": [
        { "type": "p", "text": "We started VORVN with one rule…" },
        { "type": "p", "text": "See our [portfolio](/en/#portfolio) for context." },
        { "type": "h2", "text": "The discipline of silence" },
        { "type": "quote", "text": "Make the work the announcement." }
      ]
    },
    "fr": { "title": "...", "excerpt": "...", "body": [...] },
    "es": { ... },
    "ar": { ... },
    "id": { ... },
    "zh": { ... }
  }
}
```

- `type`: `essay` | `news` | `collaboration` — shown as a JetBrains Mono tag.
- `body[]`: typed blocks. `p`, `h2`, `h3`, `quote`, `list` (extensible later: `image`, `embed`).
- Inline links in `text` use markdown `[label](url)` — parsed at render time. External URLs auto-open in new tab.
- All 6 languages required (per your decision). A build-time validator will fail the build if any language is missing for any article.

---

## 2. Routing

| Route | Page |
|---|---|
| `/:lang/newsroom` | Timeline index |
| `/:lang/newsroom/:slug` | Single article |

Inside `/:lang` so language switcher keeps working. Slug stays identical across languages — only the rendered content changes.

---

## 3. Loading mechanism

Vite glob import — zero runtime fetch, fully static, perfect Lighthouse:

```ts
const modules = import.meta.glob('@/content/newsroom/*.json', { eager: true });
```

A small `src/lib/newsroom.ts` helper exports:
- `getAllArticles()` — sorted by date desc
- `getArticle(slug)`
- `translate(article, lang)` — returns the localized payload

---

## 4. UI

### Timeline index (`/:lang/newsroom`)

Plain, monospace-aligned list — same restraint as the Portfolio accordion:

```text
2026.05.23   ESSAY            On building quietly
2026.04.10   COLLABORATION    VORVN × Partner X
2026.03.01   NEWS             From Riyadh
```

- Date column: JetBrains Mono.
- Type tag: JetBrains Mono uppercase, muted color.
- Title: Inter Tight, hover underline.
- 1px row separators (matches existing site rules).
- Single H1: "Newsroom" (or the localized equivalent).
- No pagination until > 30 articles.

### Article page (`/:lang/newsroom/:slug`)

- Header: type tag + date + H1 title + author byline.
- Body: rendered from typed blocks. Max-width ~ 68ch for readability. Body text 17px/1.6 (already standard).
- Footer: "← Back to Newsroom" + prev/next article links.
- RTL handled automatically via existing `useDirection` hook.

---

## 5. Navigation

- **Header nav**: add `Newsroom` link next to `Contact` (both desktop and mobile menu).
- **Footer**: add `Newsroom` link in the existing nav column.
- Translated label per language, stored in `i18n/locales/*.json` under `nav.newsroom`.

---

## 6. SEO (the critical part)

Extend `scripts/prerender.mjs`:

1. **Per-language Newsroom index page**: `/:lang/newsroom/index.html` with hidden `#prerendered-content` listing every article title + excerpt + date.
2. **Per-article page**: `/:lang/newsroom/:slug/index.html` with full article text injected into hidden `#prerendered-content`.
3. **Sitemap auto-generation**: extend `public/sitemap.xml` build step (or the prerender script) to append every `lang × article` URL with `<lastmod>` = article date.
4. **JSON-LD `Article` schema** per article page: `headline`, `datePublished`, `author`, `inLanguage`, `mainEntityOfPage`.
5. **`<link rel="alternate" hreflang>`** between language variants of the same article.
6. **IndexNow ping** runs automatically on deploy (existing script reads sitemap — no changes needed).

---

## 7. Content validation

A small `scripts/validate-newsroom.mjs` run as part of `npm run build` (before prerender):
- Every JSON has all 6 language keys.
- Each language has `title`, `excerpt`, non-empty `body`.
- `date` is valid ISO date.
- `type` ∈ `{essay, news, collaboration}`.
- `slug` matches filename.

Fail the build with a clear message if anything's off — prevents broken articles ever reaching production.

---

## 8. Files to create

- `src/content/newsroom/` (folder) + one sample article (`2026-05-23-welcome.json` with placeholder copy in all 6 languages).
- `src/lib/newsroom.ts` — loader/types.
- `src/lib/parseInline.ts` — markdown-link parser.
- `src/components/sections/VorvnNewsroomBlock.tsx` — block renderer (p, h2, h3, quote, list).
- `src/pages/Newsroom.tsx` — timeline index.
- `src/pages/NewsroomArticle.tsx` — single article.
- `scripts/validate-newsroom.mjs`

## 9. Files to modify

- `src/App.tsx` — add `/newsroom` and `/newsroom/:slug` inside `/:lang`.
- `src/components/Nav.tsx` — add Newsroom link.
- `src/components/sections/VorvnFooter.tsx` — add Newsroom link.
- `src/i18n/locales/*.json` (×6) — add `nav.newsroom` + Newsroom page strings.
- `scripts/prerender.mjs` — generate per-article + index HTML, inject hidden content, update sitemap.
- `package.json` — add validator to build chain.
- `.lovable/memory/index.md` + new `mem://features/newsroom.md`.

---

## How you'll publish a new article

1. Duplicate the most recent JSON in `src/content/newsroom/`.
2. Rename to `YYYY-MM-DD-your-slug.json`.
3. Fill in `title`, `excerpt`, `body[]` for all 6 languages (use any translator — DeepL works well; final pass by you).
4. Commit + push. Netlify build runs validator → prerenders → updates sitemap → pings IndexNow. Live in ~2 min.

Inline links in body text: just write `[label](https://example.com)` or `[label](/en/contact)`.

---

## Out of scope (intentionally)

- Categories, tags, search, RSS — can add later if needed.
- Images inside articles — schema supports it via a future `image` block; not in v1.
- Comments / reactions — never (matches brand restraint).
- Admin UI — never (you wanted file-based).
