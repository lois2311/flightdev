import Link from 'next/link';
import JsonLd from './JsonLd';
import { breadcrumbLd, type Crumb } from '@/lib/seo';

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: 'Inicio', path: '/' }, ...items];
  return (
    <nav aria-label="Ruta de navegación" className="font-mono text-xs text-muted">
      <JsonLd data={breadcrumbLd(all)} />
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        {all.map((c, i) => (
          <li key={c.path} className="flex items-center gap-2">
            {i < all.length - 1
              ? <><Link href={c.path} className="hover:text-hueso">{c.name}</Link><span aria-hidden="true">/</span></>
              : <span aria-current="page" className="text-niebla">{c.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
