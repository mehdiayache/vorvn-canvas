

## Design system pivot — Light UI, monochrome, no buttons

A complete visual inversion of the site. Two colors only, links instead of buttons, zero rounded corners anywhere.

### New color system (strict, no exceptions)

- **Background**: `#f1f0ec` (the accent — now the canvas)
- **Foreground**: `#000000` (pure black — text, rules, dots, borders, icons)
- **No transparency.** No white. No grays. No opacity tricks.
- All "mid" / "dim" tones currently in the system → collapse to solid black. Hierarchy is created via **size, weight, and spacing**, not color.

This means every section, every component, every page (including legal pages, 404, contact form, navigation, footer) flips to black-on-cream.

### No buttons anywhere

Every CTA on the site becomes a text link with underline + arrow:

```
Send a message →
View portfolio →
Send another →
```

- Underline is solid 1px black, sits directly under the text
- Arrow is `→` (LTR) / `←` (RTL), part of the link text
- Hover: arrow nudges 4px in reading direction, underline stays
- Replaces every `<button>`-styled CTA: Hero CTA, Investors CTA, Contact submit, Contact "Send another", Footer links, etc.

The contact form **submit** also becomes a link-style action (`Send message →`), not a button block. The form still posts; only the visual treatment changes.

### Zero rounded corners — confirmed everywhere

- `--radius` already `0px` ✓
- Audit and force `rounded-none` (or remove `rounded-*` classes) on: tags, chips, inputs, textareas, toasts, success card, cookie banner, language switcher, mobile menu, accordion triggers, any shadcn component still leaking radius.
- The "Received" chip, status pills, mono tags — all sharp rectangles.

### Texture & accents

- Grain overlay stays but recalibrated for light bg (lower opacity, darker noise so it reads on cream instead of black)
- 1px section rules: black at full opacity (no more `rule` token at 9% opacity)
- Breathing Eye / Eye SVG / Globe SVG: re-stroke in black

### Files to touch

**Tokens & global styles**
- `src/index.css` — invert `--bg` to `42 11% 93%` (≈ #f1f0ec), `--foreground` to `0 0% 0%`, collapse `--mid` and `--dim` to black, set `--rule` to solid black, recalibrate grain opacity, rewrite `.legal-prose` colors
- `tailwind.config.ts` — verify token mapping, no extra color additions

**Components — button removal & link styling**
- `src/components/ui/button.tsx` — keep file (shadcn deps may import it) but variants `default` / `secondary` / `outline` get restyled to underline-link appearance so any leftover usage stays on-brand. Add a new `arrow-link` utility class in `index.css` for explicit use.
- New utility class `.arrow-link` in `index.css`: underline + arrow + hover nudge animation

**Pages & sections — black-on-cream pass + button→link swap**
- `src/components/Nav.tsx`, `NavLink.tsx`, `LanguageSwitcher.tsx`, `CookieBanner.tsx`
- `src/components/sections/VorvnHero.tsx` (CTA → arrow link)
- `src/components/sections/VorvnInvestorsSection.tsx` (prominent CTA → arrow link, large but still text)
- `src/components/sections/VorvnPortfolioSection.tsx` (status tags → sharp rectangles, black border/text)
- `src/components/sections/VorvnFounderSection.tsx`, `VorvnEntitySection.tsx`, `VorvnPrinciplesSection.tsx`, `VorvnPresenceSection.tsx`, `VorvnClosingSection.tsx`, `VorvnFooter.tsx`
- `src/pages/Contact.tsx` — submit becomes `Send message →` link; success card black border on cream, "Send another →" arrow link; "ERR ·" stays black
- `src/pages/legal/LegalLayout.tsx`, `LegalNotice.tsx`, `PrivacyPolicy.tsx`
- `src/pages/NotFound.tsx`
- `src/components/BreathingEye.tsx` + `.css`, `EyeSvg.tsx`, `GlobeSvg.tsx` — stroke colors → black

**Toasts**
- `src/components/ui/sonner.tsx` — invert: cream bg, black border, black text, sharp corners

### Out of scope
- Layout, copy, sections order, fonts, animations — unchanged
- i18n content — unchanged
- Umami, Netlify function, routing — unchanged

### Memory updates after approval
Update `mem://style/brand-identity` and core memory: "Light UI. Background `#f1f0ec`, foreground `#000000`. No other colors, no transparency, no rounded corners, no buttons — only underlined arrow links."

