import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RTL_LANGUAGES } from '@/i18n';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Nav from '@/components/Nav';
import VorvnHero from '@/components/sections/VorvnHero';
import VorvnEntitySection from '@/components/sections/VorvnEntitySection';
import VorvnPresenceSection from '@/components/sections/VorvnPresenceSection';
import VorvnPortfolioSection from '@/components/sections/VorvnPortfolioSection';
import VorvnPrinciplesSection from '@/components/sections/VorvnPrinciplesSection';
import VorvnFounderSection from '@/components/sections/VorvnFounderSection';
import VorvnClosingSection from '@/components/sections/VorvnClosingSection';
import VorvnFooter from '@/components/sections/VorvnFooter';

export default function Index() {
  const { i18n } = useTranslation();
  const scrollRef = useScrollReveal();

  useEffect(() => {
    const dir = RTL_LANGUAGES.includes(i18n.language) ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
    if (!document.documentElement.dataset.theme) {
      document.documentElement.dataset.theme = 'dark';
    }
  }, [i18n.language]);

  return (
    <div ref={scrollRef}>
      <Nav />
      <VorvnHero />
      <VorvnEntitySection />
      <VorvnPresenceSection />
      <VorvnPortfolioSection />
      <VorvnPrinciplesSection />
      <VorvnFounderSection />
      <VorvnClosingSection />
      <VorvnFooter />
    </div>
  );
}
