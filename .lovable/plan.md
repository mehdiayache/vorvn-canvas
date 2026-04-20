
## Issue diagnosis

You're seeing English on `/fr` (and same will happen on `/es /zh /id /ar`) because **the locale JSON files are not actually translated**. They were created as scaffolds that copy the English strings verbatim for every section except a small handful (`investors`, `contact`, `notFound`, `footer.careers` — and those only in `fr.json`).

So `i18n.changeLanguage('fr')` *is* working — it just loads a French file that contains English text. Nothing is broken in routing or the switcher; the content payload itself is missing.

## Plan

Translate every locale file fully and natively (no machine-fluff, no AI tone), keeping `VORVN` as the brand name in Latin letters across all languages including Arabic and Chinese.

### Files to update

1. `src/i18n/locales/fr.json` — finish translating the English-leftover sections
2. `src/i18n/locales/es.json` — full Spanish translation
3. `src/i18n/locales/zh.json` — full Simplified Chinese translation (VORVN stays Latin)
4. `src/i18n/locales/id.json` — full Bahasa Indonesia translation
5. `src/i18n/locales/ar.json` — full Arabic translation (VORVN stays Latin, RTL already handled)

### Sections to translate in each file

- `nav` (tag, contact, menu — keep "VORVN" untouched in code, not in JSON anyway)
- `hero` (headline, taglinePre/Post, words.build/design/own, basedIn, scroll)
- `entity` (label, statement, detail, designNote)
- `presence` (label, three location blocks: region/city/entity/address/badge — keep entity legal names like "VORVN LIMITED" untouched)
- `portfolio` (label, intro, v2.intro, metaStrip, metricsLabels, inDevelopmentSince, all 6 brand pitches/desc, statusLabel; keep brand names intact: Cook Warriors, Hearts Notes, MAQTOB, xVoyager, Warung Marrakech, Davi Properties)
- `principles` (label, 3 items title + body)
- `founder` (label, quote, title — name stays "Mehdi Ayache Berberos")
- `investors` (already done in FR; needs doing in ES/ZH/ID/AR)
- `closing` (statement, chaos, lifeless, sub)
- `footer` (legal, careers, geo)
- `notFound` (full)
- `contact` (already done in FR; needs review in others)

### Translation rules

- **VORVN**: never transliterated. Stays "VORVN" in 中文, العربية, etc.
- **Brand names** (Cook Warriors, MAQTOB, Eggscalibur, etc.): never translated.
- **Legal entities** (VORVN LIMITED, PT. VORVN GROUP INDONESIA): never translated.
- **Tone**: terse, operator voice — match the FR investor copy. No marketing fluff, no "we are passionate about…".
- **Arabic**: native RTL phrasing; punctuation `،` and `؟`; numerals can stay Western (01, 02, 2023) to match the design system's mono-numeric style.
- **Chinese**: Simplified, concise; em-dash `——`; keep `·` separators as they are part of the visual system.

### Hero rotating word

Currently the words `Build / Design / Own` rotate via `t('hero.words.build|design|own')`. These will be translated per locale — verify in `VorvnHero.tsx` that it reads from i18n (not hardcoded). I'll check during implementation; if hardcoded, switch to i18n keys.

### Verification step after edits

- Switch through `/en /fr /es /zh /id /ar` and confirm every section renders in the target language.
- Confirm `VORVN` wordmark stays Latin everywhere.
- Confirm Arabic flips RTL and reads naturally.
- Confirm `/contact` page also fully translates in every language.

### What I will NOT touch

- No layout, no component, no routing changes.
- No SEO/`SeoHead` changes (already wired to pull `t('seo.*')` — I'll add seo blocks where missing per language).
- No `LanguageSwitcher` / `Nav` changes — they work correctly.

### Out of scope (flag for later if you want)

- Auto-translation pipeline / CMS — staying with the JSON-file CMS as per memory.
- Per-language SEO sitemap entries already exist.

