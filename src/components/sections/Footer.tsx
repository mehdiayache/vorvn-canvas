import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-rule grid grid-cols-1 lg:grid-cols-3 items-end gap-6 lg:gap-6" style={{ padding: '44px var(--gutter) 52px' }}>
      <div>
        <div className="font-brand text-[14px] tracking-[0.04em] text-foreground">VORVN</div>
        <div className="font-mono text-[9px] tracking-[0.06em] text-mid mt-[10px] leading-[1.65]">
          {t('footer.legal').split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </div>
      </div>
      <div className="flex gap-8 lg:justify-center">
        <a href="https://instagram.com/vorvn.company" target="_blank" rel="noopener" className="text-[11px] font-normal tracking-[0.1em] uppercase text-mid hover:text-foreground transition-colors duration-200">
          {t('footer.instagram')}
        </a>
        <a href="https://linkedin.com/company/vorvn" target="_blank" rel="noopener" className="text-[11px] font-normal tracking-[0.1em] uppercase text-mid hover:text-foreground transition-colors duration-200">
          {t('footer.linkedin')}
        </a>
        <a href="https://vorvn.com/careers" target="_blank" rel="noopener" className="text-[11px] font-normal tracking-[0.1em] uppercase text-mid hover:text-foreground transition-colors duration-200">
          {t('footer.careers')}
        </a>
      </div>
      <div className="lg:text-right">
        <a href="mailto:contact@vorvn.com" className="font-mono text-[11px] tracking-[0.06em] text-foreground block mb-[10px] hover:text-mid transition-colors duration-200">
          contact@vorvn.com
        </a>
        <div className="font-mono text-[9px] tracking-[0.14em] text-mid">
          {t('footer.geo')}
        </div>
      </div>
    </footer>
  );
}
