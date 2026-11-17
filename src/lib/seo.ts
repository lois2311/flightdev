import type { Metadata } from 'next';
import { CONTACT_EMAIL, LOCALE, SITE_NAME, SITE_URL } from '@/config';

export const abs = (path: string) => SITE_URL + (path === '/' ? '' : path);
const OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: 'FlightDev | Plataformas SaaS y software empresarial en Colombia' };

/** Per-page metadata: unique title, description, canonical, Open Graph and Twitter card. */
export function pageMetadata({ title, description, path, type = 'website', absoluteTitle = false }: {
  title: string; description: string; path: string; type?: 'website' | 'article'; absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    // A page-level openGraph object replaces the root one, so the shared social card is re-attached here.
    openGraph: { title, description, url: path, type, siteName: SITE_NAME, locale: LOCALE, images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE.url] },
  };
}

// Schema.org builders. Only facts we can back up: no ratings, prices, addresses or reviews.
export const organizationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': SITE_URL + '/#organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: SITE_URL + '/favicon.svg',
  email: CONTACT_EMAIL,
  areaServed: { '@type': 'Country', name: 'Colombia' },
});

export const websiteLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': SITE_URL + '/#website',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'es-CO',
  publisher: { '@id': SITE_URL + '/#organization' },
});

export type Crumb = { name: string; path: string };
export const breadcrumbLd = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
});

export const softwareLd = ({ name, description, path, category }: { name: string; description: string; path: string; category: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name,
  description,
  url: abs(path),
  applicationCategory: category,
  operatingSystem: 'Web',
  inLanguage: 'es-CO',
  publisher: { '@id': SITE_URL + '/#organization' },
});

export const serviceLd = ({ name, description, path }: { name: string; description: string; path: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url: abs(path),
  provider: { '@id': SITE_URL + '/#organization' },
  areaServed: { '@type': 'Country', name: 'Colombia' },
});

export const articleLd = ({ title, description, path, published }: { title: string; description: string; path: string; published: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  url: abs(path),
  datePublished: published,
  inLanguage: 'es-CO',
  author: { '@id': SITE_URL + '/#organization' },
  publisher: { '@id': SITE_URL + '/#organization' },
  mainEntityOfPage: abs(path),
});

export const faqLd = (faqs: readonly { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
