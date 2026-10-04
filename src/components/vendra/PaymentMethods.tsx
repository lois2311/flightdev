import { useId, type RefObject } from 'react';
import { Wallet } from 'lucide-react';
import { METHODS, TRANSFER_PROVIDERS, formatCOP, type PayMethod, type Provider } from '../../lib/vendra/format';
import { cashChange, suggestCashAmounts } from '../../lib/vendra/cash';

/** Ported from pos.pirotecnia PaymentMethods: método (1 2 3) · billetera (N D B) · efectivo recibido con billetes rápidos y cambio. */
export default function PaymentMethods({ total, method, onMethod, provider, onProvider, cash, onCash, cashRef }: {
  total: number; method: PayMethod | null; onMethod: (m: PayMethod) => void; provider: Provider | null; onProvider: (p: Provider) => void;
  cash: string; onCash: (v: string) => void; cashRef?: RefObject<HTMLInputElement | null>;
}) {
  const fid = useId();
  const change = cashChange(total, cash);
  return (
    <div className="space-y-3">
      <p id={`${fid}-m`} className="eyebrow">Forma de pago</p>
      <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby={`${fid}-m`}>
        {METHODS.map(m => (
          <button key={m.id} type="button" aria-pressed={method === m.id} aria-keyshortcuts={m.key} onClick={() => onMethod(m.id)}
            className={`press flex min-h-12 items-center justify-center gap-2 rounded-lg border px-1 text-sm ${method === m.id ? 'row-active border-white/10 bg-voltaje/15 text-voltaje-hover' : 'border-white/10 bg-surf-400 text-slate-300 hover:border-white/20 hover:text-hueso'}`}>
            <kbd className="kbd">{m.key}</kbd>{m.label}
          </button>
        ))}
      </div>
      {method === 'transfer' && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Billetera o banco">
          {TRANSFER_PROVIDERS.map(t => (
            <button key={t.id} type="button" className="chip press" aria-pressed={provider === t.id} aria-keyshortcuts={t.key} onClick={() => onProvider(t.id)}><kbd className="kbd">{t.key}</kbd>{t.label}</button>
          ))}
        </div>
      )}
      {method === 'cash' && (
        <div>
          <label htmlFor={`${fid}-cash`} className="eyebrow mb-1 block">¿Con cuánto paga el cliente? (opcional)</label>
          <input id={`${fid}-cash`} ref={cashRef} data-cash-input type="number" inputMode="numeric" min="0" value={cash} placeholder={String(total)}
            onChange={e => onCash(e.target.value)} className="input text-right font-mono text-lg tabular-nums" />
          <div className="mt-2 grid grid-cols-4 gap-1.5" role="group" aria-label="Montos rápidos">
            {[total, ...suggestCashAmounts(total)].map((amount, i) => (
              <button key={amount} type="button" aria-pressed={Number(cash) === amount} onClick={() => onCash(String(amount))}
                className={`press min-h-10 whitespace-nowrap rounded-lg border px-1 font-mono text-xs font-medium tabular-nums ${Number(cash) === amount ? 'border-voltaje/60 bg-voltaje/15 text-voltaje-hover' : 'border-white/10 bg-surf-400 text-slate-300 hover:border-white/20 hover:text-hueso'}`}>
                {i === 0 ? 'Exacto' : formatCOP(amount)}
              </button>
            ))}
          </div>
          {change !== null && (change >= 0 ? (
            <div className="mt-2 flex items-center justify-between rounded-lg border border-voltaje/30 bg-voltaje/10 px-3 py-2" aria-live="polite">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-voltaje-hover"><Wallet className="h-3.5 w-3.5" aria-hidden="true" /> Cambio a devolver</span>
              <span className="font-mono text-2xl font-bold tabular-nums text-voltaje">{formatCOP(change)}</span>
            </div>
          ) : (
            <p className="mt-1.5 text-xs text-error" aria-live="polite">Faltan <span className="font-mono tabular-nums">{formatCOP(-change)}</span>. El efectivo no alcanza.</p>
          ))}
        </div>
      )}
    </div>
  );
}
