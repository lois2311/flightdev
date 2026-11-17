'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { GA_ID } from '@/config';
import { readConsent, writeConsent, type Consent } from '@/lib/analytics';

export const CONSENT_RESET_EVENT = 'fd-consent-reset';

// GA honours this flag immediately, so revoking consent stops collection without waiting for a reload.
const setGaDisabled = (off: boolean) => { if (GA_ID) (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = off; };

function clearGaCookies() {
  const parts = location.hostname.split('.');
  const domains = ['', ...parts.map((_, i) => '; domain=.' + parts.slice(i).join('.'))];
  for (const name of document.cookie.split(';').map(c => c.split('=')[0].trim()).filter(n => n.startsWith('_ga'))) {
    for (const d of domains) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
  }
}

/** GA4 loads only when configured AND the visitor accepted analytics cookies. No GA id → no banner, no cookies. */
export default function Analytics() {
  const [consent, setConsent] = useState<Consent | null | 'loading'>('loading');

  useEffect(() => {
    setConsent(readConsent());
    const reset = () => { setGaDisabled(true); setConsent(null); };
    window.addEventListener(CONSENT_RESET_EVENT, reset);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, reset);
  }, []);

  if (!GA_ID || consent === 'loading') return null;
  const choose = (c: Consent) => {
    writeConsent(c);
    setGaDisabled(c === 'denied');
    if (c === 'denied' && window.gtag) {
      // GA was running in this page: drop its cookies and reload so its script is gone too.
      clearGaCookies();
      location.reload();
      return;
    }
    setConsent(c);
  };

  if (consent === 'granted') {
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(GA_ID)},{anonymize_ip:true});`}
        </Script>
      </>
    );
  }
  if (consent === 'denied') return null;

  return (
    <div role="dialog" aria-live="polite" aria-label="Preferencias de cookies"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-[720px] flex-wrap items-center gap-4 rounded-[3px] border border-borde bg-superficie/95 p-4 text-sm text-niebla shadow-[0_20px_50px_-20px_rgba(0,0,0,.7)] backdrop-blur sm:p-5">
      <p className="m-0 min-w-[240px] flex-1 leading-relaxed">
        Usamos cookies de analítica para entender qué páginas son útiles. No las activamos sin tu permiso.{' '}
        <Link href="/politica-de-cookies" className="text-cielo-claro underline underline-offset-2">Política de cookies</Link>
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={() => choose('denied')} className="min-h-11 cursor-pointer rounded-[3px] border border-borde px-4 font-semibold text-hueso hover:border-white/30">Rechazar</button>
        <button type="button" onClick={() => choose('granted')} className="min-h-11 cursor-pointer rounded-[3px] bg-cielo px-4 font-semibold text-noche hover:brightness-110">Aceptar</button>
      </div>
    </div>
  );
}
