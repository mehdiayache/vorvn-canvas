## Root cause

`src/i18n/index.ts` configures `i18next-browser-languagedetector` with:

```ts
detection: {
  order: ['querystring', 'localStorage', 'navigator'],
  caches: ['localStorage'],
}
```

On every app boot, the detector reads the navigator language and **writes it into `localStorage` under `i18nextLng`** — before `LanguageRedirect` runs. So `getStoredLanguage()` always finds a value, and the splash never appears (even after clearing site data).

## Fix

### 1. `src/i18n/index.ts` — stop i18next from auto-writing to localStorage

- Change `caches: ['localStorage']` → `caches: []`
- Remove `'localStorage'` from `order` (keep `querystring`, `navigator`) so the detector doesn't read a stale value either. The splash component is now the single source of truth for the user's chosen language; it writes `i18nextLng` itself, and `LanguageRoute` calls `i18n.changeLanguage(lang)` based on the URL.

This way:
- First visit → no `i18nextLng` in storage → splash shows.
- User picks a language → splash writes `i18nextLng` → next visit `LanguageRedirect` reads it and redirects silently. ✅
- User clears storage → splash shows again. ✅

### 2. `src/components/LanguageRedirect.tsx` — defensive cleanup (optional but recommended)

If a user has a stale `i18nextLng` from before this fix, the splash will be skipped on their next visit. That's actually fine (it's their previously-detected language). No code change needed, but worth noting.

### 3. Verify test path

The splash only renders on `/` (root). Visiting `/en` directly will always skip it — that's correct behavior. To test: clear site data, then visit `/` (not `/en`).

## Out of scope (mentioned but not changing now)

- Splash copy is currently English-only. Functional and matches the "premium picker" pattern (Louis Vuitton-style splashes are typically in one neutral language). Can be revisited later if you want each language label to also translate the heading.

## Files to edit

- `src/i18n/index.ts` — remove localStorage from detector `order` and `caches`.

That's the only change needed to make the splash actually appear.
