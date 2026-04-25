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

const BRANDS: Brand[] = [
  { status: 'active', name: 'Cook Warriors', sector: 'Consumer Goods · USA / UAE' },
  { status: 'dev',    name: 'MAQTOB',         sector: 'Modest Fashion · EU' },
  { status: 'dev',    name: 'xVoyager',       sector: 'Lifestyle · Global' },
  { status: 'dev',    name: 'Warung Marrakech', sector: 'F&B · MA / ID' },
  { status: 'pipeline', name: 'Pipeline' },
];

const OPERATOR_TAGS    = ['Holding', 'IP Core', 'Brand Strategy', 'Operations', 'Portfolio Control'];
const INCUBATOR_TAGS   = ['Brand Identity', 'Product Design', 'Visual Systems', 'Prototyping', 'No Distribution'];
const EXECUTION_TAGS   = ['Distribution', 'DTC', 'Amazon', 'Wholesale', 'Regional Partners', 'Post-Validation Only'];
const SUPPLY_NODES     = ['Production', 'Sourcing', 'Regional Export', 'Logistics'];

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

/* --------- brand cell --------- */

function BrandCell({ brand }: { brand: Brand }) {
  const isPipeline = brand.status === 'pipeline';
  const dotClass =
    brand.status === 'active' ? 'bg-status-active' :
    brand.status === 'dev'    ? 'bg-status-validation' :
                                'bg-foreground';

  return (
    <div
      className="r-card border border-foreground flex flex-col items-center text-center gap-2"
      style={{ padding: 'clamp(18px, 2.6vh, 26px) clamp(14px, 2vw, 22px)', minHeight: 130 }}
    >
      <div className="flex items-center gap-2 font-mono uppercase text-foreground"
           style={{ fontSize: 10, letterSpacing: '0.16em' }}>
        {isPipeline ? (
          <span aria-hidden="true">+</span>
        ) : (
          <span className={`inline-block ${dotClass}`} style={{ width: 7, height: 7, borderRadius: 9999 }} />
        )}
        {brand.status === 'active' ? 'Active' : brand.status === 'dev' ? 'Dev' : 'Open'}
      </div>
      <div
        className="font-sans font-medium text-foreground"
        style={{ fontSize: 'clamp(15px, 1.4vw, 18px)', letterSpacing: '-0.01em', lineHeight: 1.2 }}
      >
        {brand.name}
      </div>
      {brand.sector && (
        <div className="font-mono uppercase text-foreground"
             style={{ fontSize: 9, letterSpacing: '0.12em', lineHeight: 1.5 }}>
          {brand.sector}
        </div>
      )}
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

      {/* Schema spine */}
      <div className="mx-auto" style={{ maxWidth: 980 }}>
        {/* PANEL 1 — OPERATOR / VORVN */}
        <Panel delay="d1">
          <div className="flex flex-col items-center text-center">
            <RoleBadge>{t('operate.p1.role')}</RoleBadge>
            <h3
              className="font-sans font-semibold text-foreground mt-7"
              style={{ fontSize: 'clamp(56px, 11vw, 140px)', letterSpacing: '-0.04em', lineHeight: 0.92 }}
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
              className="font-sans font-semibold text-foreground mt-7"
              style={{ fontSize: 'clamp(36px, 7vw, 88px)', letterSpacing: '-0.035em', lineHeight: 0.95 }}
            >
              Aduh <span className="font-light">(Lagi)</span> Studio
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
            <div
              className="grid w-full mt-8 gap-3"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}
            >
              {BRANDS.map((b) => <BrandCell key={b.name} brand={b} />)}
            </div>
          </div>
        </Panel>

        <Connector label={t('operate.c3')} />

        {/* PANEL 4 — EXECUTION (PER BRAND) */}
        <Panel delay="d4">
          <div className="flex flex-col items-center text-center">
            <RoleBadge>{t('operate.p4.role')}</RoleBadge>
            <h3
              className="font-sans font-medium text-foreground mt-7"
              style={{ fontSize: 'clamp(28px, 5vw, 56px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
            >
              {t('operate.p4.title')}
            </h3>
            <p className="font-sans font-normal text-foreground mt-5 mx-auto"
               style={{ fontSize: 'clamp(13px, 1.1vw, 16px)', lineHeight: 1.75, maxWidth: 520 }}>
              {t('operate.p4.desc')}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-7">
              {EXECUTION_TAGS.map((tag) => <MonoTag key={tag}>{tag}</MonoTag>)}
            </div>
          </div>
        </Panel>

        <Connector label={t('operate.c4')} />

        {/* PANEL 5 — SUPPLY & EXPORT */}
        <Panel delay="d5">
          <div className="flex flex-col items-center text-center">
            <RoleBadge>{t('operate.p5.role')}</RoleBadge>
            <h3
              className="font-sans font-medium text-foreground mt-7"
              style={{ fontSize: 'clamp(24px, 4vw, 44px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              {t('operate.p5.title')}
            </h3>
            <p className="font-sans font-normal text-foreground mt-5 mx-auto"
               style={{ fontSize: 'clamp(13px, 1.1vw, 16px)', lineHeight: 1.75, maxWidth: 520 }}>
              {t('operate.p5.desc')}
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 mt-8">
              {SUPPLY_NODES.map((n) => (
                <div key={n} className="flex flex-col items-center gap-3">
                  {/* crosshair node — light UI version */}
                  <div className="relative border border-foreground"
                       style={{ width: 'clamp(38px, 5vw, 52px)', height: 'clamp(38px, 5vw, 52px)', borderRadius: 12 }}>
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
    </section>
  );
}
