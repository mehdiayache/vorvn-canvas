import { useTranslation } from 'react-i18next';

export default function FounderSection() {
  const { t } = useTranslation();

  return (
    <section
      className="border-t border-rule"
      style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
    >
      <div className="max-w-[900px] mx-auto">
        {/* Top label */}
        <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-mid mb-16 reveal">
          {t('founder.label')}
        </div>

        {/* CEO card */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 lg:gap-16">
          {/* Circle photo */}
          <div className="shrink-0 reveal">
            <div className="w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] rounded-full overflow-hidden border border-rule">
              <img
                src="https://vorvn.com/wp-content/uploads/2024/08/mehdi-ayache-berberos-morocco-designer-creative-director-morocco-maroc-designer-3-designer-bali.png"
                alt="Mehdi Ayache Berberos — CEO & Founder, VORVN"
                loading="lazy"
                className="w-full h-full object-cover object-[center_top] block grayscale contrast-[1.08] [html[data-theme='light']_&]:contrast-[1.04]"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col text-center md:text-left">
            {/* Name & Title */}
            <div className="font-sans text-foreground mb-1 reveal d1" style={{ fontSize: 'clamp(20px, 2vw, 32px)', fontWeight: 500 }}>
              {t('founder.name')}
            </div>
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-mid mb-8 reveal d1">
              {t('founder.title')}
            </div>

            {/* Quote */}
            <blockquote
              className="font-sans font-normal text-mid mb-8 reveal d2"
              style={{ fontSize: 'clamp(15px, 1.4vw, 20px)', lineHeight: 1.6 }}
            >
              {t('founder.quote').split('\n').map((line, i) => (
                <span key={i}>{line}{i < t('founder.quote').split('\n').length - 1 && <br />}</span>
              ))}
            </blockquote>

            {/* Rule */}
            <div className="w-10 h-px bg-dim [html[data-theme='light']_&]:bg-mid mb-6 reveal d3 mx-auto md:mx-0" />

            {/* Links */}
            <div className="flex items-center gap-6 justify-center md:justify-start reveal d3">
              <a
                href="https://www.linkedin.com/in/mehdiayacheberberos/"
                target="_blank"
                rel="noopener"
                className="font-mono text-[9.5px] tracking-[0.12em] uppercase text-foreground border-b border-dim pb-[2px] hover:text-mid hover:border-transparent transition-colors duration-200"
              >
                LinkedIn →
              </a>
              <a
                href="https://mehdiayache.com"
                target="_blank"
                rel="noopener"
                className="font-mono text-[9.5px] tracking-[0.12em] uppercase text-foreground border-b border-dim pb-[2px] hover:text-mid hover:border-transparent transition-colors duration-200"
              >
                Website →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
