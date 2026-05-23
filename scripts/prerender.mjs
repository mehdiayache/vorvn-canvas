// Build-time prerender for VORVN.
// Reads dist/index.html (Vite output) and produces a real static HTML file per
// localized route, with title, description, canonical, hreflang, OG, Twitter,
// and JSON-LD baked into <head> BEFORE JavaScript runs.
//
// React still hydrates normally on top, UX unchanged. Crawlers see correct
// language metadata on the first byte of every URL.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const baseHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(baseHtmlPath)) {
  console.error('[prerender] dist/index.html not found, run `vite build` first.');
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

const H1_COPY = {
  home: {
    en: 'VORVN — Autonomous IP & Brand Designers in Hong Kong and Bali',
    fr: 'VORVN — Concepteurs autonomes de marques et PI à Hong Kong et Bali',
    es: 'VORVN — Diseñadores autónomos de marcas y PI en Hong Kong y Bali',
    zh: 'VORVN — 香港与巴厘岛的自主知识产权与品牌设计公司',
    id: 'VORVN — Perancang IP & Merek Independen di Hong Kong dan Bali',
    ar: 'VORVN — مصمّمو علامات وملكية فكرية مستقلون في هونغ كونغ وبالي',
  },
  contact: {
    en: 'Contact VORVN — Investors, Brand Collaborations & Press',
    fr: 'Contact VORVN — Investisseurs, collaborations de marque et presse',
    es: 'Contacto VORVN — Inversores, colaboraciones de marca y prensa',
    zh: '联系 VORVN — 投资人、品牌合作与媒体',
    id: 'Kontak VORVN — Investor, Kolaborasi Merek & Pers',
    ar: 'اتصل بـ VORVN — مستثمرون، تعاونات علامات وصحافة',
  },
  legal: {
    privacy: 'VORVN Privacy Policy',
    notice: 'VORVN Legal Notice',
  },
};

function injectBodyH1(html, h1Text) {
  const h1 = `<h1 class="sr-only">${escapeHtml(h1Text)}</h1>`;
  // Insert immediately after opening <body ...> tag, before #root
  return html.replace(/(<body[^>]*>)/i, `$1${h1}`);
}

function injectPrerenderedContent(html, innerHtml) {
  // Sits outside #root with the `hidden` attribute. Crawlers (Bing/Google/AI
  // bots) parse and index every word. Real users never see it because React
  // mounts inside #root immediately, and `hidden` removes it from the visual
  // tree even before hydration. This is the SEO fallback content fix.
  const block = `<div id="prerendered-content" hidden aria-hidden="true">${innerHtml}</div>`;
  return html.replace(/(<div id="root">)/i, `${block}$1`);
}

const localeCache = {};
function loadLocale(lang) {
  if (localeCache[lang]) return localeCache[lang];
  const fp = path.resolve(__dirname, '..', 'src', 'i18n', 'locales', `${lang}.json`);
  localeCache[lang] = JSON.parse(fs.readFileSync(fp, 'utf8'));
  return localeCache[lang];
}

function pTag(s) {
  if (!s) return '';
  return `<p>${escapeHtml(String(s).replace(/\s+/g, ' ').trim())}</p>`;
}
function hTag(level, s) {
  return `<h${level}>${escapeHtml(String(s).replace(/\s+/g, ' ').trim())}</h${level}>`;
}

function buildHomeContent(lang) {
  const j = loadLocale(lang);
  const parts = [];

  parts.push(hTag(2, j.hero.headline));
  parts.push(pTag(`${j.hero.taglinePre} ${Object.values(j.hero.words).join(' / ')} ${j.hero.taglinePost}`));
  parts.push(pTag(j.hero.basedIn));

  parts.push(hTag(2, `${j.founder.label} — ${j.founder.name}`));
  parts.push(pTag(j.founder.quote));
  parts.push(pTag(`${j.founder.title}. ${j.founder.caption}`));

  parts.push(hTag(2, j.entity.label));
  parts.push(pTag(j.entity.statement));
  parts.push(pTag(j.entity.detail));

  parts.push(hTag(2, j.presence.label));
  for (const loc of j.presence.locations) {
    const line = [loc.region, loc.city, loc.entity, loc.address].filter(Boolean).join(' — ');
    parts.push(pTag(line));
  }

  parts.push(hTag(2, j.portfolio.label));
  parts.push(pTag(j.portfolio.intro));
  for (const b of j.portfolio.brands) {
    parts.push(hTag(3, b.name));
    parts.push(pTag(`${b.sector} · ${b.statusLabel}`));
    parts.push(pTag(b.desc));
  }

  parts.push(hTag(2, j.operate.label));
  parts.push(pTag(j.operate.kicker));
  for (const k of ['p1', 'p2', 'p3', 'p4', 'p5']) {
    const op = j.operate[k];
    if (!op) continue;
    const head = [op.role, op.name, op.title, op.tagline].filter(Boolean).join(' — ');
    parts.push(hTag(3, head));
    parts.push(pTag(op.desc));
  }
  if (j.operate.logic) {
    parts.push(pTag((j.operate.logic.lines || []).join(' ')));
    parts.push(pTag(j.operate.logic.outcome));
  }

  parts.push(hTag(2, j.investors.label));
  parts.push(pTag(j.investors.headline));
  parts.push(pTag(j.investors.body));
  parts.push(hTag(3, `${j.investors.incubatorBadge} — ${j.investors.incubatorTitle}`));
  parts.push(pTag(`${j.investors.incubatorLocation}. ${j.investors.incubatorDesc}`));
  parts.push(hTag(3, `${j.investors.ventureBadge} — ${j.investors.ventureTitle}`));
  parts.push(pTag(`${j.investors.ventureLocation}. ${j.investors.ventureDesc}`));
  parts.push(pTag(`${j.investors.cta}. ${j.investors.ctaSub}`));

  const closing = String(j.closing.statement || '')
    .replace('{chaos}', j.closing.chaos || '')
    .replace('{lifeless}', j.closing.lifeless || '');
  parts.push(pTag(closing));
  parts.push(pTag(j.closing.sub));

  parts.push(pTag(String(j.footer.legal || '').replace('{{year}}', new Date().getFullYear())));

  return parts.join('');
}

function buildContactContent(lang) {
  const j = loadLocale(lang);
  const c = j.contact;
  const parts = [];
  parts.push(hTag(2, c.headline));
  parts.push(pTag(c.body));
  parts.push(hTag(3, c.offices));
  for (const loc of j.presence.locations) {
    const line = [loc.region, loc.city, loc.entity, loc.address].filter(Boolean).join(' — ');
    parts.push(pTag(line));
  }
  parts.push(hTag(3, c.formHeadline));
  const topics = Object.values(c.topics || {}).join(', ');
  if (topics) parts.push(pTag(topics));
  parts.push(pTag(c.privacy));
  return parts.join('');
}

function buildLegalContent(slug) {
  const file = slug === 'privacy' ? 'PrivacyPolicy.tsx' : 'LegalNotice.tsx';
  const fp = path.resolve(__dirname, '..', 'src', 'pages', 'legal', file);
  const src = fs.readFileSync(fp, 'utf8');
  const m = src.match(/<LegalLayout[\s\S]*?>([\s\S]*?)<\/LegalLayout>/);
  if (!m) return '';
  let body = m[1];
  // Strip JS expressions like {' '} or {something}
  body = body.replace(/\{[^{}]*\}/g, ' ');
  const segments = [];
  const re = /<(h2|h3|p|li|address)[^>]*>([\s\S]*?)<\/\1>/gi;
  let mm;
  while ((mm = re.exec(body)) !== null) {
    const rawTag = mm[1].toLowerCase();
    const tag = (rawTag === 'li' || rawTag === 'address') ? 'p' : rawTag;
    const text = mm[2]
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) segments.push(`<${tag}>${escapeHtml(text)}</${tag}>`);
  }
  return segments.join('');
}

const SEO = {
  home: {
    en: {
      title: 'VORVN: Autonomous IP & Brand Designers | Hong Kong · Bali',
      desc: 'VORVN is an independent IP & brand design house. We design, build and own digital-first brands from Hong Kong and our Bali incubator studio.',
    },
    fr: {
      title: 'VORVN: Concepteurs indépendants de marques & PI | Hong Kong · Bali',
      desc: "VORVN est un studio indépendant de conception de propriété intellectuelle et de marques. Nous concevons, construisons et possédons des marques digitales depuis Hong Kong et notre studio incubateur de Bali.",
    },
    es: {
      title: 'VORVN: Diseñadores autónomos de marcas y PI | Hong Kong · Bali',
      desc: 'VORVN es una casa de diseño independiente de propiedad intelectual y marcas. Diseñamos, construimos y poseemos marcas digitales desde Hong Kong y nuestro estudio incubadora en Bali.',
    },
    zh: {
      title: 'VORVN: 自主知识产权与品牌设计公司 | 香港 · 巴厘岛',
      desc: 'VORVN 是独立的知识产权与品牌设计公司。我们在香港与巴厘岛孵化工作室设计、构建并拥有数字优先品牌。',
    },
    id: {
      title: 'VORVN: Perancang IP & Merek Independen | Hong Kong · Bali',
      desc: 'VORVN adalah studio perancang IP & merek yang independen. Kami merancang, membangun, dan memiliki merek digital dari Hong Kong dan studio inkubator kami di Bali.',
    },
    ar: {
      title: 'VORVN: مصمّمو علامات وملكية فكرية مستقلون | هونغ كونغ · بالي',
      desc: 'VORVN استوديو مستقل لتصميم العلامات التجارية والملكية الفكرية. نصمم ونبني ونمتلك علامات رقمية من هونغ كونغ ومن استوديو الحاضنة لدينا في بالي.',
    },
  },
  contact: {
    en: {
      title: 'Contact VORVN: Investors, Brand Collaborations & Press',
      desc: 'Talk to VORVN directly. Investor introductions, brand collaborations, press, and careers, Hong Kong & Bali. We reply within 48 hours.',
    },
    fr: {
      title: 'Contact VORVN: Investisseurs, Collaborations & Presse',
      desc: "Parlez directement à VORVN. Introductions investisseurs, collaborations de marque, presse, carrières, Hong Kong & Bali. Réponse sous 48h.",
    },
    es: {
      title: 'Contacto VORVN: Inversores, Colaboraciones y Prensa',
      desc: 'Habla directamente con VORVN. Inversores, colaboraciones de marca, prensa y carreras, Hong Kong y Bali. Respondemos en 48 horas.',
    },
    zh: {
      title: '联系 VORVN: 投资人、品牌合作、媒体与招聘',
      desc: '直接联系 VORVN。投资人介绍、品牌合作、媒体与招聘,, 香港与巴厘岛。我们在 48 小时内回复。',
    },
    id: {
      title: 'Kontak VORVN: Investor, Kolaborasi Merek & Pers',
      desc: 'Hubungi VORVN langsung. Pengantar investor, kolaborasi merek, pers, dan karier, Hong Kong & Bali. Kami membalas dalam 48 jam.',
    },
    ar: {
      title: 'اتصل بـ VORVN: مستثمرون، تعاونات وعلامات وصحافة',
      desc: 'تحدث مع VORVN مباشرة. مقدمات للمستثمرين، تعاونات العلامات، الصحافة والوظائف, هونغ كونغ وبالي. نرد خلال 48 ساعة.',
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
    en: 'Independent IP & brand design house designing, building and owning digital-first brands from Hong Kong and our Bali incubator studio.',
    fr: "Studio indépendant de conception de propriété intellectuelle et de marques, conception, construction et détention de marques digitales depuis Hong Kong et notre studio incubateur de Bali.",
    es: 'Casa de diseño independiente de propiedad intelectual y marcas, diseño, construcción y propiedad de marcas digitales desde Hong Kong y nuestro estudio incubadora en Bali.',
    zh: '独立的知识产权与品牌设计公司,在香港与巴厘岛孵化工作室设计、构建并拥有数字优先品牌。',
    id: 'Studio perancang IP & merek independen yang merancang, membangun, dan memiliki merek digital dari Hong Kong dan studio inkubator kami di Bali.',
    ar: 'استوديو مستقل لتصميم العلامات التجارية والملكية الفكرية، يصمم ويبني ويمتلك علامات رقمية من هونغ كونغ ومن استوديو الحاضنة لدينا في بالي.',
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

function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Mehdi Ayache Berberos',
    alternateName: ['المهدي عياش بربروس', 'المهدي عياش', 'Mehdi Ayache'],
    givenName: 'Mehdi',
    familyName: 'Ayache Berberos',
    jobTitle: 'Founder & CEO',
    nationality: { '@type': 'Country', name: 'Morocco' },
    image: `${BASE_URL}/mehdi-ayache-berberos-moroccan-designer-founder-vorvn.webp`,
    url: 'https://mehdiayache.com',
    worksFor: { '@type': 'Organization', name: 'VORVN', url: BASE_URL },
    description:
      'Moroccan designer and entrepreneur, Founder of VORVN. Based between Bali and Asia.',
    sameAs: [
      'https://www.linkedin.com/in/mehdiayache/',
      'https://mehdiayache.com',
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
  ogType = 'website',
  ogImage,
  ogImageAlt,
  articleMeta,
}) {
  const robots = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large';
  const image = ogImage || `${BASE_URL}/og-image.jpg`;
  const imageAlt = ogImageAlt || title;
  const lines = [
    `    <title>${escapeHtml(title)}</title>`,
    `    <meta name="description" content="${escapeHtml(desc)}" />`,
    `    <meta name="robots" content="${robots}" />`,
    `    <link rel="canonical" href="${canonical}" />`,
    hreflangBlock,
    `    <meta property="og:title" content="${escapeHtml(title)}" />`,
    `    <meta property="og:description" content="${escapeHtml(desc)}" />`,
    `    <meta property="og:type" content="${ogType}" />`,
    `    <meta property="og:url" content="${canonical}" />`,
    `    <meta property="og:site_name" content="VORVN" />`,
    `    <meta property="og:locale" content="${ogLocale}" />`,
    `    <meta property="og:image" content="${image}" />`,
    `    <meta property="og:image:width" content="1200" />`,
    `    <meta property="og:image:height" content="630" />`,
    `    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `    <meta name="twitter:description" content="${escapeHtml(desc)}" />`,
    `    <meta name="twitter:image" content="${image}" />`,
  ];
  if (articleMeta) {
    lines.push(
      `    <meta property="article:published_time" content="${articleMeta.publishedTime}" />`,
      `    <meta property="article:modified_time" content="${articleMeta.modifiedTime}" />`,
      `    <meta property="article:author" content="${escapeHtml(articleMeta.authorName)}" />`,
      `    <meta property="article:section" content="${escapeHtml(articleMeta.section)}" />`,
    );
  }
  for (const obj of jsonLdScripts) {
    lines.push(
      `    <script type="application/ld+json" data-prerender>${escapeJsonForScript(obj)}</script>`,
    );
  }
  return lines.join('\n');
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
    jsonLdScripts: [organizationJsonLd(l.code), websiteJsonLd(l.code), personJsonLd()],
  });
  let html = injectInto(baseHtml, { lang: l.code, dir: l.dir, headBlock });
  html = injectBodyH1(html, H1_COPY.home[l.code]);
  html = injectPrerenderedContent(html, buildHomeContent(l.code));
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
  let html = injectInto(baseHtml, { lang: l.code, dir: l.dir, headBlock });
  html = injectBodyH1(html, H1_COPY.contact[l.code]);
  html = injectPrerenderedContent(html, buildContactContent(l.code));
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
  let html = injectInto(baseHtml, { lang: 'en', dir: 'ltr', headBlock });
  html = injectBodyH1(html, H1_COPY.legal[slug]);
  html = injectPrerenderedContent(html, buildLegalContent(slug));
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
    jsonLdScripts: [organizationJsonLd('en'), websiteJsonLd('en'), personJsonLd()],
  });
  let html = injectInto(baseHtml, { lang: 'en', dir: 'ltr', headBlock });
  html = injectBodyH1(html, H1_COPY.home.en);
  html = injectPrerenderedContent(html, buildHomeContent('en'));
  fs.writeFileSync(baseHtmlPath, html, 'utf8');
}

// ============ NEWSROOM ============
const newsroomDir = path.resolve(__dirname, '..', 'src', 'content', 'newsroom');
const newsroomArticles = [];
if (fs.existsSync(newsroomDir)) {
  for (const f of fs.readdirSync(newsroomDir).filter((x) => x.endsWith('.json'))) {
    try {
      newsroomArticles.push(JSON.parse(fs.readFileSync(path.join(newsroomDir, f), 'utf8')));
    } catch (e) {
      console.error('[prerender] newsroom parse fail:', f, e.message);
    }
  }
  newsroomArticles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

const NEWSROOM_SEO = {
  en: { title: 'VORVN Newsroom: Essays, News & Collaborations', desc: 'Notes, essays and announcements from VORVN and its brands. Operator perspective, no marketing fluff. Hong Kong & Bali.', h1: 'VORVN Newsroom — Essays, News & Collaborations', label: 'Newsroom' },
  fr: { title: 'Salle de Presse VORVN: Essais, Actualités & Collaborations', desc: 'Notes, essais et annonces de VORVN et de ses marques. Vision opérateur, sans marketing. Hong Kong & Bali.', h1: 'Salle de Presse VORVN — Essais, actualités et collaborations', label: 'Salle de presse' },
  es: { title: 'Sala de Prensa VORVN: Ensayos, Noticias y Colaboraciones', desc: 'Notas, ensayos y anuncios de VORVN y sus marcas. Perspectiva de operador, sin marketing. Hong Kong y Bali.', h1: 'Sala de Prensa VORVN — Ensayos, noticias y colaboraciones', label: 'Sala de prensa' },
  zh: { title: 'VORVN 新闻中心: 随笔、新闻与合作', desc: '来自 VORVN 及旗下品牌的随笔、文章与公告。运营者视角,不做营销修饰。香港与巴厘岛。', h1: 'VORVN 新闻中心 — 随笔、新闻与合作', label: '新闻中心' },
  id: { title: 'Newsroom VORVN: Esai, Berita & Kolaborasi', desc: 'Catatan, esai, dan pengumuman dari VORVN dan merek-mereknya. Perspektif operator, tanpa basa-basi pemasaran. Hong Kong & Bali.', h1: 'Newsroom VORVN — Esai, berita & kolaborasi', label: 'Newsroom' },
  ar: { title: 'غرفة أخبار VORVN: مقالات، أخبار، وتعاونات', desc: 'ملاحظات ومقالات وإعلانات من VORVN وعلاماتها. منظور المُشغِّل، دون تسويق. هونغ كونغ وبالي.', h1: 'غرفة أخبار VORVN — مقالات، أخبار وتعاونات', label: 'غرفة الأخبار' },
};

function stripInlineLinks(s) {
  return String(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
}

function blockToHtml(b) {
  if (!b) return '';
  if (b.type === 'list') {
    const items = (b.items || []).map((it) => `<li>${escapeHtml(stripInlineLinks(it))}</li>`).join('');
    return `<ul>${items}</ul>`;
  }
  if (b.type === 'image') {
    const cap = b.caption ? `<figcaption>${escapeHtml(stripInlineLinks(b.caption))}</figcaption>` : '';
    return `<figure><img src="${escapeHtml(b.src)}" alt="${escapeHtml(b.alt || '')}" loading="lazy" />${cap}</figure>`;
  }
  if (b.type === 'quote') {
    const cite = b.attribution ? `<cite>${escapeHtml(b.attribution)}</cite>` : '';
    return `<blockquote>${escapeHtml(stripInlineLinks(b.text || ''))}${cite}</blockquote>`;
  }
  return `<${b.type}>${escapeHtml(stripInlineLinks(b.text || ''))}</${b.type}>`;
}

const AUTHOR_FALLBACK = { name: 'Mehdi Ayache', title: 'CEO & Founder' };
function resolveAuthor(a) {
  return {
    name: a?.author?.name || AUTHOR_FALLBACK.name,
    title: a?.author?.title || AUTHOR_FALLBACK.title,
  };
}

function buildNewsroomIndexContent(lang) {
  const seo = NEWSROOM_SEO[lang];
  const parts = [];
  parts.push(hTag(2, seo.h1));
  parts.push(pTag(seo.desc));
  for (const a of newsroomArticles) {
    const tr = a.translations[lang] || a.translations.en;
    parts.push(hTag(3, tr.title));
    parts.push(pTag(`${a.date} — ${tr.excerpt}`));
  }
  return parts.join('');
}

function buildArticleContent(article, lang) {
  const tr = article.translations[lang] || article.translations.en;
  const author = resolveAuthor(article);
  const parts = [];
  parts.push(hTag(1, tr.title));
  parts.push(pTag(`${article.date} — ${author.name} (${author.title})`));
  parts.push(pTag(tr.excerpt));
  if (article.cover) {
    parts.push(`<figure><img src="${escapeHtml(article.cover)}" alt="${escapeHtml(tr.coverAlt || tr.title)}" /></figure>`);
  }
  for (const b of tr.body) parts.push(blockToHtml(b));
  return parts.join('');
}

function articleJsonLd(article, lang) {
  const tr = article.translations[lang] || article.translations.en;
  const author = resolveAuthor(article);
  const image = article.cover ? [`${BASE_URL}${article.cover}`] : [`${BASE_URL}/og-image.jpg`];
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: tr.title,
    description: tr.excerpt,
    datePublished: article.date,
    dateModified: article.updated || article.date,
    inLanguage: lang,
    image,
    articleSection: article.type,
    author: { '@type': 'Person', name: author.name, jobTitle: author.title },
    publisher: {
      '@type': 'Organization',
      name: 'VORVN',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/apple-touch-icon.png` },
    },
    mainEntityOfPage: `${BASE_URL}/${lang}/newsroom/${article.slug}`,
  };
}

function collectionPageJsonLd(lang, seo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seo.title,
    description: seo.desc,
    url: `${BASE_URL}/${lang}/newsroom`,
    inLanguage: lang,
    isPartOf: { '@type': 'WebSite', name: 'VORVN', url: BASE_URL },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: newsroomArticles.map((a, i) => {
        const tr = a.translations[lang] || a.translations.en;
        return {
          '@type': 'ListItem',
          position: i + 1,
          url: `${BASE_URL}/${lang}/newsroom/${a.slug}`,
          name: tr.title,
        };
      }),
    },
  };
}


// Newsroom index per language
for (const l of LANGUAGES) {
  const seo = NEWSROOM_SEO[l.code];
  const canonical = `${BASE_URL}/${l.code}/newsroom`;
  const headBlock = buildHeadBlock({
    lang: l.code,
    dir: l.dir,
    ogLocale: l.ogLocale,
    title: seo.title,
    desc: seo.desc,
    canonical,
    hreflangBlock: buildHreflangBlock('/newsroom'),
    jsonLdScripts: [breadcrumbJsonLd(l.code, '/newsroom', seo.label)],
  });
  let html = injectInto(baseHtml, { lang: l.code, dir: l.dir, headBlock });
  html = injectBodyH1(html, seo.h1);
  html = injectPrerenderedContent(html, buildNewsroomIndexContent(l.code));
  writeFile(`${l.code}/newsroom/index.html`, html);
  count++;
}

// Each article × each language
for (const article of newsroomArticles) {
  for (const l of LANGUAGES) {
    const tr = article.translations[l.code] || article.translations.en;
    const canonical = `${BASE_URL}/${l.code}/newsroom/${article.slug}`;
    const title = `${tr.title} | VORVN`;
    const headBlock = buildHeadBlock({
      lang: l.code,
      dir: l.dir,
      ogLocale: l.ogLocale,
      title,
      desc: tr.excerpt,
      canonical,
      hreflangBlock: buildHreflangBlock(`/newsroom/${article.slug}`),
      jsonLdScripts: [
        articleJsonLd(article, l.code),
        breadcrumbJsonLd(l.code, `/newsroom/${article.slug}`, tr.title),
      ],
    });
    let html = injectInto(baseHtml, { lang: l.code, dir: l.dir, headBlock });
    html = injectBodyH1(html, tr.title);
    html = injectPrerenderedContent(html, buildArticleContent(article, l.code));
    writeFile(`${l.code}/newsroom/${article.slug}/index.html`, html);
    count++;
  }
}

// ============ SITEMAP ============
const sitemapPath = path.join(distDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sm = fs.readFileSync(sitemapPath, 'utf8');
  sm = sm.replace(/<lastmod>[\d-]+<\/lastmod>/g, `<lastmod>${NOW}</lastmod>`);

  // Append Newsroom URLs if not already present
  if (!sm.includes('/newsroom')) {
    const hreflangLinks = (suffix) =>
      LANGUAGES.map(
        (l) =>
          `      <xhtml:link rel="alternate" hreflang="${l.code}" href="${BASE_URL}/${l.code}${suffix}" />`,
      ).join('\n') +
      `\n      <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/en${suffix}" />`;

    const blocks = [];
    blocks.push('\n  <!-- ============ NEWSROOM ============ -->');
    for (const l of LANGUAGES) {
      blocks.push(
        `  <url>
    <loc>${BASE_URL}/${l.code}/newsroom</loc>
    <lastmod>${NOW}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
${hreflangLinks('/newsroom')}
  </url>`,
      );
    }
    for (const a of newsroomArticles) {
      for (const l of LANGUAGES) {
        blocks.push(
          `  <url>
    <loc>${BASE_URL}/${l.code}/newsroom/${a.slug}</loc>
    <lastmod>${a.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
${hreflangLinks(`/newsroom/${a.slug}`)}
  </url>`,
        );
      }
    }
    sm = sm.replace('</urlset>', blocks.join('\n') + '\n</urlset>');
  }

  fs.writeFileSync(sitemapPath, sm, 'utf8');
}

console.log(`[prerender] Wrote ${count} localized HTML files + refreshed root + sitemap. Newsroom: ${newsroomArticles.length} article(s).`);

