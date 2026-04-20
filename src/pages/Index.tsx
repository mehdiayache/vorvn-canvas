import { useScrollReveal } from '@/hooks/useScrollReveal';
import Nav from '@/components/Nav';
import SeoHead from '@/components/SeoHead';
import VorvnHero from '@/components/sections/VorvnHero';
import VorvnEntitySection from '@/components/sections/VorvnEntitySection';
import VorvnPresenceSection from '@/components/sections/VorvnPresenceSection';
import VorvnPortfolioSection from '@/components/sections/VorvnPortfolioSection';
import VorvnPrinciplesSection from '@/components/sections/VorvnPrinciplesSection';
import VorvnFounderSection from '@/components/sections/VorvnFounderSection';
import VorvnInvestorsSection from '@/components/sections/VorvnInvestorsSection';
import VorvnClosingSection from '@/components/sections/VorvnClosingSection';
import VorvnFooter from '@/components/sections/VorvnFooter';

export default function Index() {
  const scrollRef = useScrollReveal();

  return (
    <div ref={scrollRef}>
      <SeoHead page="home" pathSuffix="" />
      <Nav />
      <VorvnHero />
      <VorvnFounderSection />
      <VorvnEntitySection />
      <VorvnPresenceSection />
      <VorvnPortfolioSection />
      <VorvnPrinciplesSection />
      <VorvnInvestorsSection />
      <VorvnClosingSection />
      <VorvnFooter />
    </div>
  );
}
