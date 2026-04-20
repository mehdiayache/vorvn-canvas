

## Goal
Auto-detect the visitor's browser language on first visit and redirect them to the matching `/:lang` route. Fall back to `/en` if their language isn't supported.

## Current Behavior
- `/` → hard redirect to `/en` (always, regardless of browser language)
- `i18next-browser-languagedetector` is already installed and configured, but its detection only fires *after* the redirect to `/en` already happened, so it never gets a chance to influence the URL.

## Proposed Change
Replace the static `<Navigate to="/en" />` on the `/` route with a small **`LanguageRedirect`** component that:

1. Reads `navigator.language` (e.g. `"fr-FR"`, `"ar"`, `"zh-CN"`).
2. Extracts the base code (`fr`, `ar`, `zh`).
3. Checks it against our `LANGUAGES` list (`en, fr, zh, es, id, ar`).
4. Also checks `localStorage` first — if the user previously picked a language manually (via the language switcher), respect that choice instead of the browser default.
5. Redirects to `/<detected>` if supported, else `/en`.

### Detection priority (highest → lowest)
```text
1. localStorage  → user's explicit prior choice
2. navigator.languages[0..n]  → browser preference list
3. navigator.language  → single fallback
4. 'en'  → ultimate fallback
```

Using `navigator.languages` (plural) is better than just `navigator.language` because it respects the user's full ranked preference list — e.g. a user with `["fr-CA", "fr", "en"]` who doesn't have `fr-CA` supported will still match `fr`.

## Files to Change

**1. `src/components/LanguageRedirect.tsx`** — new file
Tiny component that runs the detection logic and returns `<Navigate to={detected} replace />`.

**2. `src/App.tsx`** — one-line change
Swap the `/` route element from `<Navigate to="/en" replace />` to `<LanguageRedirect />`.

## What stays the same
- `/en`, `/fr`, `/ar`, etc. — all direct URLs keep working exactly as today (great for SEO + sharing).
- `LanguageRoute` already syncs `i18n.language`, `<html lang>`, `<html dir>` once on the language route — no change needed.
- `SeoHead` already emits `hreflang` alternates for all 6 languages — Google will still see distinct localized pages.
- The language switcher still overrides via `localStorage`, so manual choices persist across sessions.

## SEO note
Auto-detection happens **only on `/`** (the bare root). Search engines crawling `/fr`, `/ar`, etc. directly are unaffected — they get the correct localized HTML immediately, no redirect chain. This is the recommended pattern (Google explicitly warns against auto-redirecting localized URLs based on browser language).

