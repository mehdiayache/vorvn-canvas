import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
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
            className="r-card w-[300px] h-[300px] object-cover block shrink-0 grayscale-[18%]"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Parse a sector string into individual tags.
 * Authoring format in i18n JSON: comma-separated, e.g. "Consumer Goods, USA, UAE".
 * Legacy "·" separator is also supported for backwards compat.
 */
function parseSectorTags(sector: string): string[] {
  return sector
    .split(/[,·]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function VorvnPortfolioItem({
  brandIndex,
  isOpen,
  onToggle,
}: {
  brandIndex: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const expandRef = useRef<HTMLDivElement>(null);

  const brand = t(`portfolio.brands.${brandIndex}`, { returnObjects: true }) as {
    name: string; sector: string; statusLabel: string; desc: string;
  };
  const data = BRANDS_DATA[brandIndex];
  const isActive = data.status === 'active';
  const isExited = data.status === 'exited';
  const sectorTags = useMemo(() => parseSectorTags(brand.sector), [brand.sector]);

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

  // Status dot color — green for active, red for exited, black for dev.
  const dotColorClass = isActive
    ? 'bg-status-active'
    : isExited
      ? 'bg-status-exited'
      : 'bg-foreground opacity-40';

  return (
    <li className="border-b border-rule first:border-t">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        className="grid items-center py-[22px] cursor-pointer select-none hover:opacity-60 transition-opacity duration-[220ms]"
        style={{ gridTemplateColumns: '1fr minmax(0, 2fr) auto 20px', gap: '0 24px' }}
      >
        {/* Brand name — body size, bold, sentence case */}
        <h3
          className="font-sans text-[17px] font-bold tracking-[-0.005em] text-foreground m-0"
        >
          {brand.name}
        </h3>

        {/* Sector tags — same pill style as inside, left-aligned */}
        <div className="hidden lg:flex flex-wrap gap-1.5 justify-start">
          {sectorTags.map((tag) => (
            <span
              key={tag}
              className="r-tag inline-block font-mono text-[9px] tracking-[0.1em] uppercase px-[10px] py-[4px] border border-foreground text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Status indicator — bigger dot, color-coded */}
        <span className="flex items-center gap-2">
          <span
            className={`r-pill inline-block w-[11px] h-[11px] ${dotColorClass} ${
              isActive ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''
            }`}
            style={
              isActive
                ? { boxShadow: '0 0 0 0 hsl(var(--status-active) / 0.6)' }
                : undefined
            }
          />
          <span className="font-mono text-[9px] tracking-[0.14em] uppercase whitespace-nowrap text-foreground">
            {brand.statusLabel}
          </span>
        </span>

        {/* Toggle */}
        <span className="w-4 h-4 relative shrink-0">
          <span className="absolute w-3 h-px bg-foreground top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <span
            className={`absolute w-px h-3 bg-foreground top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              isOpen ? 'rotate-90 opacity-0' : ''
            }`}
          />
        </span>
      </div>

      <div
        ref={expandRef}
        className="overflow-hidden"
        style={{ height: 0, transition: 'height 520ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        aria-hidden={!isOpen}
      >
        <div className="border-t border-rule py-10 pb-14">
          {/* Logo block — square ratio, larger, sharp (no rounded corners on the box) */}
          <div className="mb-8">
            {data.logo ? (
              <div className="r-card inline-flex items-center justify-center w-[140px] h-[140px] bg-background border border-rule p-5 overflow-hidden">
                <img
                  src={data.logo}
                  alt={brand.name}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain block"
                  style={{ borderRadius: 0 }}
                />
              </div>
            ) : (
              <div className="r-card inline-flex items-center justify-center w-[140px] h-[140px] bg-background border border-rule">
                <span className="font-sans text-[20px] font-bold tracking-[-0.01em] text-foreground text-center px-3">
                  {brand.name}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-x-[60px] gap-y-9">
            <div>
              {/* Sector tags inside the panel — same component, also visible on mobile */}
              <div className="flex flex-wrap gap-2 mb-5">
                {sectorTags.map((tag) => (
                  <span
                    key={tag}
                    className="r-tag inline-block font-mono text-[9px] tracking-[0.1em] uppercase px-[12px] py-[5px] border border-foreground text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="font-sans text-[14px] font-normal leading-[1.82] text-foreground mb-6 max-w-[440px]">
                {brand.desc}
              </p>
              <div className="flex flex-col gap-3">
                {data.url ? (
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener"
                    className="arrow-link text-[13px] w-fit"
                  >
                    {t('portfolio.visitBrand').replace(/\s*→\s*$/, '')}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-[10px] font-mono text-[9.5px] tracking-[0.15em] uppercase opacity-50 pointer-events-none">
                    {t('portfolio.inDevelopment')}
                  </span>
                )}
                {data.presentationUrl && (
                  <a
                    href={data.presentationUrl}
                    target="_blank"
                    rel="noopener"
                    className="arrow-link text-[13px] w-fit"
                  >
                    {t('portfolio.downloadPresentation').replace(/\s*→\s*$/, '')}
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

const STATUS_ORDER: Record<string, number> = { active: 0, dev: 1, exited: 2 };

export default function VorvnPortfolioSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Sort: Active → In Development → Exited (exited last)
  const orderedIndices = useMemo(() => {
    return BRANDS_DATA.map((b, i) => ({ i, status: b.status }))
      .sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99))
      .map((x) => x.i);
  }, []);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      id="portfolio"
      className="border-t border-rule"
      style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
    >
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
        {orderedIndices.map((brandIndex) => (
          <VorvnPortfolioItem
            key={brandIndex}
            brandIndex={brandIndex}
            isOpen={openIndex === brandIndex}
            onToggle={() => handleToggle(brandIndex)}
          />
        ))}
      </ul>
    </section>
  );
}
