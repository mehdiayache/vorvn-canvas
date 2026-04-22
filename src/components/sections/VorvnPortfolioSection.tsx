import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BRANDS_DATA } from '@/data/brands';

function VorvnGallery({ images }: { images: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animId: number;
    let scrollPos = 0;
    const speed = 0.5;

    const step = () => {
      scrollPos += speed;
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [images]);

  const loopImages = [...images, ...images];

  return (
    <div className="relative overflow-hidden">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-hidden"
        style={{ scrollBehavior: 'auto' }}
      >
        {loopImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            className="w-[300px] h-[300px] object-cover block shrink-0 grayscale-[18%]"
          />
        ))}
      </div>
    </div>
  );
}

function VorvnPortfolioItem({
  index,
  isOpen,
  onToggle,
}: {
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const expandRef = useRef<HTMLDivElement>(null);

  const brand = t(`portfolio.brands.${index}`, { returnObjects: true }) as {
    name: string; sector: string; statusLabel: string; desc: string;
  };
  const data = BRANDS_DATA[index];
  const isActive = data.status === 'active';
  const isExited = data.status === 'exited';

  useEffect(() => {
    const el = expandRef.current;
    if (!el) return;
    if (isOpen) {
      el.style.height = '0';
      void el.offsetHeight;
      el.style.height = el.scrollHeight + 'px';
      const handler = () => { el.style.height = 'auto'; };
      el.addEventListener('transitionend', handler, { once: true });
    } else {
      if (el.style.height === 'auto') {
        el.style.height = el.scrollHeight + 'px';
        void el.offsetHeight;
      }
      el.style.height = '0';
    }
  }, [isOpen]);

  return (
    <li className={`border-b border-rule first:border-t`}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        className="grid items-center py-[22px] cursor-pointer select-none hover:opacity-50 transition-opacity duration-[220ms]"
        style={{ gridTemplateColumns: 'auto 1fr 1fr auto 20px', gap: '0 24px' }}
      >
        <span className="w-7 h-7 flex items-center justify-center shrink-0">
          {data.logo ? (
            <img src={data.logo} alt="" className="max-h-6 max-w-7 object-contain block" />
          ) : (
            <span className="r-card w-6 h-6 border border-rule" />
          )}
        </span>
        <h3 className="font-sans font-medium tracking-[0.01em] uppercase m-0" style={{ fontSize: 'clamp(13px, 1.4vw, 18px)' }}>
          {brand.name}
        </h3>
        <span className="hidden lg:block font-sans text-[13px] font-normal text-mid">{brand.sector}</span>
        <span className="flex items-center gap-[6px]">
          <span className={`r-pill inline-block w-[7px] h-[7px] bg-foreground ${
            isActive ? 'animate-[pulse_2s_ease-in-out_infinite]' : isExited ? '' : 'opacity-40'
          }`} />
          <span className={`font-mono text-[8.5px] tracking-[0.12em] uppercase whitespace-nowrap text-foreground ${
            isActive || isExited ? '' : 'opacity-60'
          }`}>
            {brand.statusLabel}
          </span>
        </span>
        <span className="w-4 h-4 relative shrink-0">
          <span className="absolute w-3 h-px bg-mid rounded-[1px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <span className={`absolute w-px h-3 bg-mid rounded-[1px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0' : ''}`} />
        </span>
      </div>

      <div
        ref={expandRef}
        className="overflow-hidden"
        style={{ height: 0, transition: 'height 520ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        aria-hidden={!isOpen}
      >
        <div className="border-t border-rule py-10 pb-14">
          <div className="mb-8">
            {data.logo ? (
              <div className="inline-block">
                <img src={data.logo} alt={brand.name} loading="lazy" className="h-16 max-w-[220px] object-contain object-left block" />
              </div>
            ) : (
              <div className="font-sans text-[28px] font-medium tracking-[0.01em] text-foreground">{brand.name}</div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-x-[60px] gap-y-9">
            <div>
              <div className="flex flex-wrap gap-2 mb-5">
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="r-tag inline-block font-mono text-[9px] tracking-[0.1em] uppercase px-[12px] py-[5px] border border-foreground text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="font-sans text-[14px] font-normal leading-[1.82] text-mid mb-6 max-w-[440px]">{brand.desc}</p>
              <div className="flex flex-col gap-3">
                {data.url ? (
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-[10px] font-mono text-[9.5px] tracking-[0.15em] uppercase text-foreground border-b border-dim pb-[3px] hover:text-mid hover:border-transparent transition-colors duration-200 w-fit"
                  >
                    {t('portfolio.visitBrand')}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-[10px] font-mono text-[9.5px] tracking-[0.15em] uppercase opacity-35 pointer-events-none">
                    {t('portfolio.inDevelopment')}
                  </span>
                )}
                {data.presentationUrl && (
                  <a
                    href={data.presentationUrl}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-[10px] font-mono text-[9.5px] tracking-[0.15em] uppercase text-foreground border-b border-dim pb-[3px] hover:text-mid hover:border-transparent transition-colors duration-200 w-fit"
                  >
                    {t('portfolio.downloadPresentation')}
                  </a>
                )}
              </div>
            </div>
            {isOpen && <VorvnGallery images={data.images} />}
          </div>
        </div>
      </div>
    </li>
  );
}

export default function VorvnPortfolioSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section id="portfolio" className="border-t border-rule" style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}>
      <div className="reveal" style={{ marginBottom: 'clamp(48px, 7vh, 88px)' }}>
        <h2 className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground m-0">
          {t('portfolio.label')}
        </h2>
      </div>

      <p
        className="font-sans font-medium text-foreground mb-16 max-w-[680px] reveal"
        style={{ fontSize: 'clamp(18px, 2vw, 28px)', lineHeight: 1.45 }}
      >
        {t('portfolio.intro')}
      </p>

      <ul className="list-none">
        {BRANDS_DATA.map((_, i) => (
          <VorvnPortfolioItem
            key={i}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </ul>
    </section>
  );
}
