import type { Attribution } from './leads/schema';

const KEY = 'fd_attribution';
const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia)\./;

/** First touch of the session: UTM params win, otherwise the referrer decides source/medium. */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const q = new URLSearchParams(location.search);
    const ref = document.referrer ? new URL(document.referrer) : null;
    const external = ref && ref.host !== location.host ? ref : null;
    const a: Attribution = {
      source: q.get('utm_source') ?? external?.hostname ?? 'direct',
      medium: q.get('utm_medium') ?? (external ? (SEARCH.test(external.hostname) ? 'organic' : 'referral') : 'none'),
      campaign: q.get('utm_campaign') ?? undefined,
      content: q.get('utm_content') ?? undefined,
      term: q.get('utm_term') ?? undefined,
      landingPage: location.pathname,
      referrer: external ? external.origin + external.pathname : undefined,
    };
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch { /* storage blocked: the lead still goes out, just without attribution */ }
}

export function readAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? '{}') as Attribution;
  } catch {
    return {};
  }
}
