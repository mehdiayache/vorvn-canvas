import { useTranslation } from 'react-i18next';

export default function VorvnInvestorsSection() {
  const { t } = useTranslation();

  return (
    <section
      id="investors"
      className="border-t border-rule"
      style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
    >
      {/* Label */}
      <div className="reveal" style={{ marginBottom: 'clamp(48px, 7vh, 88px)' }}>
        <span className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground">
          {t('investors.label')}
        </span>
      </div>

      {/* Main statement */}
      <div className="max-w-[820px] reveal d1">
        <p
          className="font-sans font-medium text-foreground"
          style={{ fontSize: 'clamp(22px, 2.8vw, 44px)', lineHeight: 1.35 }}
        >
          {t('investors.headline')}
        </p>
        <p className="font-sans text-mid mt-6" style={{ fontSize: 'clamp(14px, 1.2vw, 18px)', lineHeight: 1.7 }}>
          {t('investors.body')}
        </p>
      </div>

      {/* Two paths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px mt-16 reveal d2">
        {/* Incubator */}
        <div className="border border-rule p-8 md:p-10 flex flex-col gap-5">
          <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-mid">
            {t('investors.path1Badge')}
          </span>
          <h3 className="font-sans text-[18px] md:text-[22px] font-semibold text-foreground leading-tight">
            {t('investors.path1Title')}
          </h3>
          <p className="font-sans text-[13px] md:text-[14px] text-mid leading-relaxed flex-1">
            {t('investors.path1Body')}
          </p>
          <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-dim">
            {t('investors.path1Location')}
          </span>
        </div>

        {/* Venture */}
        <div className="border border-rule border-s-0 md:border-s p-8 md:p-10 flex flex-col gap-5">
          <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-mid">
            {t('investors.path2Badge')}
          </span>
          <h3 className="font-sans text-[18px] md:text-[22px] font-semibold text-foreground leading-tight">
            {t('investors.path2Title')}
          </h3>
          <p className="font-sans text-[13px] md:text-[14px] text-mid leading-relaxed flex-1">
            {t('investors.path2Body')}
          </p>
          <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-dim">
            {t('investors.path2Location')}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 reveal d3">
        <a
          href="mailto:invest@vorvn.com"
          className="inline-block border border-foreground text-foreground font-sans text-[13px] md:text-[14px] font-semibold tracking-[0.06em] uppercase px-8 py-4 hover:bg-foreground hover:text-[hsl(var(--bg))] transition-all duration-300"
        >
          {t('investors.cta')}
        </a>
        <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-dim mt-5">
          {t('investors.ctaSub')}
        </p>
      </div>
    </section>
  );
}
