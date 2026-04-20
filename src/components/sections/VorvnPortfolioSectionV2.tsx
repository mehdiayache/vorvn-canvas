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
    const speed = 0.4;

    const step = () => {
      scrollPos += speed;
      if (scrollPos >= el.scrollWidth / 2) scrollPos = 0;
      el.scrollLeft = scrollPos;
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [images]);

  const loopImages = [...images, ...images];

  return (
    <div className="relative overflow-hidden h-full">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-hidden h-full"
        style={{ scrollBehavior: 'auto' }}
      >
        {loopImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            className="w-[240px] h-[240px] object-cover block shrink-0 grayscale-[18%] [html[data-theme='light']_&]:grayscale-[5%]"
          />
        ))}
      </div>
    </div>
  );
}

function SectorTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center font-mono text-[9px] tracking-[0.14em] uppercase px-[10px] py-[5px] border border-foreground/60 text-foreground">
      {children}
    </span>
  );
}

function GeoTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[6px] font-mono text-[9px] tracking-[0.14em] uppercase px-[10px] py-[5px] border border-dim text-mid">
      <span className="inline-block w-[4px] h-[4px] rounded-full bg-mid/70" />
      {children}
    </span>
  );
}

function VorvnPortfolioRow({
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

  const brand = t(`portfolio.v2.brands.${index}`, { returnObjects: true }) as {
    name: string;
    pitch: string;
    desc: string;
    statusLabel: string;
  };
  const data = BRANDS_DATA[index];
  const isActive = data.status === 'active';

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
    <li className="border-b border-rule first:border-t">
      {/* COLLAPSED ROW (always visible) */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); }
        }}
        className="cursor-pointer select-none py-6 hover:opacity-80 transition-opacity duration-[220ms]"
        style={{ minHeight: 44 }}
      >
        {/* Top line: dot + name + toggle */}
        <div className="flex items-center gap-4">
          <span
            className={`inline-block w-[8px] h-[8px] rounded-full shrink-0 ${
              isActive
                ? 'bg-green-500 animate-[pulse_2s_ease-in-out_infinite]'
                : 'border border-mid/60 bg-transparent'
            }`}
            aria-label={brand.statusLabel}
          />
          <span
            className="font-sans font-medium tracking-[0.02em] uppercase flex-1"
            style={{ fontSize: 'clamp(15px, 1.6vw, 22px)' }}
          >
            {brand.name}
          </span>
          <span className="w-5 h-5 relative shrink-0" aria-hidden>
            <span className="absolute w-[14px] h-px bg-mid top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <span
              className={`absolute w-px h-[14px] bg-mid top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isOpen ? 'rotate-90 opacity-0' : ''
              }`}
            />
          </span>
        </div>

        {/* Pitch line */}
        <div
          className="font-sans text-mid mt-2 ml-6"
          style={{ fontSize: 'clamp(12px, 1.1vw, 14px)' }}
        >
          {brand.pitch}
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-2 mt-4 ml-6">
          {data.sectorTags.map((tag) => (
            <SectorTag key={`s-${tag}`}>{tag}</SectorTag>
          ))}
          {data.geoTags.map((tag) => (
            <GeoTag key={`g-${tag}`}>{tag}</GeoTag>
          ))}
        </div>
      </div>

      {/* EXPANDED PANEL */}
      <div
        ref={expandRef}
        className="overflow-hidden"
        style={{ height: 0, transition: 'height 520ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        aria-hidden={!isOpen}
      >
        <div className="border-t border-rule py-10 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-x-[60px] gap-y-9">
            {/* LEFT — Brand intel */}
            <div>
              <div className="mb-7">
                {data.logo ? (
                  <div className="inline-block [html[data-theme='light']_&]:bg-[#181818] [html[data-theme='light']_&]:p-3 [html[data-theme='light']_&]:px-5">
                    <img
                      src={data.logo}
                      alt={brand.name}
                      loading="lazy"
                      className="h-14 max-w-[200px] object-contain object-left block"
                    />
                  </div>
                ) : (
                  <div className="font-sans text-[26px] font-medium tracking-[0.01em] text-foreground">
                    {brand.name}
                  </div>
                )}
              </div>

              <p
                className="font-sans font-normal leading-[1.78] text-mid mb-8"
                style={{ fontSize: 'clamp(13px, 1.05vw, 15px)' }}
              >
                {brand.desc}
              </p>

              {/* METRICS STRIP */}
              {isActive && data.metrics ? (
                <div className="grid grid-cols-3 gap-6 mb-8 border-y border-rule py-5">
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-mid mb-2">
                      {t('portfolio.v2.metricsLabels.status')}
                    </div>
                    <div className="font-sans font-medium text-foreground" style={{ fontSize: 'clamp(15px, 1.4vw, 20px)' }}>
                      {data.metrics.status}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-mid mb-2">
                      {t('portfolio.v2.metricsLabels.markets')}
                    </div>
                    <div className="font-sans font-medium text-foreground" style={{ fontSize: 'clamp(15px, 1.4vw, 20px)' }}>
                      {data.geoTags.join(' · ')}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-mid mb-2">
                      {t('portfolio.v2.metricsLabels.since')}
                    </div>
                    <div className="font-sans font-medium text-foreground" style={{ fontSize: 'clamp(15px, 1.4vw, 20px)' }}>
                      {data.metrics.since}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8 border-y border-rule py-5">
                  <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-mid mb-2">
                    {t('portfolio.v2.metricsLabels.timeline')}
                  </div>
                  <div className="font-sans font-medium text-foreground" style={{ fontSize: 'clamp(14px, 1.3vw, 18px)' }}>
                    {t('portfolio.v2.inDevelopmentSince', { timeline: data.devTimeline ?? '—' })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {data.url ? (
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-[10px] font-mono text-[10px] tracking-[0.16em] uppercase text-foreground border-b border-dim pb-[3px] hover:text-mid hover:border-transparent transition-colors duration-200 w-fit"
                  >
                    {t('portfolio.visitBrand')}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-[10px] font-mono text-[10px] tracking-[0.16em] uppercase opacity-35 pointer-events-none">
                    {t('portfolio.inDevelopment')}
                  </span>
                )}
                {data.presentationUrl && (
                  <a
                    href={data.presentationUrl}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-[10px] font-mono text-[10px] tracking-[0.16em] uppercase text-foreground border-b border-dim pb-[3px] hover:text-mid hover:border-transparent transition-colors duration-200 w-fit"
                  >
                    {t('portfolio.downloadPresentation')}
                  </a>
                )}
              </div>
            </div>

            {/* RIGHT — Visual */}
            <div className="min-h-[220px]">
              {/* Mobile: single static hero image */}
              <div className="md:hidden aspect-[4/3] overflow-hidden">
                <img
                  src={data.images[0]}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover block grayscale-[18%] [html[data-theme='light']_&]:grayscale-[5%]"
                />
              </div>
              {/* Desktop: scrolling gallery */}
              <div className="hidden md:block h-[240px]">
                {isOpen && <VorvnGallery images={data.images} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function VorvnPortfolioSectionV2() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const stats = useMemo(() => {
    const total = BRANDS_DATA.length;
    const active = BRANDS_DATA.filter((b) => b.status === 'active').length;
    const dev = total - active;
    const continents = new Set<string>();
    const continentMap: Record<string, string> = {
      USA: 'NA', UAE: 'AS', France: 'EU', EU: 'EU',
      Morocco: 'AF', Indonesia: 'AS', Global: 'GL',
    };
    BRANDS_DATA.forEach((b) =>
      b.geoTags.forEach((g) => continents.add(continentMap[g] ?? 'OT'))
    );
    return { total, active, dev, continents: Math.max(continents.size - (continents.has('GL') ? 1 : 0), 1) };
  }, []);

  return (
    <section
      id="portfolio"
      className="border-t border-rule"
      style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
    >
      <div className="reveal" style={{ marginBottom: 'clamp(40px, 6vh, 72px)' }}>
        <span className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground">
          {t('portfolio.label')}
        </span>
      </div>

      <p
        className="font-sans font-medium text-foreground max-w-[760px] reveal"
        style={{ fontSize: 'clamp(18px, 2vw, 28px)', lineHeight: 1.4, marginBottom: 'clamp(24px, 3vh, 40px)' }}
      >
        {t('portfolio.v2.intro')}
      </p>

      {/* Meta strip */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-14 reveal">
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-mid">
          {t('portfolio.v2.metaStrip.brands', { count: stats.total })}
        </span>
        <span className="text-mid/40">·</span>
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-mid">
          {t('portfolio.v2.metaStrip.active', { count: stats.active })}
        </span>
        <span className="text-mid/40">·</span>
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-mid">
          {t('portfolio.v2.metaStrip.dev', { count: stats.dev })}
        </span>
        <span className="text-mid/40">·</span>
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-mid">
          {t('portfolio.v2.metaStrip.continents', { count: stats.continents })}
        </span>
      </div>

      <ul className="list-none">
        {BRANDS_DATA.map((_, i) => (
          <VorvnPortfolioRow
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
