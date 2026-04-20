import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { LANGUAGES, RTL_LANGUAGES } from '@/i18n';

const BASE_URL = 'https://www.vorvn.com';

type PageKey = 'home' | 'contact' | 'notFound';

const SEO: Record<PageKey, Record<string, { title: string; desc: string }>> = {
  home: {
    en: {
      title: 'VORVN — Autonomous IP & Brand Holdings | Hong Kong · Bali',
      desc: 'VORVN is an independent IP & brand holdings company. We design, build & own digital-first brands across Hong Kong, Bali, and Morocco.',
    },
    fr: {
      title: 'VORVN — Holding indépendant de marques & PI | Hong Kong · Bali',
      desc: "VORVN est un holding indépendant de propriété intellectuelle et de marques. Nous concevons, construisons et possédons des marques digitales — Hong Kong, Bali, Maroc.",
    },
    es: {
      title: 'VORVN — Holding autónomo de marcas y PI | Hong Kong · Bali',
      desc: 'VORVN es un holding independiente de propiedad intelectual y marcas. Diseñamos, construimos y poseemos marcas digitales — Hong Kong, Bali, Marruecos.',
    },
    zh: {
      title: 'VORVN — 自主知识产权与品牌控股公司 | 香港 · 巴厘岛 · 摩洛哥',
      desc: 'VORVN 是独立的知识产权与品牌控股公司。我们设计、构建并拥有数字优先品牌 —— 香港、巴厘岛、摩洛哥。',
    },
    id: {
      title: 'VORVN — Holding IP & Merek Independen | Hong Kong · Bali · Maroko',
      desc: 'VORVN adalah perusahaan holding IP & merek yang independen. Kami merancang, membangun, dan memiliki merek digital — Hong Kong, Bali, Maroko.',
    },
    ar: {
      title: 'VORVN — حيازات مستقلة للعلامات والملكية الفكرية | هونغ كونغ · بالي',
      desc: 'VORVN شركة حيازات مستقلة للعلامات التجارية والملكية الفكرية. نصمم ونبني ونمتلك علامات رقمية — هونغ كونغ، بالي، المغرب.',
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
  notFound: {
    en: { title: '404 — Page Not Found | VORVN', desc: 'Page not found.' },
    fr: { title: '404 — Page introuvable | VORVN', desc: 'Page introuvable.' },
    es: { title: '404 — Página no encontrada | VORVN', desc: 'Página no encontrada.' },
    zh: { title: '404 — 页面未找到 | VORVN', desc: '页面未找到。' },
    id: { title: '404 — Halaman tidak ditemukan | VORVN', desc: 'Halaman tidak ditemukan.' },
    ar: { title: '404 — الصفحة غير موجودة | VORVN', desc: 'الصفحة غير موجودة.' },
  },
};

interface SeoHeadProps {
  page?: PageKey;
  /** Path within the language root, e.g. "/contact". Defaults to derived from current location. */
  pathSuffix?: string;
  /** If true, emits noindex (used for 404). */
  noindex?: boolean;
}

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, attrs: Record<string, string> = {}) {
  const keyParts = [`link[rel="${rel}"]`];
  for (const [k, v] of Object.entries(attrs)) keyParts.push(`[${k}="${v}"]`);
  const selector = keyParts.join('');
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.head.appendChild(el);
  }
  el.href = href;
}

export default function SeoHead({ page = 'home', pathSuffix, noindex = false }: SeoHeadProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const location = useLocation();

  // Derive path suffix from URL if not provided (everything after /:lang)
  const derivedSuffix = (() => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return '';
    return '/' + parts.slice(1).join('/');
  })();
  const suffix = pathSuffix ?? derivedSuffix;

  useEffect(() => {
    const seo = SEO[page]?.[lang] || SEO[page]?.en;
    if (!seo) return;

    document.title = seo.title;
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';

    const url = `${BASE_URL}/${lang}${suffix}`;

    // Standard meta
    upsertMeta('meta[name="description"]', 'name', 'description', seo.desc);
    upsertMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
    );

    // Open Graph
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', seo.desc);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url);
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'VORVN');
    upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', toOgLocale(lang));
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', `${BASE_URL}/og-image.jpg`);
    upsertMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    upsertMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    upsertMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', seo.title);

    // Twitter
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.desc);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', `${BASE_URL}/og-image.jpg`);

    // Canonical
    upsertLink('canonical', url);

    // hreflang alternates — clean & re-emit per render
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    LANGUAGES.forEach((l) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = l.code;
      link.href = `${BASE_URL}/${l.code}${suffix}`;
      document.head.appendChild(link);
    });
    const xdef = document.createElement('link');
    xdef.rel = 'alternate';
    xdef.hreflang = 'x-default';
    xdef.href = `${BASE_URL}/en${suffix}`;
    document.head.appendChild(xdef);

    // JSON-LD — Organization (home only)
    document.head.querySelectorAll('script[data-seo-jsonld]').forEach((el) => el.remove());
    if (page === 'home') {
      const org = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'VORVN',
        legalName: 'VORVN LIMITED',
        url: BASE_URL,
        logo: `${BASE_URL}/apple-touch-icon.png`,
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
            streetAddress: 'Jl. Seroja No.28, Tonja, Kec. Denpasar Utara',
            addressLocality: 'Denpasar',
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
          {
            '@type': 'ContactPoint',
            email: 'contact@vorvn.com',
            contactType: 'customer service',
          },
        ],
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'org');
      script.text = JSON.stringify(org);
      document.head.appendChild(script);
    }

    if (page === 'contact') {
      const contactPage = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        url,
        name: SEO.contact[lang]?.title || SEO.contact.en.title,
        inLanguage: lang,
        isPartOf: { '@type': 'WebSite', name: 'VORVN', url: BASE_URL },
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'contact');
      script.text = JSON.stringify(contactPage);
      document.head.appendChild(script);
    }

    return () => {
      document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
      document.head.querySelectorAll('script[data-seo-jsonld]').forEach((el) => el.remove());
    };
  }, [lang, page, suffix, noindex]);

  return null;
}

function toOgLocale(lang: string): string {
  switch (lang) {
    case 'en':
      return 'en_US';
    case 'fr':
      return 'fr_FR';
    case 'es':
      return 'es_ES';
    case 'zh':
      return 'zh_CN';
    case 'id':
      return 'id_ID';
    case 'ar':
      return 'ar_AR';
    default:
      return 'en_US';
  }
}
