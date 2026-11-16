import Link from 'next/link';
import { CATEGORIES, type Post } from '@/content/posts';

export const formatDate = (iso: string) => new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));

/** Editorial list (not cards): category, title, summary, date and reading time. */
export default function PostList({ posts, headingLevel = 'h3' }: { posts: Post[]; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  return (
    <ul className="m-0 list-none border-t border-borde p-0">
      {posts.map(p => (
        <li key={p.slug} className="border-b border-borde">
          <Link href={`/blog/${p.slug}`} className="group grid gap-3 py-8 md:grid-cols-[200px_minmax(0,1fr)_140px] md:gap-10">
            <span className="font-mono text-[11px] tracking-[.1em] text-cielo-claro">{CATEGORIES[p.category].toUpperCase()}</span>
            <div className="flex flex-col gap-2">
              <H className="m-0 font-display text-[clamp(1.2rem,2vw,1.5rem)] font-semibold leading-[1.25] text-hueso group-hover:text-cielo-claro">{p.title}</H>
              <p className="m-0 max-w-[70ch] leading-[1.6] text-muted">{p.description}</p>
            </div>
            <span className="tnum font-mono text-xs text-muted md:text-right"><time dateTime={p.published}>{formatDate(p.published)}</time> · {p.minutes} min</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
