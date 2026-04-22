# Project Memory

## Core
- Light UI v2.0. Background `#f1f0ec` (cream), foreground `#000000` (pure black). NO other colors, NO transparency, NO grays — hierarchy via size/weight/spacing.
- ZERO rounded corners anywhere (enforced globally with `* { border-radius: 0 !important }`).
- NO buttons. Every CTA is `.arrow-link` (text + 1px solid black underline + → arrow that nudges 4px on hover, ← in RTL).
- Gasoek One (wordmarks), Inter Tight (text), JetBrains Mono (tags).
- Fonts loaded locally via @fontsource for cross-browser stability.
- Body text 17px/1.6. Semantic H1-H3 hierarchy for SEO.
- Single horizontal gutter: clamp(40px, 8vw, 140px). 1px solid black section rules.
- Global SVG grain overlay with mix-blend-mode: multiply, opacity 0.045. No section numbers. No italics in titles.
- 6 languages, Arabic RTL support, JSON CMS strategy. Routing /:lang.
- Components are prefixed with "Vorvn" (e.g., VorvnHero).
- Legal pages are English-only, served outside /:lang routing (e.g. /legal/privacy).
- No email addresses anywhere in the frontend HTML — contact only via form.
- Netlify Function backend with Nodemailer + Gmail SMTP for contact delivery.
- Persistent no-cache headers in netlify.toml.
- Umami analytics via analytics.vorvn.com (script in index.html).

## Memories
- [Brand Identity](mem://style/brand-identity) — VORVN v2.0 visual rules — Light UI, cream + black only, no transparency, no rounded, no buttons
- [Typography](mem://style/typography) — Font families, @fontsource loading, and hierarchy rules
- [Layout and Texture](mem://style/layout-and-texture) — Global gutter clamp, 1px section separators, and global SVG grain overlay
- [i18n and CMS](mem://tech/i18n-and-cms) — Support for 6 languages (including Arabic RTL), JSON file CMS strategy
- [Routing and SEO](mem://tech/routing-and-seo) — /:lang structure, SeoHead component, sitemap, and SEO hierarchy
- [Legal pages](mem://tech/legal-pages) — English-only legal/compliance pages outside the i18n routing system
- [Hero Section](mem://features/hero-section) — Copy, rotating words, and mobile elements
- [Portfolio Section](mem://features/portfolio-section) — Accordion rows, active vs exited status, and brand list
- [Founder Section](mem://features/founder-section) — Position (post-Hero), 2-column layout, and quote styling
- [Investors Section](mem://features/investors-section) — Visual schema for Incubator/Venture paths and prominent arrow-link CTA
- [Contact Page](mem://features/contact-page) — Netlify Function, SMTP, success card UX, and office directory
- [Navigation](mem://features/navigation) — Header links, clickable logo, and mobile menu priority
- [Closing Section](mem://features/closing-section) — Manifesto statement and "Breathing Eye" interactive visual
- [404 Page](mem://features/404-page) — Custom 404 design and language-aware routing
