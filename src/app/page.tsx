import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import DepartureBoard from '@/components/home/DepartureBoard';
import ProductPortfolio from '@/components/home/ProductPortfolio';
import Manifesto from '@/components/home/Manifesto';
import ProblemsSection from '@/components/home/ProblemsSection';
import CapabilitiesSection from '@/components/home/CapabilitiesSection';
import Differentiators from '@/components/home/Differentiators';
import EvolutionSection from '@/components/EvolutionSection';
import CaseTeaser from '@/components/home/CaseTeaser';
import PostList from '@/components/blog/PostList';
import CtaBand from '@/components/site/CtaBand';
import { POSTS } from '@/content/posts';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'FlightDev — Plataformas SaaS y software empresarial en Colombia',
  description: 'Construimos tecnología que transforma operaciones empresariales: Vendra POS, FleetTrack Pro, desarrollo de software a la medida y automatización de procesos en Colombia.',
  path: '/',
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DepartureBoard />
      <ProductPortfolio />
      <Manifesto />
      <ProblemsSection />
      <CapabilitiesSection />
      <Differentiators />
      <EvolutionSection />
      <CaseTeaser />
      <section aria-labelledby="recursos" className="gutter border-t border-borde bg-noche py-28">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="recursos" className="h2 text-[clamp(1.9rem,3.6vw,3.2rem)]">Guías para <span className="text-cielo">decidir mejor.</span></h2>
            <Link href="/blog" className="font-semibold text-cielo-claro underline-offset-4 hover:underline">Ir al blog →</Link>
          </div>
          <PostList posts={POSTS.slice(0, 3)} />
        </div>
      </section>
      <CtaBand title="¿Qué parte de tu operación quieres mejorar primero?" text="Cuéntanos tu caso. Te respondemos con una recomendación concreta: un producto, un desarrollo o ninguno de los dos." />
    </>
  );
}
