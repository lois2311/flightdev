import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import ClientFx from '@/components/site/ClientFx';
import Analytics from '@/components/site/Analytics';
import JsonLd from '@/components/site/JsonLd';
import { LOCALE, SITE_NAME, SITE_URL } from '@/config';
import { organizationLd, websiteLd } from '@/lib/seo';
import './globals.css';

// One variable family for display (condensed, like chart and signage lettering) and body (normal width), plus a plain mono for instruments.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'FlightDev | Plataformas SaaS y software empresarial en Colombia', template: '%s | FlightDev' },
  description: 'FlightDev desarrolla plataformas SaaS y soluciones tecnológicas para empresas en Colombia: Vendra POS, FleetTrack Pro, software a la medida y automatización de procesos.',
  applicationName: SITE_NAME,
  icons: { icon: '/favicon.svg' },
  openGraph: { siteName: SITE_NAME, locale: LOCALE, type: 'website' },
  twitter: { card: 'summary_large_image' },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
};

export const viewport: Viewport = { themeColor: '#0A1428', colorScheme: 'dark' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${archivo.variable} ${mono.variable}`}>
      <body>
        <a href="#contenido" className="sr-only z-[70] rounded-[3px] bg-voltaje px-4 py-2 font-semibold text-noche focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Saltar al contenido</a>
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
        <ClientFx />
        <Analytics />
      </body>
    </html>
  );
}
