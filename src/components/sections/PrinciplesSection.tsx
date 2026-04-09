import { useTranslation } from 'react-i18next';
import SectionHeader from '../SectionHeader';

export default function PrinciplesSection() {
  const { t } = useTranslation();
  const items = t('principles.items', { returnObjects: true }) as Array<{
    numeral: string;
    title: string;
    body: string;
  }>;

  return (
    <section className="border-t border-rule" style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}>
      <SectionHeader numKey="principles.num" labelKey="principles.label" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-11 lg:gap-x-14">
        {items.map((item, i) => (
          <div key={i} className={`pt-8 border-t border-rule reveal d${i + 1}`}>
            <div className="font-brand text-[60px] leading-none text-dim [html[data-theme='light']_&]:text-mid mb-6">
              {item.numeral}
            </div>
            <div className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-[14px]">
              {item.title}
            </div>
            <p className="text-mid font-normal leading-[1.88]" style={{ fontSize: 'clamp(13px, 1.05vw, 15px)' }}>
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
