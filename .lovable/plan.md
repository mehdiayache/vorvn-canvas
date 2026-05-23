# Newsroom v3 — Writer & Developer Documentation

Architecture change: **one JSON file per language per article**, with English as the canonical fallback. Cover images removed (decision locked). `analysis` added as a valid type. Trademark symbols (™, ®) are mandatory wherever brand names appear.

---

## 1. File naming

```
src/content/newsroom/YYYY-MM-DD-{lang}-{id}.json
```

- `YYYY-MM-DD` — publication date (must match the `date` field inside the file)
- `{lang}` — one of: `en`, `fr`, `es`, `zh`, `id`, `ar`
- `{id}` — kebab-case article slug (letters, digits, hyphens only). Same across all languages.

Examples:
```
2026-05-23-en-engineering-the-meme-cook-warriors-operating-model.json
2026-05-23-fr-engineering-the-meme-cook-warriors-operating-model.json
```

Rules:
- The `en` version is REQUIRED for every article. It is the canonical source.
- Other languages are OPTIONAL. If `zh` is missing, the site serves the `en` file for `/zh/newsroom/{id}` (with `<html lang="en">` on that route and an `hreflang` pointing only to languages that exist).
- All files sharing the same `{date}-{id}` must agree on: `slug` (`id`), `date`, `type`, `author`, `updated`.

For now: ship `en` only. Other languages can be added file-by-file later without code changes.

---

## 2. JSON schema (per file)

```jsonc
{
  "slug": "engineering-the-meme-cook-warriors-operating-model",
  "lang": "en",
  "date": "2026-05-23",
  "updated": "2026-05-23",        // optional, omit if same as date
  "type": "analysis",              // essay | news | collaboration | analysis
  "author": {                      // optional, defaults to Mehdi Ayache / CEO & Founder
    "name": "Mehdi Ayache",
    "title": "CEO & Founder"
  },
  "title": "Engineering the meme: Cook Warriors™ operating model",
  "excerpt": "How Cook Warriors™ turned a single launch into a measurable operating model. (≤160 chars)",
  "body": [
    { "type": "p",     "text": "Opening paragraph with an [inline link](https://cookwarriors.com) and ™ where required." },
    { "type": "h2",    "text": "Section heading" },
    { "type": "h3",    "text": "Sub-section heading" },
    { "type": "p",     "text": "More prose. External links open in a new tab automatically." },
    { "type": "list",  "items": ["Point one", "Point two", "Point three"] },
    { "type": "quote", "text": "The pull quote.", "attribution": "Optional source" },
    { "type": "p",     "text": "Closing paragraph with a CTA: [contact us](/en/contact)." }
  ]
}
```

Notes vs v2:
- No top-level `translations` wrapper. Each file is one language.
- New required field: `lang` (must match filename `{lang}`).
- No `cover` / `coverAlt` anywhere. Image blocks inside body are still allowed (rare) but typically omitted.
- `type` now accepts `analysis`.

---

## 3. Block reference

| Type    | Required fields            | Optional       | Renders as |
|---------|----------------------------|----------------|------------|
| `p`     | `text`                     | —              | `<p>` with inline `[label](url)` parsing |
| `h2`    | `text`                     | —              | `<h2>` |
| `h3`    | `text`                     | —              | `<h3>` |
| `list`  | `items` (string[])         | —              | `<ul><li>` |
| `quote` | `text`                     | `attribution`  | `<blockquote><p>…</p><cite>— …</cite></blockquote>` |
| `image` | `src` (in `/public`), `alt`| `caption`      | `<figure><img/><figcaption/></figure>` |

Inline markdown supported inside any `text`: `[label](url)`. External URLs auto-open in new tab. Use relative paths (`/en/contact`) for internal links.

---

## 4. Trademark rules (mandatory)

Always use the proper symbol on brand names:
- `Cook Warriors™`, `Eggscalibur™`, `VORVN®` (if registered), etc.
- Symbol goes immediately after the name, no space.
- Apply in `title`, `excerpt`, and `body` consistently.
- Translations must preserve symbols even when the brand name is transliterated.

---

## 5. SEO & length guidance

- `title` — ≤ 60 chars (Google truncates beyond).
- `excerpt` — ≤ 160 chars (used as `<meta name="description">` and Open Graph description).
- One `h1` is rendered by the page from `title`; body must only use `h2` / `h3`.
- Inline links inside `p` blocks improve internal linking and authority.
- `updated` drives `<lastmod>` in sitemap and `dateModified` in JSON-LD.

---

## 6. Validator changes (developer notes)

`scripts/validate-newsroom.mjs` must be updated to:
1. Parse filename as `YYYY-MM-DD-{lang}-{id}.json`; enforce `lang ∈ LANGS`, `id` kebab-case.
2. Require `lang` field equal to filename `{lang}`.
3. Require an `en` file for every `{date}-{id}` group; other languages optional.
4. Cross-check that within a group, `date`, `type`, `author`, `updated` match the `en` file.
5. Add `analysis` to the allowed `type` set.
6. Drop all `cover` / `coverAlt` checks.
7. Validate body blocks against the table above (no top-level `translations`).
8. Warn if `title > 60` or `excerpt > 160` chars (warning, not failure).

---

## 7. Loader changes (`src/lib/newsroom.ts`)

- Glob `../content/newsroom/*.json`; bucket by `{date}-{id}`.
- Expose `getArticle(slug, lang)`:
  1. Try exact `{lang}` file.
  2. Fall back to `en` file.
  3. Return `undefined` only if neither exists.
- `getAllArticles(lang)` returns one entry per slug, preferring `{lang}` then `en`, sorted by date desc.
- `Article` type is now flat (no `translations` map).
- `resolveAuthor()` fallback unchanged: `Mehdi Ayache` / `CEO & Founder`.

---

## 8. Route & SEO behavior

- `/:lang/newsroom` lists every unique slug; titles/excerpts use `{lang}` else `en`.
- `/:lang/newsroom/:slug` serves `{lang}` else `en`. When falling back, the page emits `<html lang="en">` and only lists existing language alternates in `hreflang`.
- `x-default` always points to the `en` URL.
- JSON-LD `inLanguage` reflects the actually-served language.

---

## 9. Writer checklist (per article)

- [ ] Filename: `YYYY-MM-DD-en-{id}.json`, `id` kebab-case.
- [ ] `lang: "en"`, `date` matches filename.
- [ ] `type` is one of: `essay`, `news`, `collaboration`, `analysis`.
- [ ] `title` ≤ 60 chars, includes ™ where applicable.
- [ ] `excerpt` ≤ 160 chars, includes ™ where applicable.
- [ ] First block is a `p` that hooks the reader.
- [ ] Use `h2` for sections, `h3` only inside sections.
- [ ] At least 2 inline links: one external (source/brand), one internal (`/en/contact` or `/en/newsroom`).
- [ ] Optional `quote` block for the standout line; `attribution` only if not the author.
- [ ] No `cover` field. No `image` blocks unless essential.
- [ ] Closing `p` ends with a clear CTA link.

---

## 10. Files to modify (when build mode is approved)

- `scripts/validate-newsroom.mjs` — new filename + flat-schema validation, allow `analysis`, drop cover.
- `src/lib/newsroom.ts` — flat `Article`, per-language files, fallback resolver.
- `src/components/sections/VorvnNewsroomBlock.tsx` — consume flat shape.
- `src/pages/Newsroom.tsx`, `src/pages/NewsroomArticle.tsx` — pass `lang`, render fallback notice if served from `en`.
- `src/components/SeoHead.tsx`, `scripts/prerender.mjs` — drop cover/OG image, restrict `hreflang` to existing langs, `x-default → en`.
- `src/content/newsroom/2026-05-23-welcome-to-the-newsroom.json` — migrate to `2026-05-23-en-welcome-to-the-newsroom.json` flat shape; delete old file.
- `.lovable/memory/features/newsroom.md` — update to v3 rules.
