import { useEffect, useRef, type KeyboardEvent } from 'react';
import { Ticket } from 'lucide-react';
import PaymentMethods from './PaymentMethods';
import { LOCATION_NAME, REGISTER_NAME } from '../../lib/vendra/data';
import { canPay } from '../../lib/vendra/cash';
import { METHODS, TRANSFER_PROVIDERS, formatCOP, type PayMethod, type Provider } from '../../lib/vendra/format';

/**
 * F12 from the cart: the cashier step in one window (in the store, the cashier charges it in [F3] with the invoice code).
 * Keys: 1 2 3 método · N D B billetera · Enter cobra · Esc vuelve al ticket.
 */
export default function ChargeModal({ total, units, method, onMethod, provider, onProvider, cash, onCash, onConfirm, onInvoiceOnly, onClose }: {
  total: number; units: number; method: PayMethod | null; onMethod: (m: PayMethod) => void; provider: Provider | null; onProvider: (p: Provider) => void;
  cash: string; onCash: (v: string) => void; onConfirm: () => void; onInvoiceOnly: () => void; onClose: () => void;
}) {
  const dlg = useRef<HTMLDialogElement>(null);
  const cashRef = useRef<HTMLInputElement>(null);
  const ok = canPay(total, method, provider, cash);
  useEffect(() => {
    const d = dlg.current; if (!d) return;
    const trigger = document.activeElement as HTMLElement | null; // unmounting an open <dialog> skips the native focus return
    d.showModal();
    cashRef.current?.focus({ preventScroll: true });
    return () => { d.close(); if (trigger?.isConnected) trigger.focus({ preventScroll: true }); };
  }, []);

  const onKey = (e: KeyboardEvent<HTMLDialogElement>) => {
    const t = e.target as HTMLElement, typing = t.matches('input');
    // Enter charges from the field or a just-picked toggle (método, billetera, billete); action buttons keep native Enter.
    if (e.key === 'Enter' && !e.repeat && !t.closest('button:not([aria-pressed])')) { e.preventDefault(); if (ok) onConfirm(); return; }
    if (e.key === 'F12') { e.preventDefault(); if (ok && !e.repeat) onConfirm(); return; }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    const m = METHODS.find(x => x.key === e.key);
    if (m) { e.preventDefault(); onMethod(m.id); return; }
    const p = method === 'transfer' && TRANSFER_PROVIDERS.find(x => x.key === e.key.toUpperCase());
    if (p) { e.preventDefault(); onProvider(p.id); }
  };

  return (
    <dialog ref={dlg} aria-labelledby="vpos-charge-title" onKeyDown={onKey} onCancel={e => { e.preventDefault(); onClose(); }}
      className="vpos-scroll m-auto max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-borde bg-superficie p-0 text-hueso shadow-[0_32px_80px_-24px_rgba(0,0,0,.8)] backdrop:bg-noche/75 backdrop:backdrop-blur-sm">
      <div className="flex items-baseline justify-between gap-3 border-b border-white/5 px-5 py-4">
        <h3 id="vpos-charge-title" className="font-pos text-base font-semibold">Cobrar venta</h3>
        <span className="truncate text-xs text-muted">{REGISTER_NAME} · {LOCATION_NAME}</span>
      </div>
      <div className="space-y-4 px-5 py-4">
        <div className="cq flex items-end justify-between gap-3">
          <span className="eyebrow pb-1">Total · {units} {units === 1 ? 'artículo' : 'artículos'}</span>
          <p className="total-display">{formatCOP(total)}</p>
        </div>
        <PaymentMethods total={total} method={method} onMethod={onMethod} provider={provider} onProvider={onProvider} cash={cash} onCash={onCash} cashRef={cashRef} />
      </div>
      <div className="flex flex-col-reverse gap-2 border-t border-white/5 px-5 py-4 sm:flex-row sm:items-center">
        <button type="button" onClick={onInvoiceOnly} title="La caja la cobra en [F3] con el código de la factura"
          className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-slate-300 hover:border-white/25 hover:text-hueso">
          <Ticket className="h-4 w-4" aria-hidden="true" /> Solo generar factura
        </button>
        <button type="button" onClick={onConfirm} disabled={!ok} className="btn-primary h-12 flex-1 !text-base !font-bold">
          Confirmar cobro <kbd className="kbd kbd-on-fill">Enter</kbd>
        </button>
      </div>
    </dialog>
  );
}
