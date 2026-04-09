import { useTranslation } from 'react-i18next';

export default function SectionHeader({ labelKey }: { labelKey: string }) {
  const { t } = useTranslation();
  return (
    <div className="reveal" style={{ marginBottom: 'clamp(48px, 7vh, 88px)' }}>
      <span className="font-sans text-[18px] font-medium tracking-[0.01em] text-foreground">{t(labelKey)}</span>
    </div>
  );
}
