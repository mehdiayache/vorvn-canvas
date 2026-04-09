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
      {/* Header row: label left, CTA right */}
      <div className="flex items-start justify-between reveal">
        <span className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground">
          {t('investors.label')}
        </span>
        <a
          href="mailto:invest@vorvn.com"
          className="hidden md:inline-flex items-center gap-2 font-sans text-[13px] font-medium tracking-[0.04em] text-foreground hover:opacity-60 transition-opacity duration-300 group"
        >
          {t('investors.cta')}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>

      {/* Statement */}
      <div className="mt-16 md:mt-24 max-w-[720px] reveal d1">
        <p
          className="font-sans font-medium text-foreground"
          style={{ fontSize: 'clamp(24px, 3vw, 48px)', lineHeight: 1.25 }}
        >
          {t('investors.headline')}
        </p>
      </div>

      {/* Body */}
      <div className="mt-8 md:mt-12 max-w-[580px] reveal d2">
        <p
          className="font-sans text-mid"
          style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', lineHeight: 1.75 }}
        >
          {t('investors.body')}
        </p>
      </div>

      {/* Inline details — subtle, no boxes */}
      <div className="mt-14 md:mt-20 flex flex-col md:flex-row md:gap-24 gap-10 reveal d3">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-dim">
            {t('investors.path1Badge')}
          </span>
          <span className="font-sans text-[14px] md:text-[16px] font-medium text-foreground">
            {t('investors.path1Title')}
          </span>
          <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-dim">
            {t('investors.path1Location')}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-dim">
            {t('investors.path2Badge')}
          </span>
          <span className="font-sans text-[14px] md:text-[16px] font-medium text-foreground">
            {t('investors.path2Title')}
          </span>
          <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-dim">
            {t('investors.path2Location')}
          </span>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="mt-12 md:hidden reveal d4">
        <a
          href="mailto:invest@vorvn.com"
          className="inline-flex items-center gap-2 font-sans text-[13px] font-medium tracking-[0.04em] text-foreground"
        >
          {t('investors.cta')}
          <ArrowRight size={14} />
        </a>
      </div>

      {/* Subtle footnote */}
      <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-dim mt-10 reveal d4">
        {t('investors.ctaSub')}
      </p>
    </section>
  );
}
