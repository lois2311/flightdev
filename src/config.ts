// Set VITE_CONTACT_EMAIL at build time; the brief form opens a mailto: to this address.
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? 'hello@flightdev.dev';
