import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeader from '../SectionHeader';
import { BRANDS_DATA } from '@/data/brands';

function Carousel({ images }: { images: string[] }) {
  const { t } = useTranslation();
  const [cur, setCur] = useState(0);
  const total = images.length;

  const go = useCallback((idx: number) => {
    setCur(((idx % total) + total) % total);
  }, [total]);

  return (
    <div className="relative">
      <div className="overflow-hidden bg-surface" style={{ aspectRatio: '16/9' }}>
        <div
          className="flex h-full will-change-transform"
          style={{
            transform: `translateX(-${cur * 100}%)`,
            transition: 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {images.map((src, i) => (
            <div key={i} className="min-w-full h-full overflow-hidden">
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover block grayscale-[18%] [html[data-theme='light']_&]:grayscale-[5%]"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between pt-[14px]">
        <button onClick={() => go(cur - 1)} className="bg-transparent border-none font-mono text-[10px] tracking-[0.08em] text-mid hover:text-foreground transition-colors p-0">
          {t('portfolio.prev')}
        </button>
        <div className="flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`w-[5px] h-[5px] rounded-full border-none p-0 transition-colors duration-[250ms] ${
                i === cur ? 'bg-foreground' : 'bg-dim'
              }`}
            />
          ))}
        </div>
        <button onClick={() => go(cur + 1)} className="bg-transparent border-none font-mono text-[10px] tracking-[0.08em] text-mid hover:text-foreground transition-colors p-0">
          {t('portfolio.next')}
        </button>
      </div>
    </div>
  );
}

function PortfolioItem({ index }: { index: number }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const expandRef = useRef<HTMLDivElement>(null);

  const brand = t(`portfolio.brands.${index}`, { returnObjects: true }) as {
    idx: string; name: string; sector: string; status: string; statusLabel: string; desc: string;
  };
  const data = BRANDS_DATA[index];

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const el = expandRef.current;
    if (!el) return;
    if (open) {
      el.style.height = '0';
      // Force reflow
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
  }, [open]);

  return (
    <li className={`border-b border-rule first:border-t ${open ? 'pf-open' : ''}`}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggleOpen}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOpen(); } }}
        className="grid items-center py-[22px] cursor-pointer select-none hover:opacity-50 transition-opacity duration-[220ms]"
        style={{ gridTemplateColumns: '30px 1fr 1fr auto 20px', gap: '0 48px' }}
      >
        <span className="font-mono text-[9px] tracking-[0.1em] text-mid">{brand.idx}</span>
        <span className="font-sans font-medium tracking-[0.04em] uppercase" style={{ fontSize: 'clamp(13px, 1.4vw, 18px)' }}>
          {brand.name}
        </span>
        <span className="hidden lg:block text-[13px] font-normal text-mid">{brand.sector}</span>
        <span className={`font-mono text-[8.5px] tracking-[0.12em] uppercase whitespace-nowrap ${
          brand.status === 'active' ? 'text-foreground' : 'text-mid'
        }`}>
          {brand.statusLabel}
        </span>
        <span className="w-4 h-4 relative shrink-0">
          <span className="absolute w-3 h-px bg-mid rounded-[1px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <span
            className={`absolute w-px h-3 bg-mid rounded-[1px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              open ? 'rotate-90 opacity-0' : ''
            }`}
          />
        </span>
      </div>
      <div
        ref={expandRef}
        className="overflow-hidden"
        style={{ height: 0, transition: 'height 520ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        aria-hidden={!open}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.65fr] gap-x-[60px] gap-y-9 border-t border-rule py-10 pb-14 lg:ps-20">
          <div>
            {data.logo && (
              <div className="mb-5 inline-block [html[data-theme='light']_&]:bg-[#181818] [html[data-theme='light']_&]:p-2 [html[data-theme='light']_&]:px-[14px]">
                <img src={data.logo} alt={brand.name} loading="lazy" className="max-h-10 max-w-[140px] object-contain object-left block" />
              </div>
            )}
            <div className="font-brand text-[16px] tracking-[0.04em] text-foreground mb-3">{brand.name}</div>
            <p className="text-[14px] font-normal leading-[1.82] text-mid mb-6 max-w-[440px]">{brand.desc}</p>
            {data.url ? (
              <a
                href={data.url}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-[10px] font-mono text-[9.5px] tracking-[0.15em] uppercase text-foreground border-b border-dim pb-[3px] hover:text-mid hover:border-transparent transition-colors duration-200"
              >
                {t('portfolio.visitBrand')}
              </a>
            ) : (
              <span className="inline-flex items-center gap-[10px] font-mono text-[9.5px] tracking-[0.15em] uppercase opacity-35 pointer-events-none">
                {t('portfolio.inDevelopment')}
              </span>
            )}
          </div>
          {open && <Carousel images={data.images} />}
        </div>
      </div>
    </li>
  );
}

export default function PortfolioSection() {
  const brands = BRANDS_DATA;

  return (
    <section className="border-t border-rule" style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}>
      <SectionHeader numKey="portfolio.num" labelKey="portfolio.label" />
      <ul className="list-none">
        {brands.map((_, i) => (
          <PortfolioItem key={i} index={i} />
        ))}
      </ul>
    </section>
  );
}
