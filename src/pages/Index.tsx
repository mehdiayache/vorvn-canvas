import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RTL_LANGUAGES } from '@/i18n';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/sections/Hero';
import EntitySection from '@/components/sections/EntitySection';
import PresenceSection from '@/components/sections/PresenceSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import PrinciplesSection from '@/components/sections/PrinciplesSection';
import FounderSection from '@/components/sections/FounderSection';
import ClosingSection from '@/components/sections/ClosingSection';
import Footer from '@/components/sections/Footer';

export default function Index() {
  const { i18n } = useTranslation();
  const scrollRef = useScrollReveal();

  useEffect(() => {
    const dir = RTL_LANGUAGES.includes(i18n.language) ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
    // Default to dark theme
    if (!document.documentElement.dataset.theme) {
      document.documentElement.dataset.theme = 'dark';
    }
  }, [i18n.language]);

  return (
    <div ref={scrollRef}>
      <Nav />
      <Hero />
      <EntitySection />
      <PresenceSection />
      <PortfolioSection />
      <PrinciplesSection />
      <FounderSection />
      <ClosingSection />
      <Footer />
    </div>
  );
}
