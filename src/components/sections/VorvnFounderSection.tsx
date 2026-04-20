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

      {/* Quote — preserves intentional line breaks and paragraph rhythm */}
      <blockquote
        className="font-sans font-medium text-foreground mb-12 max-w-[780px] reveal d1 tracking-[-0.015em]"
        style={{ fontSize: 'clamp(20px, 2vw, 30px)', lineHeight: 1.45 }}
      >
        {t('founder.quote').split('\n').map((line, i) => {
          const trimmed = line.trim();
          if (trimmed.length === 0) {
            return <span key={i} className="block h-4" aria-hidden="true" />;
          }
          return (
            <span key={i} className="block">
              {trimmed}
            </span>
          );
        })}
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
