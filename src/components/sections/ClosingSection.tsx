import { useTranslation } from 'react-i18next';

export default function ClosingSection() {
  const { t } = useTranslation();

  return (
    <div
      className="border-t border-rule grid grid-cols-1 lg:grid-cols-[1fr_1.55fr] gap-y-12 lg:gap-x-20 items-center"
      style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
    >
      <div className="flex items-center justify-center reveal order-first lg:order-none">
        <img
          src="https://vorvn.com/wp-content/uploads/2023/08/vevold-icon.gif"
          alt="VE VOLD"
          className="w-full max-w-[340px] opacity-55 mix-blend-screen grayscale [html[data-theme='light']_&]:mix-blend-multiply [html[data-theme='light']_&]:opacity-40 [html[data-theme='light']_&]:invert"
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            const fallback = img.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div
          className="w-full max-w-[320px] border border-rule flex items-center justify-center relative overflow-hidden hidden"
          style={{ aspectRatio: '1/1' }}
        >
          <span className="absolute w-[180px] h-[180px] rounded-full border border-dim animate-[pulse_3s_ease-in-out_infinite]" />
          <span className="absolute w-[100px] h-[100px] rounded-full border border-dim animate-[pulse_3s_ease-in-out_infinite_0.4s]" />
          <span className="font-brand text-dim text-center relative z-[1] tracking-[0.12em]" style={{ fontSize: 'clamp(18px, 2vw, 28px)' }}>
            VE VOLD™
          </span>
        </div>
      </div>

      <div>
        <p
          className="font-sans italic font-normal text-foreground reveal d1"
          style={{ fontSize: 'clamp(20px, 2.4vw, 38px)', lineHeight: 1.42 }}
        >
          Creativity without process<br />
          <em className="not-italic text-mid">{t('closing.chaos')}</em><br /><br />
          Process without creativity<br />
          <em className="not-italic text-mid">{t('closing.lifeless')}</em><br /><br />
          We build both.
        </p>
        <div className="mt-8 font-mono text-[10px] tracking-[0.14em] uppercase text-dim [html[data-theme='light']_&]:text-mid reveal d2">
          {t('closing.sub')}
        </div>
      </div>
    </div>
  );
}
