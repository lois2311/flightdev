import PageHero from '@/components/site/PageHero';
import PostList from '@/components/blog/PostList';
import { POSTS } from '@/content/posts';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Blog: gestión empresarial, sistemas POS y flotas',
  description: 'Guías prácticas de FlightDev sobre sistemas POS, gestión de flotas, automatización y software empresarial para empresas en Colombia.',
  path: '/blog',
});

export default function BlogPage() {
  const posts = [...POSTS].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Blog', path: '/blog' }]}
        title={<>Guías para operar mejor.</>}
        lead="Artículos prácticos sobre puntos de venta, gestión de flotas, automatización y software empresarial. Escritos para quien toma la decisión."
      />
      <section aria-label="Artículos" className="gutter bg-noche pb-28">
        <div className="mx-auto max-w-[1280px]"><PostList posts={posts} headingLevel="h2" /></div>
      </section>
    </>
  );
}
