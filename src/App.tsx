import HeaderNav from './components/HeaderNav';
import HeroSection from './components/HeroSection';
import VendraSection from './components/VendraSection';
import AgCleanOpsSection from './components/AgCleanOpsSection';
import EvolutionSection from './components/EvolutionSection';
import ServicesSection from './components/ServicesSection';
import FooterSection from './components/FooterSection';
import { usePointerFx, useReveal } from './lib/fx';

export default function App() {
  useReveal();
  usePointerFx();
  return (
    <>
      <HeaderNav />
      <main>
        <HeroSection />
        <VendraSection />
        <AgCleanOpsSection />
        <EvolutionSection />
        <ServicesSection />
      </main>
      <FooterSection />
    </>
  );
}
