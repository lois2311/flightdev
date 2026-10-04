import { useEffect } from 'react';
import { startSmoothScroll } from './lib/motion';
import HeaderNav from './components/HeaderNav';
import HeroSection from './components/HeroSection';
import VendraSimulatorSection from './components/VendraSimulatorSection';
import EvolutionSection from './components/EvolutionSection';
import FlightSystemSection from './components/FlightSystemSection';
import FooterSection from './components/FooterSection';
import FlightGuideOverlay from './components/FlightGuideOverlay';

export default function App() {
  useEffect(() => startSmoothScroll(), []);
  return (
    <>
      <HeaderNav />
      <main>
        <HeroSection />
        <VendraSimulatorSection />
        <EvolutionSection />
        <FlightSystemSection />
      </main>
      <FooterSection />
      <FlightGuideOverlay />
    </>
  );
}
