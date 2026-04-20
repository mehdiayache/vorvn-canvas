import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/i18n';
import SeoHead from '@/components/SeoHead';

const SUPPORTED = LANGUAGES.map((l) => l.code);

export default function NotFound() {
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation();

  const activeLang = lang && SUPPORTED.includes(lang) ? lang : 'en';
  const homeHref = `/${activeLang}`;

  useEffect(() => {
    console.error('404 — non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SeoHead />
      <main className="relative min-h-screen flex flex-col bg-background text-foreground">
        {/* Top rule + meta */}
        <div className="border-b border-rule" style={{ padding: '28px var(--gutter)' }}>
          <div className="flex items-center justify-between">
            <Link
              to={homeHref}
              className="font-brand text-[14px] tracking-[0.04em] hover:text-mid transition-colors"
              aria-label="VORVN"
            >
              VORVN
            </Link>
            <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-mid flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block w-[6px] h-[6px] rounded-full border border-mid"
              />
              {t('notFound.signal')}
            </div>
          </div>
        </div>

        {/* Hero */}
        <section
          className="flex-1 flex flex-col justify-center"
          style={{ padding: 'clamp(60px, 12vh, 140px) var(--gutter)' }}
        >
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-mid mb-6">
            {t('notFound.label')}
          </div>

          <h1
            className="font-brand leading-[0.85] tracking-[-0.02em] text-foreground"
            style={{ fontSize: 'clamp(120px, 28vw, 360px)' }}
          >
            404
          </h1>

          <p
            className="mt-8 max-w-[640px] text-foreground leading-[1.25]"
            style={{ fontSize: 'clamp(20px, 2.4vw, 32px)' }}
          >
            {t('notFound.headline')}
          </p>

          <p className="mt-6 max-w-[560px] text-mid leading-[1.6] text-[15px]">
            {t('notFound.body')}
          </p>

          {/* Attempted path */}
          <div className="mt-10 font-mono text-[10px] tracking-[0.14em] uppercase text-mid flex flex-wrap items-center gap-x-3 gap-y-2">
            <span>{t('notFound.attempted')}</span>
            <span className="text-foreground break-all normal-case tracking-[0.04em]">
              {location.pathname}
            </span>
          </div>

          {/* Return link */}
          <div className="mt-12">
            <Link
              to={homeHref}
              className="inline-flex items-center gap-3 text-foreground hover:text-mid transition-colors group"
            >
              <span aria-hidden className="text-[18px] transition-transform group-hover:-translate-x-1">←</span>
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase">
                {t('notFound.cta')}
              </span>
            </Link>
          </div>
        </section>

        {/* Bottom rule + footer note */}
        <div
          className="border-t border-rule font-mono text-[9px] tracking-[0.18em] uppercase text-mid flex flex-wrap justify-between gap-3"
          style={{ padding: '24px var(--gutter)' }}
        >
          <span>{t('notFound.footerLeft')}</span>
          <span>{t('notFound.footerRight')}</span>
        </div>
      </main>
    </>
  );
}
