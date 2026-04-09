import { useTranslation } from 'react-i18next';

export default function FounderSection() {
  const { t } = useTranslation();

  return (
    <section
      className="border-t border-rule grid grid-cols-1 lg:grid-cols-[1fr_1.55fr] gap-y-12 lg:gap-x-20 items-center"
      style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
    >
      <div className="relative overflow-hidden max-h-[420px] lg:max-h-[580px] reveal" style={{ aspectRatio: '3/4' }}>
        <img
          src="https://vorvn.com/wp-content/uploads/2024/08/mehdi-ayache-berberos-morocco-designer-creative-director-morocco-maroc-designer-3-designer-bali.png"
          alt="Mehdi Ayache Berberos — CEO & Founder, VORVN"
          loading="lazy"
          className="w-full h-full object-cover object-[center_top] block grayscale contrast-[1.08] [html[data-theme='light']_&]:contrast-[1.04]"
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 55%, hsl(var(--bg)) 100%)' }} />
      </div>

      <div className="flex flex-col justify-center">
        <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-mid mb-8 reveal">
          {t('founder.label')}
        </div>
        <blockquote
          className="font-sans italic font-normal text-foreground mb-10 reveal d1"
          style={{ fontSize: 'clamp(22px, 2.7vw, 42px)', lineHeight: 1.38 }}
        >
          {t('founder.quote').split('\n').map((line, i) => (
            <span key={i}>{line}{i < t('founder.quote').split('\n').length - 1 && <br />}</span>
          ))}
        </blockquote>
        <div className="w-10 h-px bg-dim [html[data-theme='light']_&]:bg-mid mb-7 reveal d2" />
        <div className="font-brand tracking-[0.04em] text-foreground mb-2 reveal d2" style={{ fontSize: 'clamp(14px, 1.4vw, 20px)' }}>
          {t('founder.name')}
        </div>
        <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-mid reveal d3">
          {t('founder.title')}
        </div>
      </div>
    </section>
  );
}
