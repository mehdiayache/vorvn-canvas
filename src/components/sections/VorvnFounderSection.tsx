import { useTranslation } from 'react-i18next';
import founderPhoto from '@/assets/founder-mehdi.png';

export default function VorvnFounderSection() {
  const { t } = useTranslation();

  return (
    <section
      id="founder"
      className="border-t border-rule"
      style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-x-20 gap-y-12">
        {/* Left: label */}
        <div className="reveal">
          <h2 className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground m-0">
            {t('founder.label')}
          </h2>
        </div>

        {/* Right: content */}
        <div>
          <blockquote
            className="font-sans font-medium text-foreground reveal d1 tracking-[-0.015em]"
            style={{ fontSize: 'clamp(22px, 2.8vw, 44px)', lineHeight: 1.35 }}
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

          {/* Founder info */}
          <div className="mt-12 flex items-center gap-6 reveal d2">
            <div className="r-pill w-[72px] h-[72px] overflow-hidden border border-foreground shrink-0">
              <img
                src={founderPhoto}
                alt="Mehdi Ayache Berberos"
                loading="lazy"
                className="w-full h-full object-cover object-[center_top] block"
              />
            </div>

            <div>
              <div className="font-sans text-[15px] font-medium text-foreground mb-1">
                {t('founder.name')}
              </div>
              <div className="font-sans text-[13px] text-mid mb-3">
                {t('founder.title')}
              </div>
              <div className="flex items-center gap-5">
                <a
                  href="https://www.linkedin.com/in/mehdiayacheberberos/"
                  target="_blank"
                  rel="noopener"
                  className="font-sans text-[13px] text-mid border-b border-dim pb-[2px] hover:text-foreground hover:border-foreground transition-colors duration-200"
                >
                  LinkedIn →
                </a>
                <a
                  href="https://mehdiayache.com"
                  target="_blank"
                  rel="noopener"
                  className="font-sans text-[13px] text-mid border-b border-dim pb-[2px] hover:text-foreground hover:border-foreground transition-colors duration-200"
                >
                  Website →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
