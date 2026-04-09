import { useTranslation } from 'react-i18next';
import SectionHeader from '../SectionHeader';

export default function PresenceSection() {
  const { t } = useTranslation();
  const locations = t('presence.locations', { returnObjects: true }) as Array<{
    region: string;
    city: string;
    entity: string;
    address: string;
    badge: string;
  }>;

  return (
    <section className="border-t border-rule" style={{ padding: 'clamp(80px, 12vh, 148px) var(--gutter)' }}>
      <SectionHeader labelKey="presence.label" />
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {locations.map((loc, i) => (
          <div
            key={i}
            className={`reveal d${i + 1} ${
              i === 0
                ? 'lg:pe-12'
                : 'pt-8 border-t border-rule lg:pt-0 lg:border-t-0 lg:ps-12 lg:border-s lg:border-rule'
            }`}
          >
            <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-mid mb-4">{loc.region}</div>
            <div className="font-sans font-medium tracking-[-0.02em] mb-[10px]" style={{ fontSize: 'clamp(18px, 1.9vw, 26px)' }}>
              {loc.city}
            </div>
            <div className="font-mono text-[9px] tracking-[0.1em] text-mid mb-[18px]">{loc.entity}</div>
            <div className="font-sans text-[13px] font-normal leading-[1.78] text-mid">
              {loc.address.split('\n').map((line, j) => (
                <span key={j}>{line}<br /></span>
              ))}
            </div>
            <span className="inline-block mt-6 font-mono text-[8px] tracking-[0.16em] uppercase text-mid border border-rule py-[5px] px-[11px]">
              {loc.badge}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
