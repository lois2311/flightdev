// Thin GA4 wrapper. Params must never carry PII (no names, emails, phones, free text).
export type AnalyticsEvent = 'view_product' | 'click_demo' | 'click_contact' | 'form_start' | 'form_submit' | 'lead_created' | 'cta_click';
type Params = Record<string, string | number | undefined>;

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] }
}

export function track(event: AnalyticsEvent, params: Params = {}) {
  window.gtag?.('event', event, { page_path: location.pathname, ...params });
}

const CONSENT_KEY = 'fd_cookie_consent';
export type Consent = 'granted' | 'denied';

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(v: Consent) {
  try { localStorage.setItem(CONSENT_KEY, v); } catch { /* private mode: the choice lasts this page view only */ }
}
