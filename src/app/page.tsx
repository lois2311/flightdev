import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import ProductScenes from '@/components/home/ProductScenes';
import EngineeringMatrix from '@/components/home/EngineeringMatrix';
import CaseChart from '@/components/home/CaseChart';
import MethodChecklist from '@/components/home/MethodChecklist';
import Manifesto from '@/components/home/Manifesto';
import Destination from '@/components/home/Destination';
import PostList from '@/components/blog/PostList';
import { POSTS } from '@/content/posts';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'FlightDev | Plataformas SaaS y software empresarial en Colombia',
  description: 'Software para operar comercios, flotas y procesos: Vendra POS, FleetTrack Pro, desarrollo de software y automatización de procesos en Colombia.',
  path: '/',
  absoluteTitle: true,
});

// A flight plan: origin (who we are), 001 what we make, 002 what we can build, 003 proof, 004 how we work, destination (talk to us).
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductScenes />
      <EngineeringMatrix />
      <CaseChart />
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
      <Destination />
    </>
  );
}
