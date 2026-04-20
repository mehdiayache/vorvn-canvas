

## Root cause — confirmed

The success card is **invisible**, not black-on-black. Here's why:

1. The card uses `className="... reveal d2 ..."`
2. CSS `.reveal` sets `opacity: 0` until `.on` is added
3. `useScrollReveal` runs **once on mount** and only observes elements that already exist
4. The success card mounts **after** submit — long after the observer was set up
5. Result: card stays at `opacity: 0` forever → looks like nothing happened

Same trap will hit `sendError` (also missing reveal but rendered conditionally — that one is fine).

The colors themselves are correct (white border + white text on dark bg). The card is just literally invisible.

## Fixes

### 1. Strip `reveal` from post-submit UI (the real bug)
- Success card: remove `reveal d2`, replace with a real entrance animation that fires on mount (`animate-[fadeUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]`).
- Add a matching `fadeUp` keyframe (or reuse existing) so the card slides in confidently.

### 2. Premium 2026 success card (refined, brand-native)
Layout, all monochrome — no off-brand greens:
```
┌─────────────────────────────────────────────┐
│  ●  RECEIVED · 2026.04.20 14:32 UTC         │  ← live mono timestamp
│                                             │
│  Message sent.                              │  ← large display text
│                                             │
│  Thanks for reaching out. We read every     │  ← body
│  message and reply within 48 hours…         │
│                                             │
│  ─────────────────────────────────────────  │  ← 1px rule
│                                             │
│  [ Send another → ]    Reply window · 48h   │  ← primary action + meta
└─────────────────────────────────────────────┘
```
- Solid 1px foreground border, generous padding (`p-10 md:p-12`)
- Top-left animated dot (slow pulse, white)
- Mono micro-tag with timestamp captured at submit-time (gives the "2026 confirmation receipt" feel)
- Big serif-free display title in `text-foreground`
- Body in `text-mid`
- Primary "Send another" rendered as a real solid `bg-foreground text-background` button (matches the original Send button), not a thin underline — so the next action is unmistakable
- Footer mono row reiterates the 48h reply window

### 3. Sonner toast on success
Trigger `toast.success(t('contact.success.title'), { description: t('contact.success.body') })` right after `setStatus('sent')`. Sonner's `<Toaster />` is already mounted in `App.tsx`. Style it brand-native via `toastOptions` (mono, no green, white-on-dark) — adjust in `src/components/ui/sonner.tsx` so future toasts match.

### 4. Submitting state polish
Already has a pulse dot. Add a subtle progress bar shimmer under the button (1px rule with a 30% segment animating left→right) so "Sending…" feels alive.

### 5. Error state — confirm brand consistency
Already cleaned (no red). Keep as-is.

## Files to touch

- `src/pages/Contact.tsx` — rebuild success block, drop `reveal`, add mount animation, fire toast, add submit progress shimmer
- `src/components/ui/sonner.tsx` — restyle toasts to brand (mono labels, white border, dark surface, no green)
- `src/index.css` — add `@keyframes fadeUpIn` and `@keyframes shimmer` if not already usable; ensure animations work without observer

## Out of scope
- Color tokens (correct as-is)
- `useScrollReveal` (works correctly for static content; we just shouldn't put dynamic UI inside it)
- All other sections

