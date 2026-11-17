import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import JsonLd from '@/components/site/JsonLd';
import CtaBand from '@/components/site/CtaBand';
import PostList, { formatDate } from '@/components/blog/PostList';
import { CATEGORIES, POSTS, postBySlug, type Block } from '@/content/posts';
import { articleLd, pageMetadata } from '@/lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => POSTS.map(p => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = postBySlug((await params).slug);
  if (!post) return {};
  return pageMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}`, type: 'article' });
}

function render(b: Block, i: number) {
  if ('h2' in b) return <h2 key={i}>{b.h2}</h2>;
  if ('ul' in b) return <ul key={i}>{b.ul.map(li => <li key={li}>{li}</li>)}</ul>;
  return <p key={i}>{b.p}</p>;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = postBySlug((await params).slug);
  if (!post) notFound();
  const path = `/blog/${post.slug}`;
  const more = POSTS.filter(p => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <JsonLd data={articleLd({ title: post.title, description: post.description, path, published: post.published })} />
      <article className="gutter bg-noche pb-20 pt-36 sm:pt-40">
        <div className="mx-auto flex max-w-[760px] flex-col gap-8">
          <Breadcrumbs items={[{ name: 'Blog', path: '/blog' }, { name: post.title, path }]} />
          <header className="flex flex-col gap-5 border-b border-borde pb-8">
            <span className="font-mono text-[11px] tracking-[.12em] text-cielo-claro">{CATEGORIES[post.category].toUpperCase()}</span>
            <h1 className="m-0 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.08] tracking-[-.02em] text-hueso [text-wrap:balance]">{post.title}</h1>
            <p className="m-0 text-lg leading-[1.6] text-niebla">{post.description}</p>
            <span className="tnum font-mono text-xs text-muted">FlightDev · <time dateTime={post.published}>{formatDate(post.published)}</time> · {post.minutes} min de lectura</span>
          </header>
          <div className="prose-fd">{post.body.map(render)}</div>
          <Link href={post.related.href} className="w-fit rounded-[3px] border border-cielo/40 px-5 py-3 font-semibold text-cielo-claro hover:border-cielo">{post.related.label} →</Link>
        </div>
      </article>
      {more.length > 0 && (
        <section aria-labelledby="mas" className="gutter border-t border-borde bg-noche py-20">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
            <h2 id="mas" className="m-0 font-display text-2xl font-semibold text-hueso">Sigue leyendo</h2>
            <PostList posts={more} />
          </div>
        </section>
      )}
      <CtaBand title="¿Quieres aplicarlo en tu empresa?" text="Cuéntanos tu caso y te respondemos con una recomendación concreta." />
    </>
  );
}
