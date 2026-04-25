import { useTranslation } from 'react-i18next';
import { BRANDS_DATA } from '@/data/brands';
import LoadingImage from '@/components/LoadingImage';

/**
 * VorvnOperateSection — "How We Operate"
 *
 * Five panels stacked along a continuous vertical spine:
 *   Operator (VORVN) → Incubator (Aduh (Lagi) Studio) →
 *   Independent Assets (portfolio logos) → Per Brand Execution → Supply
 *
 * Stays inside the design system: cream/black, pills, 1px black rules.
 * Brand wordmarks use their typeface — VORVN in Gasoek (font-brand),
 * Aduh (Lagi) Studio in Imbue (font-display) — at body-title scale.
 */

type Brand = { status: 'active' | 'dev' | 'pipeline'; name: string; sector?: string };

const OPERATOR_TAGS    = ['Holding', 'IP Core', 'Brand Strategy', 'Operations', 'Portfolio Control'];
const INCUBATOR_TAGS   = ['Brand Identity', 'Product Design', 'Visual Systems', 'Prototyping', 'No Distribution'];
const EXECUTION_TAGS   = ['Distribution', 'DTC', 'Amazon', 'Wholesale', 'Regional Partners', 'Post-Validation Only'];
const SUPPLY_NODES     = ['Production', 'Sourcing', 'Regional Export', 'Logistics'];

/* Logos sourced from the canonical portfolio data (no fictional brand cards). */
const PORTFOLIO_LOGOS = BRANDS_DATA
  .filter((b) => !!b.logo)
  .map((b) => ({ src: b.logo as string, status: b.status }));

/* --------- atoms --------- */

function RoleBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block r-pill border border-foreground font-mono uppercase text-foreground"
          style={{ fontSize: 11, letterSpacing: '0.22em', padding: '8px 18px' }}>
      {children}
    </span>
  );
}

function MonoTag({ children, solid = false }: { children: React.ReactNode; solid?: boolean }) {
  return (
    <span
      className={`inline-block r-tag border border-foreground font-mono uppercase ${solid ? 'bg-foreground text-background' : 'text-foreground'}`}
      style={{ fontSize: 10, letterSpacing: '0.16em', padding: '6px 14px' }}
    >
      {children}
    </span>
  );
}

/** Connector verb between panels: small label + descending caret. */
function Connector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-5">
      <span className="font-mono uppercase text-foreground"
            style={{ fontSize: 10, letterSpacing: '0.22em' }}>
        {label}
      </span>
      <svg width="10" height="22" viewBox="0 0 10 22" aria-hidden="true">
        <line x1="5" y1="0" x2="5" y2="16" stroke="currentColor" strokeWidth="1" />
        <polyline points="1,14 5,21 9,14" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

/** A panel — wraps content in a pill-rounded outlined card to match our radius system. */
function Panel({ children, delay = '' }: { children: React.ReactNode; delay?: string }) {
  return (
    <div
      className={`reveal ${delay} r-card border border-foreground bg-background`}
      style={{ padding: 'clamp(32px, 5vh, 64px) clamp(24px, 5vw, 64px)' }}
    >
      {children}
    </div>
  );
}

/* --------- portfolio logo cell (panel 3) --------- */

function PortfolioLogo({ src, status }: { src: string; status: string }) {
  return (
    <div
      className="flex items-center justify-center aspect-square"
      style={{ width: 'clamp(80px, 10vw, 120px)' }}
    >
      <img
        src={src}
        alt="Portfolio brand logo"
        loading="lazy"
        decoding="async"
        className={`block w-full h-full object-contain ${status !== 'active' ? 'opacity-60' : ''}`}
        style={{ background: 'transparent', mixBlendMode: 'multiply' }}
      />
    </div>
  );
}

/* --------- section --------- */

export default function VorvnOperateSection() {
  const { t } = useTranslation();

  return (
    <section
      id="operate"
      className="border-t border-rule"
      style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}
    >
      {/* Section label — matches sibling sections */}
      <div className="reveal flex items-end justify-between flex-wrap gap-4"
           style={{ marginBottom: 'clamp(48px, 7vh, 88px)' }}>
        <h2 className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground m-0">
          {t('operate.label')}
        </h2>
        <div className="font-mono uppercase text-foreground"
             style={{ fontSize: 10, letterSpacing: '0.18em', lineHeight: 1.6, textAlign: 'right' }}>
          {t('operate.kicker').split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>

      {/* Schema with continuous spine connecting all panels */}
      <div className="relative mx-auto" style={{ maxWidth: 980 }}>
        <span
          aria-hidden="true"
          className="absolute bg-foreground pointer-events-none"
          style={{ left: '50%', top: 0, bottom: 0, width: 1, transform: 'translateX(-0.5px)', zIndex: 0 }}
        />
        <div className="relative" style={{ zIndex: 1 }}>
        {/* PANEL 1 — OPERATOR / VORVN */}
        <Panel delay="d1">
          <div className="flex flex-col items-center text-center">
            <RoleBadge>{t('operate.p1.role')}</RoleBadge>
            <h3
              className="font-brand text-foreground mt-7"
              style={{ fontSize: 'clamp(28px, 5vw, 56px)', letterSpacing: '0.01em', lineHeight: 1.0 }}
            >
              {t('operate.p1.name')}
            </h3>
            <p className="font-sans font-normal text-foreground mt-5 mx-auto"
               style={{ fontSize: 'clamp(15px, 1.5vw, 20px)', lineHeight: 1.5, maxWidth: 540 }}>
              {t('operate.p1.tagline')}
            </p>
            <p className="font-sans font-normal text-foreground mt-5 mx-auto"
               style={{ fontSize: 'clamp(13px, 1.05vw, 15px)', lineHeight: 1.75, maxWidth: 520 }}>
              {t('operate.p1.desc')}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-7">
              {OPERATOR_TAGS.map((tag) => <MonoTag key={tag} solid>{tag}</MonoTag>)}
            </div>
          </div>
        </Panel>

        <Connector label={t('operate.c1')} />

        {/* PANEL 2 — INCUBATOR / ADUH (LAGI) STUDIO */}
        <Panel delay="d2">
          <div className="flex flex-col items-center text-center">
            <RoleBadge>{t('operate.p2.role')}</RoleBadge>
            <h3
              className="font-display font-medium text-foreground mt-7"
              style={{ fontSize: 'clamp(28px, 5vw, 56px)', letterSpacing: '-0.01em', lineHeight: 1.05 }}
            >
              Aduh (Lagi) Studio
            </h3>
            <p className="font-sans font-normal text-foreground mt-5 mx-auto"
               style={{ fontSize: 'clamp(15px, 1.5vw, 20px)', lineHeight: 1.5, maxWidth: 460 }}>
              {t('operate.p2.tagline')}
            </p>
            <p className="font-sans font-normal text-foreground mt-5 mx-auto"
               style={{ fontSize: 'clamp(13px, 1.05vw, 15px)', lineHeight: 1.78, maxWidth: 520 }}>
              {t('operate.p2.desc')}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-7">
              {INCUBATOR_TAGS.map((tag) => <MonoTag key={tag}>{tag}</MonoTag>)}
            </div>
          </div>
        </Panel>

        <Connector label={t('operate.c2')} />

        {/* PANEL 3 — INDEPENDENT ASSETS (BRANDS) */}
        <Panel delay="d3">
          <div className="flex flex-col items-center text-center">
            <RoleBadge>{t('operate.p3.role')}</RoleBadge>
            <h3
              className="font-sans font-medium text-foreground mt-7"
              style={{ fontSize: 'clamp(28px, 5vw, 56px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
            >
              {t('operate.p3.title')}
            </h3>
            <p className="font-sans font-normal text-foreground mt-5 mx-auto"
               style={{ fontSize: 'clamp(13px, 1.1vw, 16px)', lineHeight: 1.75, maxWidth: 560 }}>
              {t('operate.p3.desc')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 mt-8 w-full">
              {PORTFOLIO_LOGOS.map((logo, i) => (
                <PortfolioLogo key={i} src={logo.src} status={logo.status} />
              ))}
            </div>
          </div>
        </Panel>

        <Connector label={t('operate.c3')} />

        {/* PANELS 4 + 5 — EXECUTION (PER BRAND) & SUPPLY (BACKED BY) — side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PANEL 4 — EXECUTION */}
          <Panel delay="d4">
            <div className="flex flex-col items-center text-center h-full">
              <RoleBadge>{t('operate.p4.role')}</RoleBadge>
              <h3
                className="font-sans font-medium text-foreground mt-7"
                style={{ fontSize: 'clamp(22px, 3vw, 34px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}
              >
                {t('operate.p4.title')}
              </h3>
              <p className="font-sans font-normal text-foreground mt-5 mx-auto"
                 style={{ fontSize: 'clamp(13px, 1.05vw, 15px)', lineHeight: 1.75, maxWidth: 460 }}>
                {t('operate.p4.desc')}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-7">
                {EXECUTION_TAGS.map((tag) => <MonoTag key={tag}>{tag}</MonoTag>)}
              </div>
            </div>
          </Panel>

          {/* PANEL 5 — SUPPLY & EXPORT */}
          <Panel delay="d5">
            <div className="flex flex-col items-center text-center h-full">
              <RoleBadge>{t('operate.p5.role')}</RoleBadge>
              <h3
                className="font-sans font-medium text-foreground mt-7"
                style={{ fontSize: 'clamp(22px, 3vw, 34px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}
              >
                {t('operate.p5.title')}
              </h3>
              <p className="font-sans font-normal text-foreground mt-5 mx-auto"
                 style={{ fontSize: 'clamp(13px, 1.05vw, 15px)', lineHeight: 1.75, maxWidth: 460 }}>
                {t('operate.p5.desc')}
              </p>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-5 mt-7">
                {SUPPLY_NODES.map((n) => (
                  <div key={n} className="flex flex-col items-center gap-3">
                    <div className="relative border border-foreground"
                         style={{ width: 'clamp(36px, 4.5vw, 48px)', height: 'clamp(36px, 4.5vw, 48px)', borderRadius: 12 }}>
                      <span className="absolute bg-foreground"
                            style={{ left: '50%', top: 8, bottom: 8, width: 1, transform: 'translateX(-50%)' }} />
                      <span className="absolute bg-foreground"
                            style={{ top: '50%', left: 8, right: 8, height: 1, transform: 'translateY(-50%)' }} />
                    </div>
                    <span className="font-mono uppercase text-foreground text-center"
                          style={{ fontSize: 10, letterSpacing: '0.14em', maxWidth: 90, lineHeight: 1.5 }}>
                      {n}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        {/* STRUCTURE LOGIC */}
        <div className="reveal d6 mt-16 pt-12 border-t border-rule text-center">
          <div className="font-mono uppercase text-foreground"
               style={{ fontSize: 10, letterSpacing: '0.22em', marginBottom: 18 }}>
            {t('operate.logic.kicker')}
          </div>
          <div
            className="font-sans font-normal text-foreground mx-auto"
            style={{ fontSize: 'clamp(20px, 2.6vw, 36px)', letterSpacing: '-0.015em', lineHeight: 1.35, maxWidth: 820 }}
          >
            {(t('operate.logic.lines', { returnObjects: true }) as string[]).map((line, i) => (
              <div key={i} className={i < 3 ? 'font-medium' : 'text-foreground'} style={i < 3 ? {} : { color: 'hsl(var(--foreground))' }}>
                {line}
              </div>
            ))}
          </div>
          <p className="font-sans font-normal text-foreground mt-7 mx-auto"
             style={{ fontSize: 'clamp(14px, 1.15vw, 17px)', lineHeight: 1.78, maxWidth: 640 }}>
            {t('operate.logic.outcome')}
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
