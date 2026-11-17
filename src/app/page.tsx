import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import ProductPortfolio from '@/components/home/ProductPortfolio';
import ProblemsSection from '@/components/home/ProblemsSection';
import CaseTeaser from '@/components/home/CaseTeaser';
import Manifesto from '@/components/home/Manifesto';
import PostList from '@/components/blog/PostList';
import CtaBand from '@/components/site/CtaBand';
import { POSTS } from '@/content/posts';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'FlightDev | Plataformas SaaS y software empresarial en Colombia',
  description: 'Software para operar comercios, flotas y procesos: Vendra POS, FleetTrack Pro, desarrollo de software y automatización de procesos en Colombia.',
  path: '/',
  absoluteTitle: true,
});

// Order follows the visitor's questions: what do you make, does it solve my problem, has it worked, why trust you, what to read, how to start.
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductPortfolio />
      <ProblemsSection />
      <CaseTeaser />
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
      <CtaBand title="¿Qué parte de tu operación quieres mejorar primero?" text="Cuéntanos tu caso. Te respondemos con una recomendación concreta: un producto, un desarrollo o ninguno de los dos." />
    </>
  );
}
