// Lead contract shared by the form (progressive validation) and the API route (authoritative validation).

export const PRODUCTS = [
  { value: 'vendra', label: 'Vendra POS' },
  { value: 'fleettrack', label: 'FleetTrack Pro' },
  { value: 'software', label: 'Desarrollo de software' },
  { value: 'automation', label: 'Automatización e integraciones' },
  { value: 'other', label: 'Otro / aún no lo sé' },
] as const;
export type Product = (typeof PRODUCTS)[number]['value'];

export const VENDRA_BUSINESS = ['Tienda o minimercado', 'Ferretería', 'Restaurante o cafetería', 'Distribuidora', 'Otro comercio'] as const;
export const FLEET_BUSINESS = ['Transporte especial', 'Transporte corporativo', 'Flota en plataformas de movilidad', 'Empresa con flota propia', 'Otro'] as const;
export const POS_RANGES = ['1', '2-3', '4-10', '11+'] as const;
export const FLEET_RANGES = ['1-5', '6-20', '21-50', '51+'] as const;

/** Bump when the privacy notice text changes; stored with every consent. */
export const CONSENT_VERSION = '2026-11';

export type Attribution = {
  source?: string; medium?: string; campaign?: string; content?: string; term?: string; landingPage?: string; referrer?: string;
};

export type LeadInput = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  position: string;
  product: Product;
  businessType: string;
  pointsOfSale: string;
  vehicles: string;
  drivers: string;
  message: string;
  consent: boolean;
  marketingOptIn: boolean;
  attribution: Attribution;
};

export type FieldErrors = Partial<Record<keyof LeadInput, string>>;
export type Validation = { ok: true; value: LeadInput } | { ok: false; errors: FieldErrors };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;
const ATTR_KEYS = ['source', 'medium', 'campaign', 'content', 'term', 'landingPage', 'referrer'] as const;

// Control characters (except tab/newline) and unpaired surrogates are stripped: Postgres rejects both in jsonb/text, and they carry no meaning in a form.
// eslint-disable-next-line no-control-regex
const str = (v: unknown) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\uD800-\uDFFF]/gu, '').trim() : '');
const oneOf = <T extends readonly string[]>(list: T, v: string) => v === '' || (list as readonly string[]).includes(v);

export function validateLead(raw: unknown): Validation {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const a = (r.attribution && typeof r.attribution === 'object' ? r.attribution : {}) as Record<string, unknown>;
  const v: LeadInput = {
    firstName: str(r.firstName),
    lastName: str(r.lastName),
    company: str(r.company),
    email: str(r.email).toLowerCase(),
    phone: str(r.phone),
    position: str(r.position),
    product: str(r.product) as Product,
    businessType: str(r.businessType),
    pointsOfSale: str(r.pointsOfSale),
    vehicles: str(r.vehicles),
    drivers: str(r.drivers),
    message: str(r.message),
    consent: r.consent === true,
    marketingOptIn: r.marketingOptIn === true,
    attribution: Object.fromEntries(ATTR_KEYS.map(k => [k, str(a[k]).slice(0, 300)]).filter(([, x]) => x)),
  };

  const e: FieldErrors = {};
  if (!v.firstName) e.firstName = 'Escribe tu nombre.';
  else if (v.firstName.length > 80) e.firstName = 'Máximo 80 caracteres.';
  if (v.lastName.length > 80) e.lastName = 'Máximo 80 caracteres.';
  if (!v.company) e.company = 'Escribe el nombre de tu empresa o negocio.';
  else if (v.company.length > 120) e.company = 'Máximo 120 caracteres.';
  if (!EMAIL_RE.test(v.email) || v.email.length > 160) e.email = 'Necesitamos un correo válido para responderte.';
  if (v.phone && !PHONE_RE.test(v.phone)) e.phone = 'Revisa el número (solo dígitos, espacios o +).';
  if (v.position.length > 80) e.position = 'Máximo 80 caracteres.';
  if (!PRODUCTS.some(p => p.value === v.product)) e.product = 'Elige qué te interesa.';
  const business = v.product === 'vendra' ? VENDRA_BUSINESS : v.product === 'fleettrack' ? FLEET_BUSINESS : null;
  if (business ? !oneOf(business, v.businessType) : v.businessType.length > 60) e.businessType = 'Elige una opción de la lista.';
  if (!oneOf(POS_RANGES, v.pointsOfSale)) e.pointsOfSale = 'Elige una opción de la lista.';
  if (!oneOf(FLEET_RANGES, v.vehicles)) e.vehicles = 'Elige una opción de la lista.';
  if (!oneOf(FLEET_RANGES, v.drivers)) e.drivers = 'Elige una opción de la lista.';
  const needsMessage = v.product === 'software' || v.product === 'automation' || v.product === 'other';
  if (needsMessage && v.message.length < 10) e.message = 'Cuéntanos un poco más (mínimo 10 caracteres).';
  if (v.message.length > 1500) e.message = 'Máximo 1.500 caracteres.';
  if (!v.consent) e.consent = 'Necesitamos tu autorización para tratar tus datos y responderte.';

  return Object.keys(e).length ? { ok: false, errors: e } : { ok: true, value: v };
}

/** Shape stored by public.create_lead (snake_case, product-specific details in jsonb). */
export function toRpcPayload(v: LeadInput, ipHash: string | null) {
  const details: Record<string, string> = {};
  if (v.product === 'vendra' && v.pointsOfSale) details.points_of_sale = v.pointsOfSale;
  if (v.product === 'fleettrack' && v.vehicles) details.vehicles = v.vehicles;
  if (v.product === 'fleettrack' && v.drivers) details.drivers = v.drivers;
  return {
    first_name: v.firstName, last_name: v.lastName, company: v.company, email: v.email, phone: v.phone, position: v.position,
    product_interest: v.product, business_type: v.businessType, details, message: v.message,
    consent: v.consent, consent_version: CONSENT_VERSION, marketing_opt_in: v.marketingOptIn,
    source: v.attribution.source ?? null, medium: v.attribution.medium ?? null, campaign: v.attribution.campaign ?? null,
    content: v.attribution.content ?? null, term: v.attribution.term ?? null,
    landing_page: v.attribution.landingPage ?? null, referrer: v.attribution.referrer ?? null,
    ip_hash: ipHash,
  };
}
