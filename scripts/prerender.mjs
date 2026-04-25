// Build-time prerender for VORVN.
// Reads dist/index.html (Vite output) and produces a real static HTML file per
// localized route, with title, description, canonical, hreflang, OG, Twitter,
// and JSON-LD baked into <head> BEFORE JavaScript runs.
//
// React still hydrates normally on top — UX unchanged. Crawlers see correct
// language metadata on the first byte of every URL.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const baseHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(baseHtmlPath)) {
  console.error('[prerender] dist/index.html not found — run `vite build` first.');
  process.exit(1);
}

const BASE_URL = 'https://www.vorvn.com';
const NOW = new Date().toISOString().slice(0, 10);

const LANGUAGES = [
  { code: 'en', dir: 'ltr', ogLocale: 'en_US' },
  { code: 'fr', dir: 'ltr', ogLocale: 'fr_FR' },
  { code: 'es', dir: 'ltr', ogLocale: 'es_ES' },
  { code: 'zh', dir: 'ltr', ogLocale: 'zh_CN' },
  { code: 'id', dir: 'ltr', ogLocale: 'id_ID' },
  { code: 'ar', dir: 'rtl', ogLocale: 'ar_AR' },
];

const SEO = {
  home: {
    en: {
      title: 'VORVN — Autonomous IP & Brand Holdings | Hong Kong · Bali',
      desc: 'VORVN is an independent IP & brand holdings company. We design, build and own digital-first brands from Hong Kong and our Bali incubator studio.',
    },
    fr: {
      title: 'VORVN — Holding indépendant de marques & PI | Hong Kong · Bali',
      desc: "VORVN est un holding indépendant de propriété intellectuelle et de marques. Nous concevons, construisons et possédons des marques digitales depuis Hong Kong et notre studio incubateur de Bali.",
    },
    es: {
      title: 'VORVN — Holding autónomo de marcas y PI | Hong Kong · Bali',
      desc: 'VORVN es un holding independiente de propiedad intelectual y marcas. Diseñamos, construimos y poseemos marcas digitales desde Hong Kong y nuestro estudio incubadora en Bali.',
    },
    zh: {
      title: 'VORVN — 自主知识产权与品牌控股公司 | 香港 · 巴厘岛',
      desc: 'VORVN 是独立的知识产权与品牌控股公司。我们在香港与巴厘岛孵化工作室设计、构建并拥有数字优先品牌。',
    },
    id: {
      title: 'VORVN — Holding IP & Merek Independen | Hong Kong · Bali',
      desc: 'VORVN adalah perusahaan holding IP & merek yang independen. Kami merancang, membangun, dan memiliki merek digital dari Hong Kong dan studio inkubator kami di Bali.',
    },
    ar: {
      title: 'VORVN — حيازات مستقلة للعلامات والملكية الفكرية | هونغ كونغ · بالي',
      desc: 'VORVN شركة حيازات مستقلة للعلامات التجارية والملكية الفكرية. نصمم ونبني ونمتلك علامات رقمية من هونغ كونغ ومن استوديو الحاضنة لدينا في بالي.',
    },
  },
  contact: {
    en: {
      title: 'Contact VORVN — Investors, Brand Collaborations & Press',
      desc: 'Talk to VORVN directly. Investor introductions, brand collaborations, press, and careers — Hong Kong & Bali. We reply within 48 hours.',
    },
    fr: {
      title: 'Contact VORVN — Investisseurs, Collaborations & Presse',
      desc: "Parlez directement à VORVN. Introductions investisseurs, collaborations de marque, presse, carrières — Hong Kong & Bali. Réponse sous 48h.",
    },
    es: {
      title: 'Contacto VORVN — Inversores, Colaboraciones y Prensa',
      desc: 'Habla directamente con VORVN. Inversores, colaboraciones de marca, prensa y carreras — Hong Kong y Bali. Respondemos en 48 horas.',
    },
    zh: {
      title: '联系 VORVN — 投资人、品牌合作、媒体与招聘',
      desc: '直接联系 VORVN。投资人介绍、品牌合作、媒体与招聘 —— 香港与巴厘岛。我们在 48 小时内回复。',
    },
    id: {
      title: 'Kontak VORVN — Investor, Kolaborasi Merek & Pers',
      desc: 'Hubungi VORVN langsung. Pengantar investor, kolaborasi merek, pers, dan karier — Hong Kong & Bali. Kami membalas dalam 48 jam.',
    },
    ar: {
      title: 'اتصل بـ VORVN — مستثمرون، تعاونات وعلامات وصحافة',
      desc: 'تحدث مع VORVN مباشرة. مقدمات للمستثمرين، تعاونات العلامات، الصحافة والوظائف — هونغ كونغ وبالي. نرد خلال 48 ساعة.',
    },
  },
};

const LEGAL_SEO = {
  privacy: {
    title: 'Privacy Policy | VORVN',
    desc: 'How VORVN LIMITED collects, uses, and protects your personal data. GDPR compliant.',
  },
  notice: {
    title: 'Legal Notice | VORVN',
    desc: 'Legal notice and corporate information for VORVN LIMITED.',
  },
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJsonForScript(json) {
  // Prevent </script> breakout inside JSON-LD
  return JSON.stringify(json).replace(/</g, '\\u003c');
}

function buildHreflangBlock(suffix) {
  const links = LANGUAGES.map(
    (l) =>
      `    <link rel="alternate" hreflang="${l.code}" href="${BASE_URL}/${l.code}${suffix}" />`,
  ).join('\n');
  const xdef = `    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/en${suffix}" />`;
  return `${links}\n${xdef}`;
}

function organizationJsonLd(lang) {
  const descByLang = {
    en: 'Independent IP & brand holdings company designing, building and owning digital-first brands from Hong Kong and our Bali incubator studio.',
    fr: "Holding indépendant de propriété intellectuelle et de marques — conception, construction et détention de marques digitales depuis Hong Kong et notre studio incubateur de Bali.",
    es: 'Holding independiente de propiedad intelectual y marcas — diseño, construcción y propiedad de marcas digitales desde Hong Kong y nuestro estudio incubadora en Bali.',
    zh: '独立的知识产权与品牌控股公司,在香港与巴厘岛孵化工作室设计、构建并拥有数字优先品牌。',
    id: 'Perusahaan holding IP & merek independen yang merancang, membangun, dan memiliki merek digital dari Hong Kong dan studio inkubator kami di Bali.',
    ar: 'شركة حيازات مستقلة للعلامات التجارية والملكية الفكرية، تصمم وتبني وتمتلك علامات رقمية من هونغ كونغ ومن استوديو الحاضنة لدينا في بالي.',
  };
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VORVN',
    legalName: 'VORVN LIMITED',
    url: BASE_URL,
    logo: `${BASE_URL}/apple-touch-icon.png`,
    description: descByLang[lang] || descByLang.en,
    foundingDate: '2023',
    sameAs: [
      'https://www.linkedin.com/company/vorvn',
      'https://instagram.com/vorvn.company',
    ],
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'RM4 16/F, Ho King Commercial Centre, 2–16 Fa Yuen Street, Mongkok',
        addressLocality: 'Kowloon',
        addressCountry: 'HK',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'No. 12, Jl. Ciung Wanara 1',
        addressLocality: 'Denpasar Timur',
        addressRegion: 'Bali',
        postalCode: '80235',
        addressCountry: 'ID',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+852-9290-0981',
        contactType: 'customer service',
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'French', 'Spanish', 'Chinese', 'Indonesian', 'Arabic'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+1-218-417-4846',
        contactType: 'customer service',
        areaServed: 'Worldwide',
      },
    ],
  };
}

function websiteJsonLd(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VORVN',
    url: `${BASE_URL}/${lang}`,
    inLanguage: lang,
    publisher: { '@type': 'Organization', name: 'VORVN', url: BASE_URL },
  };
}

function contactPageJsonLd(lang, title) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${BASE_URL}/${lang}/contact`,
    name: title,
    inLanguage: lang,
    isPartOf: { '@type': 'WebSite', name: 'VORVN', url: BASE_URL },
  };
}

function breadcrumbJsonLd(lang, suffix, label) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'VORVN', item: `${BASE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: label, item: `${BASE_URL}/${lang}${suffix}` },
    ],
  };
}

function buildHeadBlock({
  lang,
  dir,
  ogLocale,
  title,
  desc,
  canonical,
  hreflangBlock,
  jsonLdScripts,
  noindex = false,
}) {
  const robots = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large';
  return [
    `    <title>${escapeHtml(title)}</title>`,
    `    <meta name="description" content="${escapeHtml(desc)}" />`,
    `    <meta name="robots" content="${robots}" />`,
    `    <link rel="canonical" href="${canonical}" />`,
    hreflangBlock,
    `    <meta property="og:title" content="${escapeHtml(title)}" />`,
    `    <meta property="og:description" content="${escapeHtml(desc)}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:url" content="${canonical}" />`,
    `    <meta property="og:site_name" content="VORVN" />`,
    `    <meta property="og:locale" content="${ogLocale}" />`,
    `    <meta property="og:image" content="${BASE_URL}/og-image.jpg" />`,
    `    <meta property="og:image:width" content="1200" />`,
    `    <meta property="og:image:height" content="630" />`,
    `    <meta property="og:image:alt" content="${escapeHtml(title)}" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `    <meta name="twitter:description" content="${escapeHtml(desc)}" />`,
    `    <meta name="twitter:image" content="${BASE_URL}/og-image.jpg" />`,
    ...jsonLdScripts.map(
      (obj) =>
        `    <script type="application/ld+json" data-prerender>${escapeJsonForScript(obj)}</script>`,
    ),
  ].join('\n');
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

function injectInto(html, { lang, dir, headBlock }) {
  let out = html.replace(
    /<html[^>]*>/i,
    `<html lang="${lang}" dir="${dir}" data-theme="dark">`,
  );

  const stripPatterns = [
    /<title>[\s\S]*?<\/title>\s*/i,
    /<meta\s+name=["']description["'][^>]*>\s*/gi,
    /<meta\s+name=["']robots["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi,
    /<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi,
    /<link\s+rel=["']canonical["'][^>]*>\s*/gi,
    /<link\s+rel=["']alternate["'][^>]*hreflang=[^>]*>\s*/gi,
  ];
  for (const p of stripPatterns) out = out.replace(p, '');

  out = out.replace('</head>', `${headBlock}\n  </head>`);
  return out;
}

function writeFile(relPath, content) {
  const full = path.join(distDir, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
}

let count = 0;

for (const l of LANGUAGES) {
  const seo = SEO.home[l.code];
  const canonical = `${BASE_URL}/${l.code}`;
  const headBlock = buildHeadBlock({
    lang: l.code,
    dir: l.dir,
    ogLocale: l.ogLocale,
    title: seo.title,
    desc: seo.desc,
    canonical,
    hreflangBlock: buildHreflangBlock(''),
    jsonLdScripts: [organizationJsonLd(l.code), websiteJsonLd(l.code)],
  });
  const html = injectInto(baseHtml, { lang: l.code, dir: l.dir, headBlock });
  writeFile(`${l.code}/index.html`, html);
  count++;
}

for (const l of LANGUAGES) {
  const seo = SEO.contact[l.code];
  const canonical = `${BASE_URL}/${l.code}/contact`;
  const headBlock = buildHeadBlock({
    lang: l.code,
    dir: l.dir,
    ogLocale: l.ogLocale,
    title: seo.title,
    desc: seo.desc,
    canonical,
    hreflangBlock: buildHreflangBlock('/contact'),
    jsonLdScripts: [
      contactPageJsonLd(l.code, seo.title),
      breadcrumbJsonLd(l.code, '/contact', 'Contact'),
    ],
  });
  const html = injectInto(baseHtml, { lang: l.code, dir: l.dir, headBlock });
  writeFile(`${l.code}/contact/index.html`, html);
  count++;
}

for (const slug of ['privacy', 'notice']) {
  const seo = LEGAL_SEO[slug];
  const canonical = `${BASE_URL}/legal/${slug}`;
  const headBlock = [
    `    <title>${escapeHtml(seo.title)}</title>`,
    `    <meta name="description" content="${escapeHtml(seo.desc)}" />`,
    `    <meta name="robots" content="index, follow, max-image-preview:large" />`,
    `    <link rel="canonical" href="${canonical}" />`,
    `    <meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `    <meta property="og:description" content="${escapeHtml(seo.desc)}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:url" content="${canonical}" />`,
    `    <meta property="og:site_name" content="VORVN" />`,
    `    <meta property="og:locale" content="en_US" />`,
    `    <meta property="og:image" content="${BASE_URL}/og-image.jpg" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `    <meta name="twitter:description" content="${escapeHtml(seo.desc)}" />`,
    `    <meta name="twitter:image" content="${BASE_URL}/og-image.jpg" />`,
  ].join('\n');
  const html = injectInto(baseHtml, { lang: 'en', dir: 'ltr', headBlock });
  writeFile(`legal/${slug}/index.html`, html);
  count++;
}

{
  const seo = SEO.home.en;
  const canonical = `${BASE_URL}/en`;
  const headBlock = buildHeadBlock({
    lang: 'en',
    dir: 'ltr',
    ogLocale: 'en_US',
    title: seo.title,
    desc: seo.desc,
    canonical,
    hreflangBlock: buildHreflangBlock(''),
    jsonLdScripts: [organizationJsonLd('en'), websiteJsonLd('en')],
  });
  const html = injectInto(baseHtml, { lang: 'en', dir: 'ltr', headBlock });
  fs.writeFileSync(baseHtmlPath, html, 'utf8');
}

const sitemapPath = path.join(distDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sm = fs.readFileSync(sitemapPath, 'utf8');
  sm = sm.replace(/<lastmod>[\d-]+<\/lastmod>/g, `<lastmod>${NOW}</lastmod>`);
  fs.writeFileSync(sitemapPath, sm, 'utf8');
}

console.log(`[prerender] Wrote ${count} localized HTML files + refreshed root + sitemap.`);
