# Global Scroll Reset on Route Change

## The problem (confirmed)

React Router's client-side navigation swaps the rendered route but **never touches `window.scrollY`**. So if you're scrolled down on Page A and click any link to Page B, you land on Page B at the exact same scroll position. This affects **every navigation in the app**, not just the footer → contact case:

- Footer links → Contact / Legal pages
- Nav logo → Home
- Language Splash → `/:lang`
- Language Switcher (e.g. `/en` → `/fr`)
- 404 → Home
- Any future route added later

It is a single global concern and deserves a single global fix.

## The fix

Create one tiny component that listens to pathname changes and resets scroll. Mount it once inside `<BrowserRouter>`. Zero changes to any existing `Link`, `Nav`, or `Footer`.

### 1. New file — `src/components/ScrollToTop.tsx`

```tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
```

- Uses `pathname` only (not `search` / `hash`) so query-string changes don't trigger a reset.
- Instant jump (no smooth scroll) — matches the feel of a real page load and avoids janky animation on slow devices.
- Renders nothing.

### 2. Edit `src/App.tsx`

Mount `<ScrollToTop />` as the first child of `<BrowserRouter>`, just before `<Routes>`:

```tsx
<BrowserRouter>
  <ScrollToTop />
  <Routes>
    ...
  </Routes>
  <CookieBanner enabled={COOKIE_CONSENT_REQUIRED} />
</BrowserRouter>
```

That's it. Two files touched.

## Behavior after the fix

| Action | Result |
|---|---|
| Footer → Contact while scrolled down | Lands at top of Contact ✅ |
| Nav logo → Home from any page | Lands at top of Home ✅ |
| Language Splash → `/en` | Lands at top ✅ |
| Language Switcher `/en` → `/fr` | Lands at top (treated as new entry) ✅ |
| Browser back/forward | Also resets to top — clean and predictable ✅ |
| In-page anchor jumps (if added later) | Unaffected (they use `hash`, not `pathname`) ✅ |

## What this does NOT do

- Does not interfere with the Language Splash logic.
- Does not affect SEO, prerendering, or `SeoHead`.
- Does not touch any existing component, link, or style.
- Does not add a dependency.

One file added, one file edited, one rule enforced everywhere.