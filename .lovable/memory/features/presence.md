---
name: Presence Section & Entity Data
description: Canonical entity names, addresses, and badges for HK, Bali, Morocco — used in homepage Presence section, Contact OFFICES array, legal pages, and Schema.org JSON-LD
type: feature
---

Three locations on the homepage Presence section. Same entity data is duplicated (intentionally — different shapes) in: i18n locales (`presence.locations`), `src/pages/Contact.tsx` `OFFICES` array, `src/components/SeoHead.tsx` Organization JSON-LD, `scripts/prerender.mjs` Organization JSON-LD, and `src/pages/legal/LegalNotice.tsx` + `PrivacyPolicy.tsx`. Always update ALL of these together.

**Hong Kong (Holding):**
- Region: `Holding Entity` (translated)
- Entity: `VORVN LIMITED`
- Address: `RM4 16/F, Ho King Commercial Centre, 2–16 Fa Yuen Street, Mongkok, Kowloon, Hong Kong`
- Badge: `Holding` (translated)

**Bali (Incubator — NOT operations, NOT design studio):**
- Region: `Incubator Studio` (translated)
- Entity: `PT. Aduh (Lagi) Studio` (proper noun, identical across all 6 languages — do NOT translate, do NOT use `PT. VORVN GROUP INDONESIA` which was the old wrong name)
- Address: `No. 12, Jl. Ciung Wanara 1, Denpasar Timur, Bali 80235, Indonesia`
- Badge: `Incubator` (translated: EN Incubator, FR Incubateur, ES Incubadora, ZH 孵化器, AR حاضنة, ID Inkubator)
- Description: Design-to-market validation, full-stack and fast. NOT fulfillment/operations.

**Morocco (Origin Market — coming, not active):**
- Region: `Origin Market` (translated, kept)
- City: `Morocco` (translated)
- Entity: empty string `""` — do NOT add an entity name
- Address: empty string `""` — no description, no explanation
- Badge: `Coming soon` (translated: EN Coming soon, FR Bientôt, ES Próximamente, ZH 即将推出, AR قريباً, ID Segera hadir)
- The Presence section component (`VorvnPresenceSection.tsx`) conditionally renders entity/address only when non-empty.

**SEO copy rule:** Until Morocco is operational, do NOT mention it in homepage `<title>`, meta `description`, or Organization JSON-LD `description` — only Hong Kong and Bali. Updating to mention Morocco is a launch decision, not a copy tweak.
