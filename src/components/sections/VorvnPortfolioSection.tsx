import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BRANDS_DATA } from '@/data/brands';

function VorvnGallery({ images }: { images: string[] }) {
  const { t } = useTranslation();
  const [cur, setCur] = useState(0);
  const total = images.length;

  const goNext = useCallback(() => {
    setCur((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setCur((prev) => (prev - 1 + total) % total);
  }, [total]);

  return (
    <div className="relative">
      <div className="overflow-hidden bg-surface" style={{ aspectRatio: '1/1' }}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover block grayscale-[18%] [html[data-theme='light']_&]:grayscale-[5%] transition-opacity duration-500 ${
              i === cur ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ position: i === 0 ? 'relative' : 'absolute' }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between pt-3">
        <button
          onClick={goPrev}
          className="bg-transparent border-none font-mono text-[10px] tracking-[0.08em] text-mid hover:text-foreground transition-colors p-0"
        >
          {t('portfolio.prev')}
        </button>
        <div className="flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              className={`w-[5px] h-[5px] rounded-full border-none p-0 transition-colors duration-[250ms] ${
                i === cur ? 'bg-foreground' : 'bg-dim'
              }`}
            />
          ))}
        </div>
        <button
          onClick={goNext}
          className="bg-transparent border-none font-mono text-[10px] tracking-[0.08em] text-mid hover:text-foreground transition-colors p-0"
        >
          {t('portfolio.next')}
        </button>
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
    idx: string; name: string; sector: string; status: string; statusLabel: string; desc: string;
  };
  const data = BRANDS_DATA[index];

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
            <img src={data.logo} alt="" className="max-h-6 max-w-7 object-contain block [html[data-theme='light']_&]:invert" />
          ) : (
            <span className="w-6 h-6 border border-rule" />
          )}
        </span>
        <span className="font-sans font-medium tracking-[0.01em] uppercase" style={{ fontSize: 'clamp(13px, 1.4vw, 18px)' }}>
          {brand.name}
        </span>
        <span className="hidden lg:block font-sans text-[13px] font-normal text-mid">{brand.sector}</span>
        <span className={`font-mono text-[8.5px] tracking-[0.12em] uppercase whitespace-nowrap ${
          brand.status === 'active' ? 'text-foreground' : 'text-mid'
        }`}>
          {brand.statusLabel}
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
          {/* Big logo */}
          <div className="mb-8">
            {data.logo ? (
              <div className="inline-block [html[data-theme='light']_&]:bg-[#181818] [html[data-theme='light']_&]:p-3 [html[data-theme='light']_&]:px-5">
                <img src={data.logo} alt={brand.name} loading="lazy" className="h-16 max-w-[220px] object-contain object-left block" />
              </div>
            ) : (
              <div className="font-sans text-[28px] font-medium tracking-[0.01em] text-foreground">{brand.name}</div>
            )}
          </div>

          {/* Content grid: info left, gallery right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-x-[60px] gap-y-9">
            <div>
              <div className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground mb-3">{brand.name}</div>
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
    <section className="border-t border-rule" style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}>
      <div className="reveal" style={{ marginBottom: 'clamp(48px, 7vh, 88px)' }}>
        <span className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground">
          {t('portfolio.label')}
        </span>
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
