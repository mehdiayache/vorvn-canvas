import { useTranslation } from 'react-i18next';
import founderPhoto from '@/assets/founder-mehdi.webp';
import LoadingImage from '@/components/LoadingImage';

export default function VorvnFounderSection() {
  const { t } = useTranslation();

  const rawQuote = t('founder.quote');
  // Strip surrounding quote marks (we render our own big quote glyph)
  const quote = rawQuote.replace(/^[«"„"\s]+|[»"""\s]+$/g, '');

  return (
    <section
      id="founder"
      className="border-t border-rule"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-screen">
        {/* LEFT PANEL — quote + identity */}
        <div
          className="flex flex-col justify-between"
          style={{
            padding:
              'clamp(52px, 9vh, 120px) clamp(32px, 6vw, 100px)',
          }}
        >
          {/* Quote block */}
          <div className="reveal">
            <span
              aria-hidden="true"
              className="block font-brand text-dim"
              style={{
                fontSize: 'clamp(40px, 6vw, 88px)',
                lineHeight: 0.75,
                marginBottom: 'clamp(18px, 2.5vh, 30px)',
              }}
            >
              "
            </span>
            <blockquote
              className="font-sans font-normal text-foreground tracking-[-0.02em]"
              style={{
                fontSize: 'clamp(24px, 3.2vw, 56px)',
                lineHeight: 1.2,
              }}
            >
              {quote.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (trimmed.length === 0) {
                  return (
                    <span
                      key={i}
                      className="block h-3"
                      aria-hidden="true"
                    />
                  );
                }
                return (
                  <span key={i} className="block">
                    {trimmed}
                  </span>
                );
              })}
            </blockquote>
          </div>

          {/* Identity block */}
          <div
            className="reveal d2"
            style={{ paddingTop: 'clamp(48px, 7vh, 88px)' }}
          >
            <div
              className="font-sans font-semibold text-foreground"
              style={{
                fontSize: 'clamp(15px, 1.6vw, 21px)',
                letterSpacing: '0.01em',
                marginBottom: '8px',
              }}
            >
              {t('founder.name')}
            </div>
            <div
              className="font-mono text-mid uppercase"
              style={{
                fontSize: '9px',
                letterSpacing: '0.13em',
                lineHeight: 1.72,
                marginBottom: '20px',
              }}
            >
              {t('founder.title')}
            </div>

            <div className="flex flex-wrap gap-5">
              <a
                href="https://www.linkedin.com/in/mehdiayacheberberos/"
                target="_blank"
                rel="noopener"
                className="font-mono uppercase text-foreground border-b border-dim pb-[2px] hover:text-mid hover:border-transparent transition-colors duration-200"
                style={{ fontSize: '9px', letterSpacing: '0.12em' }}
              >
                LinkedIn →
              </a>
              <a
                href="https://mehdiayache.com"
                target="_blank"
                rel="noopener"
                className="font-mono uppercase text-foreground border-b border-dim pb-[2px] hover:text-mid hover:border-transparent transition-colors duration-200"
                style={{ fontSize: '9px', letterSpacing: '0.12em' }}
              >
                Site →
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — photo + caption */}
        <div
          className="relative overflow-hidden order-first lg:order-none"
          style={{ minHeight: 'min(78vw, 520px)' }}
        >
          <LoadingImage
            src={founderPhoto}
            alt="Portrait of Mehdi Ayache Berberos, Founder and CEO of VORVN"
            className="absolute inset-0 w-full h-full"
            loaderSize={56}
            imgStyle={{ objectPosition: 'center center' }}
          />

          {/* Caption overlay — accent color since portrait background is dark */}
          <div
            className="absolute z-[2] text-right"
            style={{
              bottom: 'clamp(20px, 4vh, 52px)',
              right: 'clamp(20px, 3.5vw, 52px)',
              maxWidth: '240px',
            }}
          >
            <p
              className="font-mono text-background"
              style={{
                fontSize: '9px',
                letterSpacing: '0.07em',
                lineHeight: 1.8,
                textShadow: '0 1px 12px hsl(var(--foreground) / 0.55)',
              }}
            >
              {t('founder.caption')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
