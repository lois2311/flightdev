// Ported from pos.pirotecnia/src/lib/format.js and search.js (behavior must match the POS).
export function formatCOP(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return '$0';
  const rounded = Math.round(amount);
  const body = new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(rounded));
  return (rounded < 0 ? '-' : '') + '$' + body;
}

export function formatDate(ms: number): string {
  return new Date(ms).toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}

export type PayMethod = 'cash' | 'transfer' | 'card';
export type Provider = 'nequi' | 'daviplata' | 'bancolombia';
export const TRANSFER_PROVIDERS: { id: Provider; label: string; key: string }[] = [
  { id: 'nequi', label: 'Nequi', key: 'N' },
  { id: 'daviplata', label: 'Daviplata', key: 'D' },
  { id: 'bancolombia', label: 'Bancolombia', key: 'B' },
];
export const METHODS: { id: PayMethod; label: string; key: string }[] = [
  { id: 'cash', label: 'Efectivo', key: '1' },
  { id: 'transfer', label: 'Transferencia', key: '2' },
  { id: 'card', label: 'Datáfono', key: '3' },
];

export function payMethodLabel(method?: PayMethod, provider?: Provider): string {
  const base = METHODS.find(m => m.id === method)?.label ?? '—';
  const p = TRANSFER_PROVIDERS.find(t => t.id === provider);
  return method === 'transfer' && p ? `${base} (${p.label})` : base;
}

export const normalizeText = (v: unknown) => String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** true if EVERY word of `query` appears in some text (accent/case-insensitive, any order). */
export function matchesQuery(texts: string[], query: string): boolean {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = texts.map(normalizeText).join(' ');
  return words.every(w => hay.includes(w));
}
