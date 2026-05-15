## Goal

Get the founder portrait indexed on Google Images for queries like *"Mehdi Ayache"*, *"المهدي عياش"*, *"Moroccan designer Bali"*, *"Moroccan entrepreneur Asia"*, and link the Latin and Arabic name to a single entity.

## Proposed canonical caption

I'll use this everywhere unless you give me a different one:

- **EN**: *Mehdi Ayache Berberos, Founder of VORVN. Moroccan designer and entrepreneur, based between Bali and Asia.*
- **FR**: *Mehdi Ayache Berberos, fondateur de VORVN. Designer et entrepreneur marocain, basé entre Bali et l'Asie.*
- **ES**: *Mehdi Ayache Berberos, fundador de VORVN. Diseñador y emprendedor marroquí, radicado entre Bali y Asia.*
- **ID**: *Mehdi Ayache Berberos, pendiri VORVN. Desainer dan wirausahawan asal Maroko, berbasis di Bali dan Asia.*
- **ZH**: *Mehdi Ayache Berberos，VORVN 创始人。摩洛哥设计师与创业者，常驻巴厘岛与亚洲。*
- **AR**: *المهدي عياش بربروش، مؤسس VORVN. مصمم ورائد أعمال مغربي، مقيم بين بالي وآسيا.*

You can edit any of these before or after I implement.

## Steps

### 1. Rename the image asset
- Rename `src/assets/founder-mehdi.webp` → `src/assets/mehdi-ayache-berberos-moroccan-designer-founder-vorvn.webp`
- Update the import in `VorvnFounderSection.tsx`
- One-time signal upgrade. Filename is the first thing Google reads.

### 2. Localize alt text + caption (i18n)
- Add to all 6 locale files under `founder`:
  - `photoAlt` — short, descriptive, name + role + nationality + location
  - `photoCaption` — the canonical caption above (slightly longer, used in `<figcaption>`)
- Replace hardcoded English alt in `VorvnFounderSection.tsx` with `t('founder.photoAlt')`

### 3. Promote photo to semantic `<figure>` / `<figcaption>`
- Wrap the right panel image in `<figure>` and replace the absolute-positioned overlay div with `<figcaption>`
- Keep the same visual styling (caption bottom-right, mono 9px, accent color), just swap the tag
- Google weights `<figcaption>` text as authoritative caption for the adjacent image

### 4. Add `Person` JSON-LD on the homepage
Inject into `SeoHead.tsx` (and `scripts/prerender.mjs` so it's in the static HTML) when `page === "home"`:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Mehdi Ayache Berberos",
  "alternateName": ["المهدي عياش", "المهدي عياش بربروش", "Mehdi Ayache"],
  "jobTitle": "Founder & CEO",
  "nationality": "MA",
  "image": "https://<domain>/assets/<renamed-file>",
  "worksFor": { "@type": "Organization", "name": "VORVN" },
  "sameAs": [
    "https://www.linkedin.com/in/mehdiayache/",
    "https://mehdiayache.com"
  ],
  "description": "Moroccan designer and entrepreneur, Founder of VORVN. Based between Bali and Asia."
}
```

This is the strongest "this image = this person" signal, and `alternateName` is what links the Arabic and Latin spellings.

### 5. Image sitemap
Extend `public/sitemap.xml` (or the prerender script if it generates the sitemap) so each language URL carries an `<image:image>` block:

```xml
<url>
  <loc>https://<domain>/en</loc>
  <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <image:loc>https://<domain>/assets/<renamed-file></image:loc>
    <image:title>Mehdi Ayache Berberos, Founder of VORVN</image:title>
    <image:caption>Moroccan designer and entrepreneur, based between Bali and Asia.</image:caption>
  </image:image>
</url>
```

One block per language, with localized title/caption.

### 6. Off-site consistency (you, not me)
After deploy, update LinkedIn, mehdiayache.com, any press kit or Crunchbase profile to use:
- The same image file (or a copy with the same filename)
- The same caption wording
- Cross-link: mehdiayache.com → vorvn.com → LinkedIn

This is what actually moves the needle for Google's entity graph. The on-site work above is the foundation; external consistency is the multiplier.

## Files touched

- `src/assets/founder-mehdi.webp` → renamed
- `src/components/sections/VorvnFounderSection.tsx` — import path, alt via i18n, `<figure>`/`<figcaption>`
- `src/i18n/locales/{en,fr,es,id,zh,ar}.json` — add `founder.photoAlt` + `founder.photoCaption`
- `src/components/SeoHead.tsx` — Person JSON-LD on home
- `scripts/prerender.mjs` — same Person JSON-LD in static HTML
- `public/sitemap.xml` (or the generator) — image entries per language

## Out of scope

- EXIF metadata (Google strips it)
- Multiple image variants (splits signal)
- og:image change (separate concern, only touch if you also want the social preview to be your portrait)

## Realistic timeline

Google re-crawls and re-clusters images on its own schedule. Expect 2–6 weeks before you see movement on Image search results, longer for the Arabic/Latin name link to consolidate. The on-site work is one shot; the off-site consistency is what speeds it up.