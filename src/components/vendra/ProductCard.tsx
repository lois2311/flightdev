import { CATEGORIES, type Product } from '../../lib/vendra/data';
import { productQtyInCart, type CartItem } from '../../lib/vendra/cart';
import { formatCOP } from '../../lib/vendra/format';

const LOW_STOCK = 5; // LOW_STOCK_FALLBACK in pos.pirotecnia/src/lib/stockStatus.js

// Counter-key feedback: Voltaje ring + a short press, only when the line really went into the ticket.
const flash = (el: HTMLElement) => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.animate([
    { transform: 'scale(.97)', boxShadow: '0 0 0 2px rgba(180,232,84,.9), 0 0 24px rgba(180,232,84,.35)' },
    { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(180,232,84,0), 0 0 0 rgba(180,232,84,0)' },
  ], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
};

/** Ported from pos.pirotecnia ProductCard: one button per presentation, qty badge, stock chip. */
export default function ProductCard({ product, stockLeft, items, onAdd }: {
  product: Product; stockLeft: number; items: CartItem[]; onAdd: (presentationId: string) => boolean;
}) {
  const category = CATEGORIES.find(c => c.id === product.categoryId)?.name;
  const out = stockLeft <= 0;
  const low = !out && stockLeft <= LOW_STOCK;
  const atCap = !out && productQtyInCart(items, product.id) >= stockLeft;

  return (
    <div className="flex flex-col rounded-xl border border-borde bg-superficie/70 p-3">
      <div className="mb-2.5 flex items-start justify-between gap-2 px-0.5">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-tight text-hueso">{product.name}</h3>
          {category && <span className="mt-0.5 block text-xs leading-4 text-muted">{category}</span>}
        </div>
        <span className={`shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums ${out ? 'border-error/30 bg-error/15 text-error' : low ? 'border-warn/30 bg-warn/15 text-warn' : 'border-voltaje/25 bg-voltaje/10 text-voltaje'}`}>
          {out ? 'Sin existencia' : `Quedan ${stockLeft}`}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {product.presentations.map(pres => {
          const qty = items.find(i => i.presentationId === pres.id)?.qty ?? 0;
          const active = qty > 0;
          return (
            <button
              key={pres.id}
              type="button"
              data-pres-button
              disabled={out}
              aria-disabled={atCap || undefined}
              aria-label={`${product.name}, ${pres.label}, ${formatCOP(pres.price)}${active ? `, ${qty} en el ticket` : ''}`}
              onClick={e => { if (onAdd(pres.id)) flash(e.currentTarget); }}
              className={`press group flex min-h-12 w-full items-center justify-between gap-2 rounded-lg border px-3 text-sm ${out
                ? 'cursor-not-allowed border-white/5 bg-surf-400/60 text-muted opacity-60'
                : active
                  ? 'cursor-pointer border-voltaje/60 bg-voltaje/15 text-voltaje-hover'
                  : 'cursor-pointer border-white/5 bg-surf-400 text-slate-300 hover:border-voltaje/40 hover:bg-surf-200 hover:text-hueso'} ${atCap ? 'opacity-70' : ''}`}
            >
              <span className="truncate">{pres.label}</span>
              <span className="flex shrink-0 items-center gap-2">
                <span className={`font-mono text-[15px] font-semibold tabular-nums ${active ? '' : 'text-hueso'}`}>{formatCOP(pres.price)}</span>
                <span className={`flex h-7 min-w-7 items-center justify-center rounded-md px-1 font-mono text-xs font-bold transition-colors ${active ? 'bg-voltaje text-noche' : out ? 'bg-surf-50 text-muted' : 'bg-surf-50 text-muted group-hover:bg-voltaje group-hover:text-noche'}`}>
                  {active ? `×${qty}` : out ? '–' : '+'}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {atCap && <p className="mt-2 text-[11px] text-warn">Las {stockLeft} que quedan ya están en el ticket.</p>}
    </div>
  );
}
