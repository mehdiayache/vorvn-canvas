import { useTranslation } from 'react-i18next';
import BreathingEye from '@/components/BreathingEye';

export default function ClosingSection() {
  const { t } = useTranslation();

  return (
    <div
      className="border-t border-rule grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-y-14 lg:gap-x-24 items-center"
      style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
    >
      <div className="flex items-center justify-center reveal order-first lg:order-none">
        <BreathingEye />
      </div>

      <div>
        <p
          className="font-sans font-semibold text-foreground reveal d1 tracking-[-0.01em]"
          style={{ fontSize: 'clamp(24px, 3.2vw, 52px)', lineHeight: 1.18 }}
        >
          Creativity without process {t('closing.chaos')}
          <br />
          Process without creativity {t('closing.lifeless')}
          <br />
          We build both.
        </p>
        <div className="mt-8 font-mono text-[10px] tracking-[0.14em] uppercase text-dim [html[data-theme='light']_&]:text-mid reveal d2">
          {t('closing.sub')}
        </div>
      </div>
    </div>
  );
}
