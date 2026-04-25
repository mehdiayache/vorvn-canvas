
# Fix Presence Data — Bali Entity, Hong Kong Badge, Morocco Status

## Goal

Correct factual errors in entity names, addresses, and status badges that currently appear in **multiple places** (UI, hardcoded Contact page, legal documents, Schema.org JSON-LD baked into prerendered HTML). Single source of truth across 6 languages and search-engine metadata.

## The corrections

| Field | Current | New |
|---|---|---|
| Bali entity | `PT. VORVN GROUP INDONESIA` | `PT. Aduh (Lagi) Studio` |
| Bali address | `Jl. Seroja No.28, Tonja, Kec. Denpasar Utara, Bali 80235` | `No. 12, Jl. Ciung Wanara 1, Denpasar Timur, Bali 80235` |
| Bali region label | `Design Studio` | `Incubator Studio` |
| Bali badge | `Operations` | `Incubator` |
| Hong Kong badge | `Headquarters` | `Holding` |
| Morocco card | Entity `PARTICIPATIONS` + 3-line address + badge `Expansion` | Region label only + city `Morocco` + single `Coming soon` badge — no entity, no address |

## Implementation

### 1. Update i18n locales (6 files)
For each of `src/i18n/locales/{en,fr,es,zh,ar,id}.json`, in `presence.locations`:

- **Hong Kong (index 0)**: `badge` → `Holding` (translated per language: EN `Holding`, FR `Holding`, ES `Holding`, ZH `控股`, AR `قابضة`, ID `Holding`)
- **Bali (index 1)**:
  - `region` → `Incubator Studio` (translated)
  - `entity` → `PT. Aduh (Lagi) Studio` (proper noun, identical across all)
  - `address` → `No. 12, Jl. Ciung Wanara 1\nDenpasar Timur\nBali 80235` (identical across all)
  - `badge` → `Incubator` (translated: EN `Incubator`, FR `Incubateur`, ES `Incubadora`, ZH `孵化器`, AR `حاضنة`, ID `Inkubator`)
- **Morocco (index 2)**:
  - `region` → keep existing `Origin Market` (translated, already correct)
  - `city` → keep `Morocco` (translated)
  - `entity` → empty string `""`
  - `address` → empty string `""`
  - `badge` → `Coming soon` (translated: EN `Coming soon`, FR `Bientôt`, ES `Próximamente`, ZH `即将推出`, AR `قريباً`, ID `Segera hadir`)

### 2. Update `VorvnPresenceSection.tsx` to handle empty entity/address
The component currently always renders entity div + address paragraph. Wrap each in a conditional — only render when the string is non-empty. Visual rhythm preserved by the badge always rendering on a fixed offset using flex spacing instead of margin chains. Card spacing review on mobile and lg breakpoints to confirm Morocco card still aligns with the other two when its middle slots are empty.

### 3. Sync hardcoded `OFFICES` array in `src/pages/Contact.tsx`
Lines 13–28. Update Hong Kong badge to `Holding`. Update Bali entry: region → `Incubator Studio`, entity → `PT. Aduh (Lagi) Studio`, address → new street/locality, badge → `Incubator`. Contact page stays at 2 offices (HK + Bali) — Morocco not added since it's not active.

### 4. Update Schema.org JSON-LD (Google-visible)
**Two places, must stay in sync:**
- `src/components/SeoHead.tsx` lines 198–205 — Bali `PostalAddress` block
- `scripts/prerender.mjs` lines 152–158 — same block, used for the 14 prerendered HTML files

Both updated to:
```js
{
  '@type': 'PostalAddress',
  streetAddress: 'No. 12, Jl. Ciung Wanara 1',
  addressLocality: 'Denpasar Timur',
  addressRegion: 'Bali',
  postalCode: '80235',
  addressCountry: 'ID',
}
```

### 5. Fix legal pages
**`src/pages/legal/LegalNotice.tsx`** lines 41–54 ("Affiliated group entities"):
- Collapse the two-entity confusion (`PT. VORVN GROUP INDONESIA` + `ADUH (LAGI) STUDIO`) into a single correct entry: `PT. Aduh (Lagi) Studio — incubator studio, No. 12, Jl. Ciung Wanara 1, Denpasar Timur, Bali 80235, Indonesia.`
- Drop the `Participations — Northwest Africa` bullet entirely (Morocco isn't operational).

**`src/pages/legal/PrivacyPolicy.tsx`** lines 33–34: Replace `affiliated entities including PT. VORVN GROUP INDONESIA (Bali, Indonesia) and ADUH (LAGI) STUDIO` with `our affiliated incubator studio PT. Aduh (Lagi) Studio (Bali, Indonesia)`.

Also update line 185 ("operations of our Bali studio") wording stays — it's generic.

### 6. Tighten SEO copy in titles/descriptions
Drop active mention of Morocco from homepage titles/descriptions in `SeoHead.tsx` and `scripts/prerender.mjs` (since it's not yet operational — claiming Morocco operations in meta is misleading and dilutes keyword focus). Keep `Hong Kong · Bali`. Update all 6 language variants in both files. Also update the homepage `description` strings (lines 125–129 in prerender) to remove "Morocco / Maroc / Marruecos / Maroko".

### 7. Update memory
Update `mem://features/contact-page` and add a note in `mem://index.md` (Core or new file) capturing the correct Bali entity (`PT. Aduh (Lagi) Studio`) and full address — so the next AI loop doesn't regress this when editing nearby code.

## Files touched (~12)

- `src/i18n/locales/en.json`, `fr.json`, `es.json`, `zh.json`, `ar.json`, `id.json`
- `src/components/sections/VorvnPresenceSection.tsx` (conditional render for empty fields)
- `src/pages/Contact.tsx`
- `src/components/SeoHead.tsx`
- `scripts/prerender.mjs`
- `src/pages/legal/LegalNotice.tsx`
- `src/pages/legal/PrivacyPolicy.tsx`
- `mem://features/contact-page` and possibly `mem://features/presence` (new)

## Verification

After changes, mentally run through:
1. Visit `/en` — Presence section: HK card shows `Holding` badge; Bali card shows `Incubator Studio` / `PT. Aduh (Lagi) Studio` / new address / `Incubator` badge; Morocco card shows region label, city, and only `Coming soon` badge with empty middle slots aligned to the same baseline as siblings.
2. Visit `/fr`, `/ar`, `/zh` — same structure with translated labels and badges; Bali entity/address identical across languages; Arabic remains RTL with `Coming soon` translation.
3. Visit `/en/contact` — office directory shows the same 2 corrected entries.
4. Visit `/legal/notice` — affiliated entities section shows one correct entity, no Participations bullet.
5. View page source on `/en` (after build) — `<script type="application/ld+json">` Organization block contains new Bali address; meta description does not mention Morocco.
6. Run `npm run build` — `scripts/verify-seo.mjs` still passes 166 checks (it doesn't validate address fields, just titles/canonicals/hreflang, so no regression risk).

## Out of scope

- No change to `Warung Marrakech` brand (it's a brand name, not a Morocco operation).
- No change to the Investors section "Bali" / "Hong Kong" copy — already correctly framed (Incubator vs Venture). The recent Investors redesign already uses "Incubator" wording for Bali.
- Phone numbers, emails, contact form, footer geo line — not touched.
