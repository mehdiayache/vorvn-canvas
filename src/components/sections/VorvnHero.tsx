import { useTranslation } from 'react-i18next';
import EyeSvg from '../EyeSvg';
import GlobeSvg from '../GlobeSvg';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <header className="min-h-screen flex flex-col justify-end relative overflow-hidden" style={{ padding: `0 var(--gutter) clamp(52px, 8vh, 96px)` }}>
      <EyeSvg />

      <div
        className="relative z-[1] font-brand text-foreground leading-[0.88]"
        style={{
          fontSize: 'clamp(72px, 16vw, 248px)',
          opacity: 0,
          transform: 'translateY(22px)',
          animation: 'fadeUp 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards',
        }}
      >
        VORVN
      </div>

      <p
        className="relative z-[1] font-sans text-mid font-medium uppercase mt-[18px]"
        style={{
          fontSize: 'clamp(12px, 1.1vw, 16px)',
          letterSpacing: '0.02em',
          opacity: 0,
          animation: 'fadeIn 0.7s ease 0.55s forwards',
        }}
      >
        {t('hero.designLine')}
      </p>

      <div
        className="relative z-[1] h-px bg-rule my-7"
        style={{ opacity: 0, animation: 'fadeIn 0.6s ease 0.7s forwards' }}
      />

      <div
        className="relative z-[1] flex justify-between items-end gap-6"
        style={{ opacity: 0, animation: 'fadeUp 0.7s ease 0.85s forwards' }}
      >
        <p
          className="font-sans font-medium text-foreground"
          style={{ fontSize: 'clamp(17px, 1.85vw, 29px)', lineHeight: 1.46 }}
        >
          {t('hero.tagline').split('\n').map((line, i) => (
            <span key={i}>{line}{i === 0 && <br />}</span>
          ))}
        </p>

        <div className="hidden md:flex items-end gap-[10px] shrink-0 text-right">
          <div className="text-right">
            <div className="font-sans text-[12px] font-normal tracking-[0.02em] leading-[1.55] text-foreground">
              {t('hero.basedIn').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </div>
          </div>
          <GlobeSvg />
        </div>
      </div>

      <div
        className="relative z-[1] flex items-center gap-[14px] mt-11"
        style={{ opacity: 0, animation: 'fadeIn 0.5s ease 1.1s forwards' }}
      >
        <div className="w-10 h-px bg-dim" />
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-mid">
          {t('hero.scroll')}
        </span>
      </div>
    </header>
  );
}
