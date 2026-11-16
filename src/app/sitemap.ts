import type { MetadataRoute } from 'next';
import { POSTS } from '@/content/posts';
import { STATIC_ROUTES } from '@/content/routes';
import { abs } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES.map(r => ({ url: abs(r.path), priority: r.priority })),
    ...POSTS.map(p => ({ url: abs(`/blog/${p.slug}`), lastModified: p.published, priority: 0.6 })),
  ];
}
