import ServicePage from '@/components/site/ServicePage';
import { SOFTWARE } from '@/content/services';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: SOFTWARE.seo.title, description: SOFTWARE.seo.description, path: SOFTWARE.path });

export default function Page() {
  return <ServicePage s={SOFTWARE} />;
}
