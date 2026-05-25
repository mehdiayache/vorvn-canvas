## Goal

Tighten the Newsroom: simpler headline, cleaner 3-category taxonomy, fix existing article's type.

## 1. New headline + intro (all 6 languages)

Replace current copy in `newsroom.headline` / `newsroom.intro`:

- Headline: **"Newsroom."**
- Intro: **"Press releases, announcements, and updates."**

Files: `src/i18n/locales/{en,fr,es,zh,id,ar}.json` — translate intro per locale, keep "Newsroom." as-is (proper noun, same across languages — Arabic gets its native equivalent).

## 2. New category taxonomy

Replace the 4 current types (`essay | news | collaboration | analysis`) with **3 new types**:

| New type            | Meaning                                                         |
|---------------------|-----------------------------------------------------------------|
| `announcement`      | Official news, launches, partnerships                           |
| `deep-insight`      | The inner kitchen: how we built it, what we tried, what worked  |
| `perspective`       | CEO's point of view on the industry                             |

Changes:

- `src/lib/newsroom.ts` — update `ArticleType` union to `'announcement' | 'deep-insight' | 'perspective'`.
- `src/i18n/locales/*.json` — replace `newsroom.types.*` map with the 3 new keys, translated per locale.
- `scripts/validate-newsroom.mjs` — update the allowed-types whitelist so the build fails fast on legacy values.
- Any other reference to the old types (search across `src/` + `scripts/`) gets updated.

## 3. Reclassify existing article

`src/content/newsroom/2026-05-23-en-meme-we-made-real-cook-warriors-method.json`:

- Change `"type": "analysis"` → `"type": "deep-insight"`.

## 4. Verify

- Run `npm run build` (validator + prerender) to confirm no stale type references.
- Visit `/en/newsroom` → headline reads "Newsroom.", article shows "Deep Insights" badge.
- Visit `/en/newsroom/meme-we-made-real-cook-warriors-method` → category tag updated.

## Open question (your message cut off)

You wrote **"ALSO first article is"** and stopped. Did you mean:
- (a) The first article should be a different/new one (a fresh announcement)?
- (b) You want to **pin** a specific article to the top?
- (c) Something else?

Tell me what comes after "ALSO first article is" and I'll fold it into the plan before we build.
