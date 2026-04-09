import { useTranslation } from 'react-i18next';
import SectionHeader from '../SectionHeader';

export default function EntitySection() {
  const { t } = useTranslation();

  return (
    <section className="border-t border-rule" style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}>
      <SectionHeader numKey="entity.num" labelKey="entity.label" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-x-20">
        <div className="hidden lg:block" />
        <div>
          <p
            className="font-sans italic font-normal text-foreground reveal d1"
            style={{ fontSize: 'clamp(22px, 2.8vw, 44px)', lineHeight: 1.35 }}
          >
            {t('entity.statement').split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
          <p
            className="mt-8 text-mid font-normal reveal d2"
            style={{ fontSize: 'clamp(14px, 1.1vw, 16px)', lineHeight: 1.88 }}
          >
            {t('entity.detail')}
          </p>
          <div className="mt-7 pt-7 border-t border-rule font-mono text-[11px] tracking-[0.08em] text-dim [html[data-theme='light']_&]:text-mid reveal d3" style={{ lineHeight: 1.7 }}>
            {t('entity.designNote')}
          </div>
        </div>
      </div>
    </section>
  );
}
