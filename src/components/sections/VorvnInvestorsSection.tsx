import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

export default function VorvnInvestorsSection() {
  const { t } = useTranslation();

  return (
    <section
      id="investors"
      className="border-t border-rule"
      style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-x-20 gap-y-12">
        {/* Left: label */}
        <div className="reveal">
          <span className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground">
            {t('investors.label')}
          </span>
        </div>

        {/* Right: content */}
        <div>
          {/* Headline */}
          <p
            className="font-sans font-medium text-foreground reveal d1"
            style={{ fontSize: 'clamp(22px, 2.8vw, 44px)', lineHeight: 1.35 }}
          >
            {t('investors.headline').split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </p>

          {/* Body */}
          <p
            className="mt-8 font-sans font-normal text-mid reveal d2 max-w-[640px]"
            style={{ fontSize: 'clamp(15px, 1.15vw, 18px)', lineHeight: 1.7 }}
          >
            {t('investors.body')}
          </p>

          {/* Schema — two paths visual */}
          <div className="mt-16 reveal d3">
            <div className="font-sans text-[15px] font-medium text-foreground mb-8">
              {t('investors.schemaTitle')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-rule">
              {/* Incubator */}
              <div className="border-b md:border-b-0 md:border-r border-rule py-8 pr-0 md:pr-10 relative">
                <div className="font-sans text-[13px] font-medium text-mid mb-4">
                  {t('investors.incubatorBadge')}
                </div>
                <div className="font-sans text-[22px] md:text-[26px] font-medium text-foreground tracking-[-0.01em] mb-2">
                  {t('investors.incubatorTitle')}
                </div>
                <div className="font-sans text-[14px] text-dim mb-6">
                  {t('investors.incubatorLocation')}
                </div>
                <p className="font-sans text-[15px] text-mid max-w-[360px]" style={{ lineHeight: 1.65 }}>
                  {t('investors.incubatorDesc')}
                </p>

                {/* Visual flow */}
                <div className="mt-8 flex items-center gap-3 flex-wrap">
                  <span className="font-sans text-[13px] text-foreground border border-rule px-3 py-1.5">Design</span>
                  <span className="text-dim">→</span>
                  <span className="font-sans text-[13px] text-foreground border border-rule px-3 py-1.5">Build</span>
                  <span className="text-dim">→</span>
                  <span className="font-sans text-[13px] text-foreground border border-rule px-3 py-1.5">Ship</span>
                </div>
              </div>

              {/* Venture */}
              <div className="border-b md:border-b-0 border-rule py-8 pl-0 md:pl-10">
                <div className="font-sans text-[13px] font-medium text-mid mb-4">
                  {t('investors.ventureBadge')}
                </div>
                <div className="font-sans text-[22px] md:text-[26px] font-medium text-foreground tracking-[-0.01em] mb-2">
                  {t('investors.ventureTitle')}
                </div>
                <div className="font-sans text-[14px] text-dim mb-6">
                  {t('investors.ventureLocation')}
                </div>
                <p className="font-sans text-[15px] text-mid max-w-[360px]" style={{ lineHeight: 1.65 }}>
                  {t('investors.ventureDesc')}
                </p>

                {/* Visual flow */}
                <div className="mt-8 flex items-center gap-3 flex-wrap">
                  <span className="font-sans text-[13px] text-foreground border border-rule px-3 py-1.5">VORVN</span>
                  <span className="text-dim">+</span>
                  <span className="font-sans text-[13px] text-foreground border border-rule px-3 py-1.5">Partner</span>
                  <span className="text-dim">=</span>
                  <span className="font-sans text-[13px] text-foreground border border-foreground px-3 py-1.5">Co-Built Venture</span>
                </div>
              </div>
            </div>
            <div className="border-b border-rule" />
          </div>

          {/* CTA — visible, prominent */}
          <div className="mt-16 reveal d4">
            <a
              href="mailto:invest@vorvn.com"
              className="inline-flex items-center gap-3 bg-foreground text-background font-sans text-[15px] font-medium px-7 py-4 hover:opacity-90 transition-opacity duration-200 group"
            >
              {t('investors.cta')}
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <p className="mt-5 font-sans text-[13px] text-dim">
              {t('investors.ctaSub')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
