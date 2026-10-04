import { Pause, ShoppingCart, X } from 'lucide-react';
import { cartTotal, type CartItem } from '../../lib/vendra/cart';
import { formatCOP } from '../../lib/vendra/format';

// The old shortcut strip above the console, now where it's needed: the empty ticket (pointer devices only, like .kbd).
const KEYS: [string, string][] = [['/', 'Buscar o escanear'], ['Enter', 'Agregar'], ['+ −', 'Cantidad'], ['↑ ↓', 'Cambiar línea'], ['F8', 'Pausar venta'], ['F12', 'Cobrar'], ['F2', 'Inventario'], ['F3', 'Cierre de caja']];

/**
 * Ported from pos.pirotecnia CartPanel. Keys (handled by the simulator, like the real window listener):
 * F12 cobra · Esc cancela la venta · + / − línea activa · Supr quita · ↑ ↓ cambia de línea · F8 pausa.
 */
export default function CartPanel({ items, activeId, onActive, onQty, onRemove, onCheckout, onCancel, onPark }: {
  items: CartItem[]; activeId: string | null; onActive: (id: string) => void;
  onQty: (id: string, qty: number) => void; onRemove: (id: string) => void;
  onCheckout: () => void; onCancel: () => void; onPark: () => void;
}) {
  if (!items.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center text-muted">
        <div>
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-borde bg-superficie"><ShoppingCart className="h-5 w-5" aria-hidden="true" /></span>
          <p className="text-sm font-medium text-slate-200">Listo para vender.</p>
          <p className="mt-1 text-xs">Toca un producto o escanéalo para empezar.</p>
        </div>
        <dl className="hidden w-full max-w-64 grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5 text-left text-xs any-pointer-fine:grid">
          {KEYS.map(([k, label]) => <div key={k} className="contents"><dt className="justify-self-end"><kbd className="kbd">{k}</kbd></dt><dd>{label}</dd></div>)}
        </dl>
      </div>
    );
  }
  const units = items.reduce((s, i) => s + i.qty, 0);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 border-b border-white/5 px-4 py-2">
        <h2 className="text-sm font-semibold text-hueso">Ticket <span className="font-mono font-normal text-muted">({items.length})</span></h2>
        <div className="-mr-2 flex items-center gap-1">
          <button type="button" onClick={onPark} aria-keyshortcuts="F8" aria-label="Pausar venta" title="Pausar venta: atiende a otro cliente y retómala después" className="press inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs text-muted hover:text-warn">
            <Pause className="h-4 w-4" aria-hidden="true" /> <kbd className="kbd">F8</kbd>
          </button>
          <button type="button" onClick={onCancel} aria-keyshortcuts="Escape" className="press inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs text-muted hover:text-error">
            Cancelar venta <kbd className="kbd">Esc</kbd>
          </button>
        </div>
      </div>

      <div data-lenis-prevent className="vpos-scroll flex min-h-0 flex-1 flex-col gap-2 px-3 py-3 lg:overflow-y-auto">
        {items.map(item => {
          const active = item.presentationId === activeId;
          return (
            <div key={item.presentationId} aria-current={active ? 'true' : undefined} onClick={() => onActive(item.presentationId)}
              className={`relative shrink-0 cursor-pointer rounded-lg border px-3 py-2.5 transition-colors ${active ? 'row-active border-white/10 bg-superficie' : 'border-white/5 bg-surf-400 hover:border-white/10'}`}>
              {active && <span key={item.qty} aria-hidden="true" className="vpos-flash pointer-events-none absolute inset-0 rounded-[inherit]" />}
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 text-sm font-medium leading-snug text-hueso">{item.productName}</p>
                <span className={`shrink-0 text-right font-mono text-sm font-semibold tabular-nums ${active ? 'text-voltaje' : 'text-hueso'}`}>{formatCOP(item.subtotal)}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted">{item.label} · <span className="font-mono tabular-nums">{formatCOP(item.price)}</span></p>
              <div className="mt-2 flex items-center gap-1">
                <div className="flex items-center rounded-lg border border-white/10 bg-superficie">
                  <button type="button" onClick={e => { e.stopPropagation(); onQty(item.presentationId, item.qty - 1); }} aria-label={`Quitar una unidad de ${item.productName}`} aria-keyshortcuts={active ? '-' : undefined}
                    className="press flex h-10 w-10 items-center justify-center rounded-l-lg text-lg text-slate-300 hover:bg-surf-50 hover:text-hueso">−</button>
                  <span className="min-w-8 px-1 text-center font-mono text-sm font-semibold tabular-nums text-hueso" aria-live="polite">{item.qty}</span>
                  <button type="button" onClick={e => { e.stopPropagation(); onQty(item.presentationId, item.qty + 1); }} aria-label={`Agregar una unidad de ${item.productName}`} aria-keyshortcuts={active ? '+' : undefined}
                    className="press flex h-10 w-10 items-center justify-center rounded-r-lg text-lg text-slate-300 hover:bg-voltaje/20 hover:text-voltaje-hover">+</button>
                </div>
                {active && <kbd className="kbd ml-1.5">±</kbd>}
                <div className="flex-1" />
                <button type="button" onClick={e => { e.stopPropagation(); onRemove(item.presentationId); }} aria-label={`Quitar ${item.productName}`} aria-keyshortcuts={active ? 'Delete' : undefined}
                  className={`press ml-3 flex min-h-10 min-w-10 shrink-0 items-center justify-center gap-1.5 rounded-lg text-muted hover:text-error ${active ? 'px-2' : ''}`}>
                  <X className="h-4 w-4" aria-hidden="true" />{active && <kbd className="kbd">Supr</kbd>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 space-y-3 border-t border-borde bg-noche/80 p-4">
        <div className="cq">
          <div className="flex items-baseline justify-between text-xs text-muted">
            <span className="eyebrow">Total</span>
            <span className="font-mono tabular-nums">{units} {units === 1 ? 'artículo' : 'artículos'} · {items.length} {items.length === 1 ? 'línea' : 'líneas'}</span>
          </div>
          <p data-glide-target className="total-display mt-1.5 text-right" aria-live="polite">{formatCOP(cartTotal(items))}<span className="ml-2 text-[0.35em] font-medium tracking-normal text-muted">COP</span></p>
        </div>
        <button type="button" onClick={onCheckout} aria-keyshortcuts="F12" className="btn-primary h-14 !text-base !font-bold">
          <kbd className="kbd kbd-on-fill">F12</kbd> Cobrar
        </button>
      </div>
    </div>
  );
}
