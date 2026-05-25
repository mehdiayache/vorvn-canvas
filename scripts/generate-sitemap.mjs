// Generates public/sitemap.xml from the route list + src/content/newsroom/*.json.
// Runs as `prebuild` (and `predev`) so the sitemap is always in sync with content.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://vorvn.com';
const TODAY = new Date().toISOString().slice(0, 10);

const LANGUAGES = ['en', 'fr', 'es', 'zh', 'id', 'ar'];

const FOUNDER_IMAGE = {
  loc: `${BASE_URL}/mehdi-ayache-berberos-moroccan-designer-founder-vorvn.webp`,
  titleByLang: {
    en: 'Mehdi Ayache Berberos, Founder of VORVN',
    fr: 'Mehdi Ayache Berberos, fondateur de VORVN',
    es: 'Mehdi Ayache Berberos, fundador de VORVN',
    zh: 'Mehdi Ayache Berberos, VORVN 创始人',
    id: 'Mehdi Ayache Berberos, pendiri VORVN',
    ar: 'المهدي عياش بربروس، مؤسس VORVN',
  },
  captionByLang: {
    en: 'Moroccan designer and entrepreneur, Founder of VORVN, based between Bali and Asia.',
    fr: "Designer et entrepreneur marocain, fondateur de VORVN, basé entre Bali et l'Asie.",
    es: 'Diseñador y emprendedor marroquí, fundador de VORVN, radicado entre Bali y Asia.',
    zh: '摩洛哥设计师与创业者,VORVN 创始人,常驻巴厘岛与亚洲之间。',
    id: 'Perancang dan pengusaha Maroko, pendiri VORVN, berbasis di antara Bali dan Asia.',
    ar: 'مصمم ورائد أعمال مغربي، مؤسس VORVN، يقيم بين بالي وآسيا.',
  },
};

// ---------- Newsroom discovery ----------
const newsroomDir = path.join(ROOT, 'src', 'content', 'newsroom');
const articleGroups = new Map(); // slug -> { slug, byLang: { lang -> {date, updated} } }

if (fs.existsSync(newsroomDir)) {
  for (const f of fs.readdirSync(newsroomDir).filter((x) => x.endsWith('.json'))) {
    const m = f.match(/^(\d{4}-\d{2}-\d{2})-(\w{2})-(.+)\.json$/);
    if (!m) continue;
    try {
      const doc = JSON.parse(fs.readFileSync(path.join(newsroomDir, f), 'utf8'));
      const slug = doc.slug;
      if (!slug) continue;
      if (!articleGroups.has(slug)) articleGroups.set(slug, { slug, byLang: {} });
      articleGroups.get(slug).byLang[doc.lang] = {
        date: doc.date,
        updated: doc.updated || doc.date,
      };
    } catch (e) {
      console.warn('[sitemap] skip bad article:', f, e.message);
    }
  }
}

// ---------- Builders ----------
function hreflangBlock(suffix, restrictTo = null) {
  const langs = restrictTo
    ? LANGUAGES.filter((l) => restrictTo.includes(l))
    : LANGUAGES;
  const lines = langs
    .map(
      (l) =>
        `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}/${l}${suffix}" />`,
    )
    .join('\n');
  const xdef = `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/en${suffix}" />`;
  return `${lines}\n${xdef}`;
}

function urlEntry({ loc, lastmod, changefreq, priority, hreflang, image }) {
  const parts = [`  <url>`, `    <loc>${loc}</loc>`];
  if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
  if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority) parts.push(`    <priority>${priority}</priority>`);
  if (hreflang) parts.push(hreflang);
  if (image) {
    parts.push(
      `    <image:image>`,
      `      <image:loc>${image.loc}</image:loc>`,
      `      <image:title>${escapeXml(image.title)}</image:title>`,
      `      <image:caption>${escapeXml(image.caption)}</image:caption>`,
      `    </image:image>`,
    );
  }
  parts.push(`  </url>`);
  return parts.join('\n');
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ---------- Entries ----------
const entries = [];

// Home per language
for (const l of LANGUAGES) {
  entries.push(
    urlEntry({
      loc: `${BASE_URL}/${l}`,
      lastmod: TODAY,
      changefreq: 'monthly',
      priority: '1.0',
      hreflang: hreflangBlock(''),
      image: {
        loc: FOUNDER_IMAGE.loc,
        title: FOUNDER_IMAGE.titleByLang[l],
        caption: FOUNDER_IMAGE.captionByLang[l],
      },
    }),
  );
}

// Contact per language
for (const l of LANGUAGES) {
  entries.push(
    urlEntry({
      loc: `${BASE_URL}/${l}/contact`,
      lastmod: TODAY,
      changefreq: 'monthly',
      priority: '0.8',
      hreflang: hreflangBlock('/contact'),
    }),
  );
}

// Newsroom index per language
for (const l of LANGUAGES) {
  entries.push(
    urlEntry({
      loc: `${BASE_URL}/${l}/newsroom`,
      lastmod: TODAY,
      changefreq: 'weekly',
      priority: '0.7',
      hreflang: hreflangBlock('/newsroom'),
    }),
  );
}

// Articles × languages (en file is required; other langs only if present)
const sortedGroups = [...articleGroups.values()].sort((a, b) => {
  const ad = a.byLang.en?.date || '';
  const bd = b.byLang.en?.date || '';
  return ad < bd ? 1 : -1;
});

for (const group of sortedGroups) {
  const availableLangs = Object.keys(group.byLang);
  // Emit one entry per language (URL exists for every lang via fallback to en).
  for (const l of LANGUAGES) {
    const meta = group.byLang[l] || group.byLang.en;
    if (!meta) continue;
    entries.push(
      urlEntry({
        loc: `${BASE_URL}/${l}/newsroom/${group.slug}`,
        lastmod: meta.updated || meta.date,
        changefreq: 'monthly',
        priority: '0.6',
        hreflang: hreflangBlock(`/newsroom/${group.slug}`, availableLangs),
      }),
    );
  }
}

// Legal (English-only, no hreflang)
for (const slug of ['privacy', 'notice']) {
  entries.push(
    urlEntry({
      loc: `${BASE_URL}/legal/${slug}`,
      lastmod: TODAY,
      changefreq: 'yearly',
      priority: '0.4',
    }),
  );
}

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset`,
  `  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
  `  xmlns:xhtml="http://www.w3.org/1999/xhtml"`,
  `  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`,
  `>`,
  ...entries,
  `</urlset>`,
  '',
].join('\n');

const outPath = path.join(ROOT, 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml);
console.log(
  `[sitemap] wrote ${entries.length} entries (${articleGroups.size} articles) → public/sitemap.xml`,
);
