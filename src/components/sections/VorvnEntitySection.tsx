import { useTranslation } from 'react-i18next';

export default function EntitySection() {
  const { t } = useTranslation();

  return (
    <section id="entity" className="border-t border-rule" style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}>
      <div className="reveal" style={{ marginBottom: 'clamp(48px, 7vh, 88px)' }}>
        <h2 className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground m-0">{t('entity.label')}</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-x-20">
        <div className="hidden lg:block" />
        <div>
          <h3
            className="font-sans font-medium text-foreground reveal d1 m-0"
            style={{ fontSize: 'clamp(22px, 2.8vw, 44px)', lineHeight: 1.35 }}
          >
            {t('entity.statement').split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h3>
          <p
            className="mt-8 font-sans font-normal text-mid reveal d2"
            style={{ fontSize: 'clamp(14px, 1.1vw, 16px)', lineHeight: 1.88 }}
          >
            {t('entity.detail')}
          </p>
          <div className="mt-7 pt-7 border-t border-rule font-mono text-[11px] tracking-[0.08em] text-dim reveal d3" style={{ lineHeight: 1.7 }}>
            {t('entity.designNote')}
          </div>
        </div>
      </div>
    </section>
  );
}
