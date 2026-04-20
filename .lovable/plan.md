

## Assessment — what's actually wrong

### Issue 1: Stories of Bible row is invisible — i18n key mismatch (the real bug)

`src/i18n/locales/en.json` accidentally contains **two** `portfolio.brands` arrays:
- **Lines 76–113** — a `portfolio.v2.brands` array (5 entries with `pitch`) — used by nothing
- **Lines 115–140** — `portfolio.brands` (the one the component reads) — only **4 entries**: Cook Warriors, MAQTOB, xVoyager, Warung Marrakech. **Stories of Bible was never added here.**

`VorvnPortfolioSection` does:
```ts
const brand = t(`portfolio.brands.${index}`, { returnObjects: true })
```

`BRANDS_DATA` is now: `[Cookwarriors, StoriesOfBible, MAQTOB, xVoyager, Warung]` (5 items)
`portfolio.brands` i18n is: `[Cookwarriors, MAQTOB, xVoyager, Warung]` (4 items)

→ At index 1, the row pulls **MAQTOB's text** but renders against Stories-of-Bible data
→ At index 2, 3, 4, indexes are now shifted — every row below Cookwarriors shows the WRONG text or empty text (i18next returns the key string when out of bounds, which then gets cast to `{ name, sector, ...} = "portfolio.brands.4"`, accessing `.name` on a string returns `undefined` → blank row)

This must be fixed in **all 6 locale files** (en, fr, es, zh, id, ar) — insert "Stories of Bible" entry at index 1 with `name`, `sector`, `statusLabel`, `desc` fields.

### Issue 2: Contact form — submit button is invisible/broken-looking

Line 402: `bg-foreground text-background font-sans ...`
- `bg-foreground` = HSL(42 11% 91%) = near-white ✓
- `text-background` ← **`background` token doesn't exist** in our CSS vars. We define `--bg`, not `--background` directly mapped to text. Tailwind's `text-background` resolves to `hsl(var(--background))` = `var(--bg)` = `0 0% 6.7%` (very dark) — actually this IS correct.

Looking again at the real issue: the button works. The actual contact-page problems are:

**a. Success state is dull/lifeless** — when `status === 'sent'`, the success block is just plain text. No visual confirmation chip, no green dot, no border accent. User says "no feedback" — they likely don't realize the form succeeded because the layout barely changes.

**b. The "Received" tag (`contact.success.tag`) defined in i18n is NEVER rendered** in `Contact.tsx` — the success block at lines 246–267 only shows `success.title`, `success.body`, `success.again`. The tag/chip is lost.

**c. The submitting state has no spinner / loading visual** — just text swap.

**d. `sendError` message uses `text-destructive` (red) which clashes** with the strict dark-minimal palette (no other red anywhere on the site).

### Issue 3: Color tokens

The codebase color tokens are correct. The real "color" complaint is about the contact form:
- destructive red for errors clashes with the brand (no red elsewhere)
- success state has no color feedback at all

---

## Plan — focused fixes only

### Fix A: Restore portfolio i18n integrity (6 files)
Insert Stories of Bible at **index 1** of `portfolio.brands` in each locale (`en`, `fr`, `es`, `id`, `zh`, `ar`):
```json
{
  "name": "Stories of Bible",
  "sector": "Christian Publishing · USA",
  "statusLabel": "Exited",
  "desc": "Incubated and co-built one of the fastest-growing Christian book brands in the US market. Led the full production side — design systems, team building, content production, and delivery infrastructure. Assembled a creative studio that produced illustrated Bible books at scale. The brand generated over $2M in revenue across the partnership period."
}
```
Translate `sector`, `statusLabel`, `desc` for each locale.

Also: **remove the orphaned `portfolio.v2.brands` array** (lines 76–113 in en.json) in all 6 locales — it's dead weight causing confusion.

### Fix B: Contact form — proper submitted feedback
Rework the success block in `src/pages/Contact.tsx` (lines 246–267):
- Add a status chip at top: small mono "✓ RECEIVED" using `contact.success.tag` with a foreground-colored dot
- Wrap the block in a subtle 1px foreground border with extra padding (mirrors the entity-section card feel)
- Keep typography minimal, no bright colors — use brand-native foreground/mid

### Fix C: Submitting state visual
Add a tiny inline pulsing dot before "Sending…" text on the submit button (uses existing `animate-[pulse_...]` keyframe).

### Fix D: Replace destructive red with brand-native error treatment
Change `text-destructive` and `border-destructive` in Contact.tsx (4 occurrences) to `text-foreground` + `border-foreground` with a small leading mono "ERR ·" prefix on error text. Keeps the strict palette intact, errors still read clearly.

### Files touched
- `src/i18n/locales/en.json`, `fr.json`, `es.json`, `id.json`, `zh.json`, `ar.json` — insert SoB entry at index 1 of `portfolio.brands`, drop the orphan `v2.brands` block
- `src/pages/Contact.tsx` — rebuild success block, add submit-state pulse dot, replace destructive colors with brand-native error styling

### Out of scope (not changing)
- BRANDS_DATA structure
- VorvnPortfolioSection.tsx (already correct, just needs matching i18n)
- Global color tokens — they're fine; only the form was using off-brand red
- Any other section

