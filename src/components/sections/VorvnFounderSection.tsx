import { useTranslation } from 'react-i18next';

export default function VorvnFounderSection() {
  const { t } = useTranslation();

  return (
    <section
      id="founder"
      className="border-t border-rule"
      style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
    >
      <div className="reveal" style={{ marginBottom: 'clamp(48px, 7vh, 88px)' }}>
        <span className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground">
          {t('founder.label')}
        </span>
      </div>

      {/* Quote — big and prominent */}
      <blockquote
        className="font-sans font-medium text-foreground mb-16 max-w-[800px] reveal d1"
        style={{ fontSize: 'clamp(24px, 3vw, 48px)', lineHeight: 1.35 }}
      >
        {t('founder.quote').split('\n').map((line, i) => (
          <span key={i}>{line}{i < t('founder.quote').split('\n').length - 1 && <br />}</span>
        ))}
      </blockquote>

      {/* Founder info — smaller, CEO card style */}
      <div className="flex items-center gap-6 reveal d2">
        {/* Circle photo */}
        <div className="w-[72px] h-[72px] rounded-full overflow-hidden border border-rule shrink-0">
          <img
            src="https://vorvn.com/wp-content/uploads/2024/08/mehdi-ayache-berberos-morocco-designer-creative-director-morocco-maroc-designer-3-designer-bali.png"
            alt="Mehdi Ayache Berberos"
            loading="lazy"
            className="w-full h-full object-cover object-[center_top] block grayscale contrast-[1.08] [html[data-theme='light']_&]:contrast-[1.04]"
          />
        </div>

        <div>
          <div className="font-sans text-[14px] font-medium text-foreground mb-1">
            {t('founder.name')}
          </div>
          <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-mid mb-3">
            {t('founder.title')}
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/mehdiayacheberberos/"
              target="_blank"
              rel="noopener"
              className="font-mono text-[8.5px] tracking-[0.12em] uppercase text-mid border-b border-dim pb-[2px] hover:text-foreground hover:border-foreground transition-colors duration-200"
            >
              LinkedIn →
            </a>
            <a
              href="https://mehdiayache.com"
              target="_blank"
              rel="noopener"
              className="font-mono text-[8.5px] tracking-[0.12em] uppercase text-mid border-b border-dim pb-[2px] hover:text-foreground hover:border-foreground transition-colors duration-200"
            >
              Website →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
