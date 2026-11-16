import Link from 'next/link';
import PageHero from '@/components/site/PageHero';
import PostList from '@/components/blog/PostList';
import { CATEGORIES, POSTS, type Category } from '@/content/posts';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Centro de recursos',
  description: 'Recursos de FlightDev por tema: sistemas POS, gestión de flotas, automatización y tecnología empresarial. Guías, artículos y documentación de producto.',
  path: '/recursos',
});

export default function ResourcesPage() {
  // Only categories with published content are listed; empty ones stay hidden until they have articles.
  const groups = (Object.keys(CATEGORIES) as Category[])
    .map(c => ({ c, posts: POSTS.filter(p => p.category === c) }))
    .filter(g => g.posts.length > 0);

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Recursos', path: '/recursos' }]}
        title={<>Recursos para <span className="text-cielo">tomar decisiones.</span></>}
        lead="Guías organizadas por tema y accesos a la información de cada producto. Lo que publicamos responde preguntas reales de nuestros clientes."
      />
      <section aria-label="Recursos por tema" className="gutter bg-noche pb-24">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-16">
          {groups.map(g => (
            <div key={g.c} className="flex flex-col gap-6">
              <h2 className="m-0 font-display text-2xl font-semibold text-hueso">{CATEGORIES[g.c]}</h2>
              <PostList posts={g.posts} />
            </div>
          ))}
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ['/productos/vendra', 'Vendra POS', 'Funciones, preguntas frecuentes y demostración.'],
              ['/productos/fleettrack', 'FleetTrack Pro', 'Módulos, preguntas frecuentes y demostración.'],
            ].map(([href, t, d]) => (
              <Link key={href} href={href} className="flex flex-col gap-2 rounded-2xl border border-borde bg-superficie p-6 hover:border-cielo/45">
                <span className="font-mono text-[11px] tracking-[.12em] text-muted">PRODUCTO</span>
                <span className="font-display text-xl font-semibold text-hueso">{t}</span>
                <span className="text-niebla">{d}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
