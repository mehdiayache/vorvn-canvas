import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function VorvnInvestorsSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  return (
    <section
      id="investors"
      className="border-t border-rule"
      style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-x-20 gap-y-12">
        {/* Left: label */}
        <div className="reveal">
          <h2 className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground m-0">
            {t('investors.label')}
          </h2>
        </div>

        {/* Right: content */}
        <div>
          {/* Headline */}
          <h3
            className="font-sans font-medium text-foreground reveal d1 m-0"
            style={{ fontSize: 'clamp(22px, 2.8vw, 44px)', lineHeight: 1.25, letterSpacing: '-0.01em' }}
          >
            {t('investors.headline').split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h3>

          {/* Body */}
          <p
            className="mt-8 font-sans font-normal text-foreground reveal d2 max-w-[680px]"
            style={{ fontSize: 'clamp(15px, 1.15vw, 18px)', lineHeight: 1.7 }}
          >
            {t('investors.body')}
          </p>

          {/* Schema — two paths visual */}
          <div className="mt-16 reveal d3">
            <div className="font-sans text-[13px] font-medium uppercase tracking-[0.12em] text-foreground mb-6">
              {t('investors.schemaTitle')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ───────── Incubator (light card) ───────── */}
              <article className="rounded-[16px] border border-rule bg-background p-8 flex flex-col">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/70 mb-6">
                  {t('investors.incubatorBadge')}
                </div>
                <h4 className="font-sans text-[24px] md:text-[28px] font-semibold text-foreground tracking-[-0.01em] mb-2 leading-[1.15]">
                  {t('investors.incubatorTitle')}
                </h4>
                <div className="font-sans text-[13px] text-foreground/70 mb-6">
                  {t('investors.incubatorLocation')}
                </div>
                <p
                  className="font-sans text-[15px] text-foreground mb-7"
                  style={{ lineHeight: 1.65 }}
                >
                  {t('investors.incubatorDesc')}
                </p>

                {/* Visual flow — outlined pills */}
                <div className="flex items-center gap-2 flex-wrap mb-8">
                  <span className="font-sans text-[12px] text-foreground border border-foreground rounded-full px-3 py-1">Design</span>
                  <span className="text-foreground/60 text-[12px]">→</span>
                  <span className="font-sans text-[12px] text-foreground border border-foreground rounded-full px-3 py-1">Build</span>
                  <span className="text-foreground/60 text-[12px]">→</span>
                  <span className="font-sans text-[12px] text-foreground border border-foreground rounded-full px-3 py-1">Validate</span>
                  <span className="text-foreground/60 text-[12px]">→</span>
                  <span className="font-sans text-[12px] text-foreground border border-foreground rounded-full px-3 py-1">Market</span>
                </div>

                <div className="mt-auto pt-2">
                  <Link
                    to={`/${lang}/contact`}
                    className="arrow-link text-[15px] md:text-[16px]"
                  >
                    {t('investors.incubatorCta')}
                  </Link>
                </div>
              </article>

              {/* ───────── Venture (inverted dark card) ───────── */}
              <article className="rounded-[16px] border border-foreground bg-foreground text-background p-8 flex flex-col">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-background/70 mb-6">
                  {t('investors.ventureBadge')}
                </div>
                <h4 className="font-sans text-[24px] md:text-[28px] font-semibold text-background tracking-[-0.01em] mb-2 leading-[1.15]">
                  {t('investors.ventureTitle')}
                </h4>
                <div className="font-sans text-[13px] text-background/70 mb-6">
                  {t('investors.ventureLocation')}
                </div>
                <p
                  className="font-sans text-[15px] text-background mb-7"
                  style={{ lineHeight: 1.65 }}
                >
                  {t('investors.ventureDesc')}
                </p>

                {/* Visual flow — pills on dark */}
                <div className="flex items-center gap-2 flex-wrap mb-8">
                  <span className="font-sans text-[12px] text-background border border-background rounded-full px-3 py-1">VORVN</span>
                  <span className="text-background/60 text-[12px]">+</span>
                  <span className="font-sans text-[12px] text-background border border-background rounded-full px-3 py-1">Capital</span>
                  <span className="text-background/60 text-[12px]">=</span>
                  <span className="font-sans text-[12px] text-foreground bg-background border border-background rounded-full px-3 py-1 font-medium">Co-Built Venture</span>
                </div>

                <div className="mt-auto pt-2">
                  <Link
                    to={`/${lang}/contact`}
                    className="inline-flex items-center gap-2 font-sans text-[15px] md:text-[16px] text-background border-b border-background pb-[2px] hover:opacity-80 transition-opacity"
                  >
                    {t('investors.ventureCta')}
                  </Link>
                </div>
              </article>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="mt-16 reveal d4">
            <Link
              to={`/${lang}/contact`}
              className="arrow-link text-[17px] md:text-[20px]"
            >
              {t('investors.cta')}
            </Link>
            <p className="mt-5 font-sans text-[13px] text-foreground opacity-70">
              {t('investors.ctaSub')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
