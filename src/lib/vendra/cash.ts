// Ported from pos.pirotecnia/src/lib/cash.js and PaymentMethods.jsx (behavior must match the POS).
import type { PayMethod, Provider } from './format';

// Billetes colombianos con los que suele pagarse: sugerir "con cuánto paga" ahorra teclear el monto.
const BILL_STEPS = [5000, 10000, 20000, 50000, 100000];

/** Next multiple of each bill above the total, unique, ascending. The exact total is offered apart ("Exacto"). */
export function suggestCashAmounts(total: number, max = 3): number[] {
  const t = Math.round(Number(total) || 0);
  if (t <= 0) return [];
  const out = new Set<number>();
  for (const step of BILL_STEPS) {
    const v = Math.ceil(t / step) * step;
    if (v > t) out.add(v);
  }
  return [...out].sort((a, b) => a - b).slice(0, max);
}

/** Change for a typed cash amount; null while nothing (or nothing numeric) was typed — the field is optional. */
export function cashChange(total: number, cash: string): number | null {
  if (cash.trim() === '') return null;
  const n = Number(cash);
  return isNaN(n) ? null : n - total;
}

/** Same gates as the POS: a method is required, cash can't fall short, a transfer needs its wallet/bank. */
export function canPay(total: number, method: PayMethod | null, provider: Provider | null, cash: string): boolean {
  if (!method) return false;
  if (method === 'transfer') return !!provider;
  if (method === 'cash') return (cashChange(total, cash) ?? 0) >= 0;
  return true;
}
