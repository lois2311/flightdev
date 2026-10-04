import { Clock, CreditCard, Printer } from 'lucide-react';
import type { RefObject } from 'react';
import { CATEGORIES, PRODUCTS, type Invoice } from '../../lib/vendra/data';
import { formatCOP, payMethodLabel, type PayMethod, type Provider } from '../../lib/vendra/format';
import { canPay } from '../../lib/vendra/cash';
import PaymentMethods from './PaymentMethods';

const ago = (ms: number) => { const m = Math.max(1, Math.round((Date.now() - ms) / 60000)); return m < 60 ? `hace ${m} min` : `hace ${Math.round(m / 60)} h`; };

/** F2 Inventario — live stock after this session's invoices, with the POS status chips. */
export function InventoryScreen({ stockOf }: { stockOf: (productId: string) => number }) {
  return (
    <div className="min-h-[420px] overflow-x-auto p-4 md:p-5">
      <h2 className="eyebrow mb-3">Inventario · {PRODUCTS.length} productos</h2>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-xs text-muted"><th className="pb-2 font-medium">Producto</th><th className="hidden pb-2 font-medium sm:table-cell">Categoría</th><th className="pb-2 text-right font-medium">Existencia</th><th className="pb-2 pl-3 text-right font-medium">Estado</th></tr></thead>
        <tbody>
          {PRODUCTS.map(p => {
            const q = stockOf(p.id);
            const st = q <= 0 ? ['Sin existencia', 'bg-error/15 text-error border-error/20'] : q <= 5 ? ['Stock bajo', 'bg-warn/15 text-warn border-warn/20'] : ['Disponible', 'bg-voltaje/15 text-voltaje border-voltaje/20'];
            return (
              <tr key={p.id} className="border-t border-white/5">
                <td className="py-2.5 text-hueso">{p.name}</td>
                <td className="hidden py-2.5 text-muted sm:table-cell">{CATEGORIES.find(c => c.id === p.categoryId)?.name}</td>
                <td className="py-2.5 text-right font-mono tabular-nums text-hueso">{q}</td>
                <td className="py-2.5 pl-3 text-right"><span className={`rounded border px-2 py-0.5 text-[11px] font-medium ${st[1]}`}>{st[0]}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** F3 Cierre — la caja cobra por código. Keys: / código · 1 2 3 método · N D B billetera · F12 / Enter cobrar · P imprimir. */
export function CierreScreen({ pending, invoice, code, onCode, codeRef, method, onMethod, provider, onProvider, cash, onCash, onPay, paid, onPrint }: {
  pending: Invoice[]; invoice: Invoice | null; code: string; onCode: (c: string) => void; codeRef: RefObject<HTMLInputElement | null>;
  method: PayMethod | null; onMethod: (m: PayMethod) => void; provider: Provider | null; onProvider: (p: Provider) => void;
  cash: string; onCash: (v: string) => void; onPay: () => void; paid: Invoice | null; onPrint: () => void;
}) {
  const miss = code.length === 4 && !invoice && !paid;
  return (
    <div className="grid min-h-[420px] md:grid-cols-[18rem_1fr]">
      <div className="border-b border-white/5 p-4 md:border-b-0 md:border-r">
        <label htmlFor="vpos-code" className="eyebrow flex items-center gap-2">Código de factura <kbd className="kbd">/</kbd></label>
        <input id="vpos-code" ref={codeRef} data-code-input inputMode="numeric" maxLength={4} placeholder="____" value={code} autoComplete="off"
          onChange={e => onCode(e.target.value.replace(/\D/g, '').slice(0, 4))} className="input mt-2 text-center font-mono text-2xl font-bold tracking-[0.4em]" />
        {miss && <p role="alert" className="mt-2 text-xs text-error">No hay una factura pendiente con el código {code}.</p>}
        <h2 className="eyebrow mt-5 flex items-center gap-1.5"><Clock className="h-3 w-3" aria-hidden="true" /> Pendientes</h2>
        <ul className="mt-2 flex flex-col gap-1.5">
          {pending.length === 0 && <li className="text-xs text-muted">Sin facturas pendientes. Genera una en [F1].</li>}
          {pending.map(i => (
            <li key={i.code}>
              <button type="button" onClick={() => onCode(i.code)} aria-pressed={invoice?.code === i.code} className={`press flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left ${invoice?.code === i.code ? 'row-active border-white/10 bg-superficie' : 'border-white/5 bg-surf-400 hover:border-white/15'}`}>
                <span><span className="block font-mono text-sm font-semibold tabular-nums text-hueso">#{i.code}</span><span className="text-[11px] text-muted">{i.sellerName} · {ago(i.createdAt)}</span></span>
                <span className="font-mono text-sm tabular-nums text-hueso">{formatCOP(i.total)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col p-4 md:p-5">
        {paid ? (
          <div className="m-auto text-center">
            <p className="eyebrow">Venta cobrada</p>
            <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-voltaje">#{paid.code}</p>
            <p className="mt-1 text-sm text-muted">{formatCOP(paid.total)} · {payMethodLabel(paid.payMethod, paid.transferProvider)}{paid.received != null && paid.received > paid.total && ` · cambio ${formatCOP(paid.received - paid.total)}`}</p>
            <button type="button" onClick={onPrint} className="btn-primary mt-5 !w-auto px-6"><Printer className="h-4 w-4" aria-hidden="true" /> Imprimir recibo <kbd className="kbd kbd-on-fill">P</kbd></button>
          </div>
        ) : !invoice ? (
          <div className="m-auto max-w-xs text-center text-muted">
            <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-superficie"><CreditCard className="h-6 w-6" aria-hidden="true" /></span>
            <p className="text-sm font-medium text-slate-200">Busca una factura para cobrar.</p>
            <p className="mt-1 text-xs">Escribe el código o elige una pendiente.</p>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between"><h2 className="font-pos text-lg font-semibold text-hueso">Factura #{invoice.code}</h2><span className="text-xs text-muted">{invoice.sellerName}</span></div>
            <ul className="mt-3 divide-y divide-white/5 rounded-lg border border-white/5 bg-superficie/80">
              {invoice.items.map(it => (
                <li key={it.presentationId} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                  <span className="min-w-0 truncate text-hueso">{it.productName} <span className="text-muted">· {it.label} ×{it.qty}</span></span>
                  <span className="font-mono tabular-nums text-hueso">{formatCOP(it.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className="cq mt-4"><p className="eyebrow">Total a cobrar</p><p className="total-display mt-1 text-right">{formatCOP(invoice.total)}</p></div>
            <div className="mt-4"><PaymentMethods total={invoice.total} method={method} onMethod={onMethod} provider={provider} onProvider={onProvider} cash={cash} onCash={onCash} /></div>
            <button type="button" onClick={onPay} disabled={!canPay(invoice.total, method, provider, cash)} aria-keyshortcuts="F12" className="btn-primary mt-4">Cobrar <kbd className="kbd kbd-on-fill">F12</kbd></button>
          </>
        )}
      </div>
    </div>
  );
}
