import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/i18n';

const BASE_URL = 'https://www.vorvn.com';

const SEO_TITLES: Record<string, string> = {
  en: 'VORVN — Autonomous IP & Brand Holdings',
  fr: 'VORVN — Holdings Autonome de Marques & PI',
  es: 'VORVN — Holdings Autónomo de Marcas y PI',
  zh: 'VORVN — 自主知识产权与品牌控股',
  id: 'VORVN — Kepemilikan IP & Merek Otonom',
  ar: 'VORVN — حيازات العلامات التجارية والملكية الفكرية المستقلة',
};

const SEO_DESC: Record<string, string> = {
  en: 'We design, build & own digital-first brands.',
  fr: 'Nous concevons, construisons et possédons des marques numériques.',
  es: 'Diseñamos, construimos y poseemos marcas digitales.',
  zh: '我们设计、构建和拥有数字优先品牌。',
  id: 'Kami mendesain, membangun & memiliki merek digital.',
  ar: 'نصمم ونبني ونمتلك علامات تجارية رقمية.',
};

export default function SeoHead() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    document.title = SEO_TITLES[lang] || SEO_TITLES.en;

    // Update meta description
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (meta) meta.content = SEO_DESC[lang] || SEO_DESC.en;

    // Update OG tags
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (ogTitle) ogTitle.content = SEO_TITLES[lang] || SEO_TITLES.en;
    let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    if (ogDesc) ogDesc.content = SEO_DESC[lang] || SEO_DESC.en;

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) canonical.href = `${BASE_URL}/${lang}`;

    // Manage hreflang links
    document.querySelectorAll('link[hreflang]').forEach((el) => el.remove());
    LANGUAGES.forEach((l) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = l.code;
      link.href = `${BASE_URL}/${l.code}`;
      document.head.appendChild(link);
    });
    // x-default
    const xdef = document.createElement('link');
    xdef.rel = 'alternate';
    xdef.hreflang = 'x-default';
    xdef.href = `${BASE_URL}/en`;
    document.head.appendChild(xdef);

    return () => {
      document.querySelectorAll('link[hreflang]').forEach((el) => el.remove());
    };
  }, [lang]);

  return null;
}
