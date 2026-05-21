# Fix Bing "thin content" — prerender real page text

## The problem

Every page on vorvn.com ships near-empty HTML to crawlers. React fills the content in after page load, but Bingbot, Googlebot, and AI search bots read the HTML *before* JavaScript runs. So they see 7–92 words per page instead of the real 500–4000+.

Bing flagged 1 page. In reality every page is thin.

## The fix

Extend `scripts/prerender.mjs` (the same script we used for the H1 fix) to inject the actual page text into the prerendered HTML, per language. The text sits inside a hidden `<div>` that React replaces on hydration — visitors see zero change, but crawlers finally see real content.

## What gets injected per page type

**Homepage (`/`, `/en/`, `/fr/`, `/es/`, `/zh/`, `/id/`, `/ar/`)** — pulled from existing i18n JSON files (`src/i18n/locales/*.json`), already translated:
- Hero headline + subhead + rotating words
- Founder section (quote + bio paragraphs)
- Entity / Presence / Portfolio / Operate / Investors / Closing sections
- Footer copy

Estimated 600–1200 words per language, all already written.

**Contact page (`/{lang}/contact`)** — intro copy, office addresses, form labels, all from i18n JSON. ~200 words.

**Legal pages (`/legal/privacy`, `/legal/notice`)** — the full text from `PrivacyPolicy.tsx` and `LegalNotice.tsx`. ~2000–4000 words each. Extracted once into plain-text constants the script reads.

## How the injection works

```html
<body>
  <h1 class="sr-only">…</h1>             ← already there
  <div id="prerendered-content" hidden>   ← NEW
    <h2>…</h2><p>…</p><p>…</p>…
  </div>
  <div id="root"></div>                   ← React replaces this on hydration
</body>
```

`hidden` + sitting outside `#root` means:
- Crawlers parse and index every word
- Real users never see it (React mounts inside `#root` instantly)
- No layout shift, no visual change, no CSS work
- No duplicate-content issue (it's the same page's own copy)

## Files touched

- `scripts/prerender.mjs` — add `buildHomeContent(lang)`, `buildContactContent(lang)`, `buildLegalContent(slug)` helpers; call them in the 4 existing injection points
- `scripts/legal-content.mjs` — NEW, plain-text export of privacy + notice copy (single source of truth so both the React component and the prerender pull from the same place — optional refactor, or we just duplicate for v1)

No React component changes. No CSS changes. No visible UI changes.

## Verification

After publish:
```
curl -sL https://vorvn.com/en/ | sed 's/<[^>]*>/ /g' | wc -w
```
Should jump from 84 → 800+. Then trigger a Bing rescan; the thin-content notice clears on the next crawl (usually 1–7 days).

## Out of scope

- Server-side rendering / SSR migration (overkill; prerendering is enough for a static marketing site)
- Rewriting copy for SEO keywords (separate task if you want it)
- AI-search optimization beyond what this already fixes
