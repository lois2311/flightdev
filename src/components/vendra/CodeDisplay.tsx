import { Plus, Printer } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { LOCATION_NAME, type Invoice } from '../../lib/vendra/data';
import { formatCOP, payMethodLabel } from '../../lib/vendra/format';

/**
 * Ported from pos.pirotecnia CodeDisplay: the seller hands the customer this code; the cashier charges it in F3.
 * A `paid` invoice (charged from the F12 window) shows the cashier's result instead: method, change, print.
 */
export default function CodeDisplay({ invoice, onNewSale, onPrint }: { invoice: Invoice; onNewSale: () => void; onPrint: () => void }) {
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => { btn.current?.focus({ preventScroll: true }); }, []);
  const paid = invoice.status === 'paid';
  const change = paid && invoice.received != null ? invoice.received - invoice.total : 0;
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <p className="eyebrow mb-3 text-sm tracking-widest">{paid ? 'Venta cobrada' : 'Código de factura'}</p>
      <div className="vpos-glow mb-4 rounded-lg border-2 border-voltaje bg-voltaje/5 px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {invoice.code.split('').map((d, i) => (
            <span key={i} className="font-mono font-bold leading-none tabular-nums text-voltaje" style={{ fontSize: paid ? 'clamp(36px, 6vw, 56px)' : 'clamp(48px, 9vw, 88px)' }}>{d}</span>
          ))}
        </div>
      </div>
      {paid ? (
        <dl className="mb-6 grid w-full max-w-64 grid-cols-[1fr_auto] gap-y-1.5 text-sm">
          <dt className="text-left text-muted">Total</dt><dd className="font-mono font-bold tabular-nums text-hueso">{formatCOP(invoice.total)}</dd>
          <dt className="text-left text-muted">Pago</dt><dd className="text-hueso">{payMethodLabel(invoice.payMethod, invoice.transferProvider)}</dd>
          {change > 0 && <><dt className="text-left text-muted">Cambio</dt><dd className="font-mono font-bold tabular-nums text-voltaje">{formatCOP(change)}</dd></>}
        </dl>
      ) : (
        <>
          <p className="mb-5 max-w-xs text-xs text-muted">Dile este código al cliente para que pague en la caja.</p>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-sm text-muted">Total a cobrar</span>
            <span className="font-mono text-2xl font-bold tabular-nums text-hueso">{formatCOP(invoice.total)}</span>
          </div>
          <div className="mb-6 flex flex-col items-center gap-1 text-xs text-muted">
            <span>{LOCATION_NAME}</span>
            <span>Vendedor: {invoice.sellerName}</span>
          </div>
        </>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {paid && (
          <button type="button" onClick={onPrint} aria-keyshortcuts="P" className="press inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm text-slate-200 hover:border-white/25">
            <Printer className="h-4 w-4" aria-hidden="true" /> Imprimir ticket <kbd className="kbd">P</kbd>
          </button>
        )}
        <button ref={btn} type="button" onClick={onNewSale} aria-keyshortcuts="Enter Escape" className="btn-primary !w-auto px-6">
          <Plus className="h-4 w-4" aria-hidden="true" /> Nueva venta <kbd className="kbd kbd-on-fill">Enter</kbd>
        </button>
      </div>
    </div>
  );
}
