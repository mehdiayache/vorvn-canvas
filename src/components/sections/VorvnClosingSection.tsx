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

      <div className="max-w-[640px]">
        <p
          className="font-sans font-medium text-foreground reveal d1 tracking-[-0.012em]"
          style={{ fontSize: 'clamp(18px, 1.7vw, 26px)', lineHeight: 1.5 }}
        >
          Creativity without process {t('closing.chaos')} Process without creativity {t('closing.lifeless')} We build both.
        </p>
        <div className="mt-10 font-mono text-[10px] tracking-[0.14em] uppercase text-dim [html[data-theme='light']_&]:text-mid reveal d2">
          {t('closing.sub')}
        </div>
      </div>
    </div>
  );
}
