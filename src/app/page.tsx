import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import FlightTour from '@/components/art/FlightTour';
import FlightLeg from '@/components/home/FlightLeg';
import ProductScenes from '@/components/home/ProductScenes';
import EngineeringMatrix from '@/components/home/EngineeringMatrix';
import CaseChart from '@/components/home/CaseChart';
import MethodChecklist from '@/components/home/MethodChecklist';
import Manifesto from '@/components/home/Manifesto';
import Destination from '@/components/home/Destination';
import PostList from '@/components/blog/PostList';
import { LEGS } from '@/content/flightplan';
import { POSTS } from '@/content/posts';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'FlightDev | Plataformas SaaS y software empresarial en Colombia',
  description: 'Software para operar comercios, flotas y procesos: Vendra POS, FleetTrack Pro, desarrollo de software y automatización de procesos en Colombia.',
  path: '/',
  absoluteTitle: true,
});

// A flight plan: origin (who we are), 001 what we make, 002 what we can build, 003 proof, 004 how we work, destination (talk to us).
// One fixed canvas (FlightTour) flies behind the whole page: the hero and the FlightLeg interludes are transparent windows onto it,
// every other section is opaque and covers it. The wrapper keeps all of them above the canvas. Each interlude has its own pose
// (where the plane flies, which side the lettering sits on, how tall the leg is) so the five do not read as one layout repeated.
export default function HomePage() {
  return (
    <>
      <FlightTour />
      <div className="relative z-[1]">
        <HeroSection />
        <FlightLeg next={LEGS.products} pose="high-right" />
        <ProductScenes />
        <FlightLeg next={LEGS.engineering} pose="low-left" />
        <EngineeringMatrix />
        <FlightLeg next={LEGS.case} pose="far" />
        <CaseChart />
        <FlightLeg next={LEGS.method} pose="close-low" />
        <MethodChecklist />
        <Manifesto />
        <section aria-labelledby="recursos" className="gutter border-t border-borde bg-noche py-24">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="recursos" className="h2 text-[clamp(1.9rem,3.6vw,3.2rem)]">Guías para decidir.</h2>
              <Link href="/blog" className="font-semibold text-cielo-claro underline underline-offset-4 hover:text-hueso">Todas las guías</Link>
            </div>
            <PostList posts={POSTS.slice(0, 3)} />
          </div>
        </section>
        <FlightLeg next={LEGS.destination} pose="arrival" kicker="APROXIMACIÓN FINAL" accent="voltaje" />
        <Destination />
      </div>
    </>
  );
}
