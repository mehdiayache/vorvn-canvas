import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import EyeSvg from '../EyeSvg';
import GlobeSvg from '../GlobeSvg';

function RotatingWord() {
  const { t } = useTranslation();
  const words = [
    t('hero.words.build'),
    t('hero.words.design'),
    t('hero.words.own'),
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [words.length]);

  return <>{words[index]}</>;
}

export default function Hero() {
  const { t } = useTranslation();

  return (
    <header className="min-h-screen flex flex-col justify-end relative overflow-hidden" style={{ padding: `0 var(--gutter) clamp(52px, 8vh, 96px)` }}>
      <EyeSvg />

      <div
        className="relative z-[1] font-sans font-medium text-foreground"
        style={{
          fontSize: 'clamp(36px, 6vw, 96px)',
          lineHeight: 1.1,
          opacity: 0,
          transform: 'translateY(22px)',
          animation: 'fadeUp 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards',
        }}
      >
        {t('hero.headline')}
      </div>

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
          {t('hero.taglinePre')} <RotatingWord /><br />
          {t('hero.taglinePost')}
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
    </header>
  );
}
