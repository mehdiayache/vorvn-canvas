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

      <div className="max-w-[620px]">
        <p
          className="font-sans font-medium text-foreground reveal d1 tracking-[-0.012em]"
          style={{ fontSize: 'clamp(20px, 1.9vw, 30px)', lineHeight: 1.45 }}
        >
          Creativity without process {t('closing.chaos')}
          <br />
          Process without creativity {t('closing.lifeless')}
        </p>
        <p
          className="mt-6 font-sans font-semibold text-foreground reveal d2 tracking-[-0.015em]"
          style={{ fontSize: 'clamp(22px, 2.1vw, 34px)', lineHeight: 1.3 }}
        >
          We build both.
        </p>
        <div className="mt-10 font-mono text-[10px] tracking-[0.14em] uppercase text-dim reveal d3">
          {t('closing.sub')}
        </div>
      </div>
    </div>
  );
}
