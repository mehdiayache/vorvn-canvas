import { useTranslation } from 'react-i18next';

export default function SectionHeader({ numKey, labelKey }: { numKey: string; labelKey: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-baseline gap-[22px] reveal" style={{ marginBottom: 'clamp(48px, 7vh, 88px)' }}>
      <span className="font-mono text-[9px] tracking-[0.14em] text-mid">{t(numKey)}</span>
      <span className="font-brand text-[13px] tracking-[0.04em] text-foreground">{t(labelKey)}</span>
    </div>
  );
}
