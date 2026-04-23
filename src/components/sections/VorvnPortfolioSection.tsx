import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BRANDS_DATA } from '@/data/brands';
import LoadingImage from '@/components/LoadingImage';

/**
 * VorvnGallery — manual filmstrip carousel.
 * - No autoplay.
 * - Shows ~2.5 slides at once (peek of next image), snaps one image per click.
 * - Infinite wrap. Prev / Next controls only. No counter.
 * - On-demand loading with breathing-eye loader.
 * - On mobile: ~1.25 slides visible (one full + peek).
 */
function VorvnGallery({ images, brandName }: { images: string[]; brandName: string }) {
  const { t } = useTranslation();
  const total = images.length;
  const [isDesktop, setIsDesktop] = useState(false);

  // Clone strategy: [...images, ...images, ...images]
  // Start in middle copy. After transition into edge zone, snap to equivalent middle slot.
  const cloned = useMemo(() => (total > 0 ? [...images, ...images, ...images] : []), [images, total]);
  const [pos, setPos] = useState(total); // start at first slide of middle copy
  const [animate, setAnimate] = useState(true);
  const [visibleSet, setVisibleSet] = useState<Set<number>>(() => new Set([total]));

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Reset position if image set changes
  useEffect(() => {
    setPos(total);
    setAnimate(true);
    setVisibleSet(new Set([total]));
  }, [total]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (total === 0) return;
      setAnimate(true);
      setPos((p) => {
        const next = p + dir;
        // Mark target as visible so its loader/image mounts now (eye shows during decode)
        setVisibleSet((prev) => {
          const s = new Set(prev);
          s.add(next);
          return s;
        });
        return next;
      });
    },
    [total],
  );

  // After a transition, if we are in an edge clone zone, snap silently back to the middle copy
  const handleTransitionEnd = useCallback(() => {
    if (total === 0) return;
    if (pos < total) {
      // snapped past the start — jump forward by `total`
      setAnimate(false);
      const newPos = pos + total;
      setPos(newPos);
      setVisibleSet((prev) => {
        const s = new Set(prev);
        s.add(newPos);
        return s;
      });
    } else if (pos >= total * 2) {
      // snapped past the end — jump back by `total`
      setAnimate(false);
      const newPos = pos - total;
      setPos(newPos);
      setVisibleSet((prev) => {
        const s = new Set(prev);
        s.add(newPos);
        return s;
      });
    }
  }, [pos, total]);

  // Re-enable animation on next frame after a silent snap
  useEffect(() => {
    if (animate) return;
    const r = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(r);
  }, [animate]);

  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [go]);

  if (total === 0) return null;

  // Slide width %: mobile 80% (1 + peek), desktop 45% (2 full + ~half visible).
  const slideBasis = isDesktop ? 45 : 80;

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      className="relative w-full focus:outline-none"
      aria-roledescription="carousel"
      aria-label={t('portfolio.galleryLabel', 'Brand gallery') as string}
    >
      <div className="relative w-full overflow-hidden">
        <div
          className="flex"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(-${pos * slideBasis}%)`,
            transition: animate ? 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          }}
        >
          {cloned.map((src, i) => {
            const isAdjacent = Math.abs(i - pos) <= 1;
            const shouldLoad = visibleSet.has(i) || isAdjacent;
            return (
              <div
                key={i}
                className="shrink-0 pr-3"
                style={{ flexBasis: `${slideBasis}%` }}
              >
                <div className="r-card relative aspect-square overflow-hidden bg-foreground/[0.08]">
                  {shouldLoad ? (
                    <LoadingImage
                      src={src}
                      alt={`${brandName} brand visual ${(i % total) + 1}`}
                      className="w-full h-full"
                      loaderSize={44}
                    />
                  ) : (
                    <span className="block w-full h-full" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Edge fade overlay — only on the right where the half-peek image sits */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 lg:w-28 z-10"
          style={{ background: 'linear-gradient(to left, hsl(var(--background)) 0%, hsl(var(--background) / 0) 100%)' }}
          aria-hidden
        />
      </div>

      {/* Controls — prev/next only, no counter */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          aria-label={t('portfolio.prev', 'Previous image') as string}
          onClick={() => go(-1)}
          className="r-pill inline-flex items-center justify-center w-10 h-10 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label={t('portfolio.next', 'Next image') as string}
          onClick={() => go(1)}
          className="r-pill inline-flex items-center justify-center w-10 h-10 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
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
  const isValidation = data.status === 'validation';
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

  // Status dot color — green for active, red for exited, orange for validation, neutral for dev.
  const dotColorClass = isActive
    ? 'bg-status-active'
    : isExited
      ? 'bg-status-exited'
      : isValidation
        ? 'bg-status-validation'
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
              isActive || isValidation ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''
            }`}
            style={
              isActive
                ? { boxShadow: '0 0 0 0 hsl(var(--status-active) / 0.6)' }
                : isValidation
                  ? { boxShadow: '0 0 0 0 hsl(var(--status-validation) / 0.6)' }
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
          {/* Logo — bare, no wrapper, no padding. Square 1:1 ratio. */}
          <div className="mb-8">
            {data.logo ? (
              <img
                src={data.logo}
                alt={brand.name}
                loading="lazy"
                decoding="async"
                className="block w-[160px] h-[160px] object-contain"
              />
            ) : (
              <div className="inline-flex items-center justify-center w-[160px] h-[160px]">
                <span className="font-sans text-[22px] font-bold tracking-[-0.01em] text-foreground text-center">
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
            {isOpen && <VorvnGallery images={data.images} brandName={brand.name} />}
          </div>
        </div>
      </div>
    </li>
  );
}

const STATUS_ORDER: Record<string, number> = { active: 0, validation: 1, dev: 2, exited: 3 };

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
