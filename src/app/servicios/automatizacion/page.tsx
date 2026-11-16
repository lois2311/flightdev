import ServicePage from '@/components/site/ServicePage';
import { AUTOMATION } from '@/content/services';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: AUTOMATION.seo.title, description: AUTOMATION.seo.description, path: AUTOMATION.path });

export default function Page() {
  return <ServicePage s={AUTOMATION} />;
}
