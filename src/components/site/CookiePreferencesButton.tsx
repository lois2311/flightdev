'use client';

import { CONSENT_RESET_EVENT } from './Analytics';

/** Lets visitors revoke or change analytics consent at any time. */
export default function CookiePreferencesButton() {
  const reset = () => {
    try { localStorage.removeItem('fd_cookie_consent'); } catch { /* storage blocked: nothing stored either */ }
    window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
  };
  return <button type="button" onClick={reset} className="cursor-pointer border-none bg-transparent p-0 text-inherit hover:text-hueso">Preferencias de cookies</button>;
}
