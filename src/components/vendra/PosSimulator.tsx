import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { MonitorSmartphone, Play, Printer, Search } from 'lucide-react';
import VendraLogo from './VendraLogo';
import ProductCard from './ProductCard';
import CartPanel from './CartPanel';
import CodeDisplay from './CodeDisplay';
import ChargeModal from './ChargeModal';
import ThermalReceipt, { type Paper } from './ThermalReceipt';
import { CierreScreen, InventoryScreen } from './Screens';
import { CATEGORIES, PRODUCTS, SELLER_NAME, seedInvoices, type Invoice } from '../../lib/vendra/data';
import { addItem, cartTotal, updateQty, type CartItem } from '../../lib/vendra/cart';
import { canPay } from '../../lib/vendra/cash';
import { TRANSFER_PROVIDERS, formatCOP, matchesQuery, METHODS, type PayMethod, type Provider } from '../../lib/vendra/format';

type View = 'cockpit' | 'receipt';
type Screen = 'F1' | 'F2' | 'F3';
// Module keys as in pos.pirotecnia Topbar: F1 Vender · F2 Inventario · F3 Cierre (cobro y cierre de caja).
const NAV: { key: Screen; label: string }[] = [{ key: 'F1', label: 'Vender' }, { key: 'F2', label: 'Inventario' }, { key: 'F3', label: 'Cierre' }];
const VIEWS = [['cockpit', 'Terminal en vivo', 'En vivo', MonitorSmartphone], ['receipt', 'Ticket térmico 1-bit', 'Ticket', Printer]] as const;
const SEED = seedInvoices(Date.now());
const SEED_CODES = new Set(SEED.map(i => i.code));
// The console opens mid-sale (2 × Volcán mágico + 1 × Fuente de chispas caja x6) so the total is live from the first frame.
const PREFILL: CartItem[] = (() => {
  const [v, f] = [PRODUCTS[0], PRODUCTS[3]];
  const once = addItem([], v, v.presentations[0], v.stock)!;
  return addItem(addItem(once, v, v.presentations[0], v.stock)!, f, f.presentations[1], f.stock)!;
})();
const isTyping = (t: EventTarget | null) => t instanceof HTMLElement && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable);

export default function PosSimulator() {
  const [view, setView] = useState<View>('cockpit');
  const [paper, setPaper] = useState<Paper>(58);
  const [screen, setScreen] = useState<Screen>('F1');
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>(PREFILL);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [parked, setParked] = useState<CartItem[][]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>(SEED);
  const [created, setCreated] = useState<Invoice | null>(null);
  const [hint, setHint] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [charging, setCharging] = useState(false);
  const [code, setCode] = useState('');
  const [method, setMethod] = useState<PayMethod | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [cash, setCash] = useState('');
  const [paid, setPaid] = useState<Invoice | null>(null);
  const [lastPaid, setLastPaid] = useState<Invoice | null>(null);
  const nextCode = useRef(4823);
  const hintTimer = useRef<number>(0);
  const root = useRef<HTMLDivElement>(null);
  const scanner = useRef<HTMLInputElement>(null);
  const codeInput = useRef<HTMLInputElement>(null);

  const say = (m: string) => { setHint(m); window.clearTimeout(hintTimer.current); hintTimer.current = window.setTimeout(() => setHint(''), 3500); };
  const sold = invoices.filter(i => !SEED_CODES.has(i.code) && i.status !== 'cancelled').flatMap(i => i.items);
  const stockOf = (id: string) => PRODUCTS.find(p => p.id === id)!.stock - sold.filter(i => i.productId === id).reduce((s, i) => s + i.qty, 0);
  const active = cart.some(i => i.presentationId === activeId) ? activeId : cart[cart.length - 1]?.presentationId ?? null;
  const total = cartTotal(cart);

  const filtered = useMemo(() => PRODUCTS.filter(p => (!cat || p.categoryId === cat)
    && matchesQuery([p.name, CATEGORIES.find(c => c.id === p.categoryId)?.name ?? '', ...p.presentations.map(x => x.label)], query)), [cat, query]);
  const flat = filtered.flatMap(p => p.presentations.map(pres => ({ p, pres })));
  const scanMatch = query.trim() && flat.length === 1 ? flat[0] : null;

  const add = (productId: string, presId: string) => {
    const p = PRODUCTS.find(x => x.id === productId)!, pres = p.presentations.find(x => x.id === presId)!;
    const left = stockOf(p.id);
    const next = addItem(cart, p, pres, left);
    if (!next) { say(left <= 0 ? `Sin existencia. Quedan 0 de ${p.name}.` : `Quedan ${left} de ${p.name} y ya están en el ticket.`); return false; }
    setCart(next); setActiveId(presId); setCreated(null); return true;
  };
  const setQty = (id: string, qty: number) => { setCart(c => updateQty(c, id, qty, stockOf)); setActiveId(id); };
  const resetPay = () => { setMethod(null); setProvider(null); setCash(''); };
  const received = () => (method === 'cash' && cash.trim() !== '' && !isNaN(Number(cash)) ? Number(cash) : undefined);
  const newInvoice = (status: Invoice['status']): Invoice => ({ code: String(nextCode.current++), items: cart, total, status, createdAt: Date.now(), sellerName: SELLER_NAME });
  const checkout = () => {
    if (!cart.length) return;
    const inv = newInvoice('pending');
    setInvoices(l => [inv, ...l]); setCreated(inv); setCart([]); setActiveId(null); setCharging(false);
  };
  const openCharge = () => { if (!cart.length) return; resetPay(); setMethod('cash'); setCharging(true); };
  const charge = () => {
    if (!cart.length || !canPay(total, method, provider, cash)) return;
    const done: Invoice = { ...newInvoice('paid'), payMethod: method!, transferProvider: method === 'transfer' ? provider ?? undefined : undefined, received: received() };
    setInvoices(l => [done, ...l]); setCreated(done); setLastPaid(done); setCart([]); setActiveId(null); setCharging(false); resetPay();
  };
  const newSale = () => { setCreated(null); requestAnimationFrame(() => scanner.current?.focus({ preventScroll: true })); };
  const park = () => {
    if (cart.length) { setParked(p => [cart, ...p]); say(`Venta en pausa (${cart.length} ${cart.length === 1 ? 'producto' : 'productos'}). F8 la retoma.`); setCart([]); }
    else if (parked.length) resume(0);
  };
  const resume = (i: number) => {
    const entry = parked[i]; if (!entry) return;
    setParked(p => { const rest = p.filter((_, k) => k !== i); return cart.length ? [cart, ...rest] : rest; });
    setCart(entry);
  };
  const go = (s: Screen) => { setScreen(s); setView('cockpit'); };

  const pendingList = invoices.filter(i => i.status === 'pending');
  const payInvoice = code.length === 4 ? pendingList.find(i => i.code === code) ?? null : null;
  const pay = () => {
    if (!payInvoice || !canPay(payInvoice.total, method, provider, cash)) return;
    const done: Invoice = { ...payInvoice, status: 'paid', payMethod: method!, transferProvider: method === 'transfer' ? provider ?? undefined : undefined, received: received() };
    setInvoices(l => l.map(i => (i.code === done.code ? done : i))); setPaid(done); setLastPaid(done);
    setCode(''); resetPay();
  };

  // "/" from anywhere on the page while the console is on screen: no click-inside needed first.
  useEffect(() => {
    const onDoc = (e: globalThis.KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target) || !root.current || root.current.contains(e.target as Node)) return;
      const r = root.current.getBoundingClientRect(), el = (screen === 'F3' ? codeInput : scanner).current;
      if (!el || r.bottom < innerHeight * 0.3 || r.top > innerHeight * 0.7) return;
      e.preventDefault(); el.focus({ preventScroll: true });
    };
    document.addEventListener('keydown', onDoc);
    return () => document.removeEventListener('keydown', onDoc);
  }, [screen]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented || confirm || charging) return;
    const t = e.target as HTMLElement, typing = isTyping(t);
    const nav = NAV.find(n => n.key === e.key);
    if (nav) { e.preventDefault(); go(nav.key); return; }
    if (view === 'receipt') return;

    if (screen === 'F1') {
      if (created) {
        if (e.key === 'Escape') { e.preventDefault(); newSale(); }
        else if (e.key.toLowerCase() === 'p' && created.status === 'paid' && !typing) { e.preventDefault(); setView('receipt'); }
        return;
      }
      if (e.key === '/' && !typing) { e.preventDefault(); scanner.current?.focus(); return; }
      if (e.key === 'F8') { e.preventDefault(); if (!e.repeat) park(); return; }
      if (e.key === 'F12') { e.preventDefault(); if (!e.repeat) openCharge(); return; }
      if (e.key === 'Escape' && cart.length) { if (typing) return; e.preventDefault(); setConfirm(true); return; }
      const emptyScanner = t.matches('[data-scanner-input]') && !(t as HTMLInputElement).value;
      if (!cart.length || (typing && !emptyScanner)) return;
      const idx = cart.findIndex(i => i.presentationId === active), cur = cart[idx];
      if (!cur) return;
      if (e.key === '+' || e.key === '-') { e.preventDefault(); setQty(cur.presentationId, cur.qty + (e.key === '+' ? 1 : -1)); }
      else if (e.key === 'Delete') { e.preventDefault(); setCart(c => c.filter(i => i !== cur)); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); setActiveId(cart[Math.min(cart.length - 1, Math.max(0, idx + (e.key === 'ArrowUp' ? -1 : 1)))].presentationId); }
    } else if (screen === 'F3') {
      if (e.key === '/' && !typing) { e.preventDefault(); codeInput.current?.focus(); return; }
      if (paid) { if (e.key.toLowerCase() === 'p' && !typing) { e.preventDefault(); setView('receipt'); } return; }
      if (!payInvoice) return;
      if (e.key === 'F12') { e.preventDefault(); if (!e.repeat) pay(); return; }
      if (e.key === 'Enter' && !e.repeat && !t.closest('button, a, textarea, select, [data-code-input]')) { e.preventDefault(); pay(); return; }
      if (typing && !(t.matches('[data-code-input]') && code.length === 4)) return;
      const m = METHODS.find(x => x.key === e.key);
      if (m) { e.preventDefault(); setMethod(m.id); if (typing) root.current?.focus({ preventScroll: true }); return; }
      const prov = method === 'transfer' && TRANSFER_PROVIDERS.find(x => x.key === e.key.toUpperCase());
      if (prov) { e.preventDefault(); setProvider(prov.id); }
    }
  };

  const onScanKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && query.trim()) {
      const first = root.current?.querySelector<HTMLElement>('[data-product-grid] [data-pres-button]:not(:disabled)');
      if (first) { e.preventDefault(); first.focus(); }
      return;
    }
    if (e.key !== 'Enter' || e.repeat) return;
    e.preventDefault();
    if (!scanMatch) { if (query.trim() && flat.length > 1) say(`Hay ${flat.length} coincidencias. Sigue escribiendo o elige con ↓.`); return; }
    if (add(scanMatch.p.id, scanMatch.pres.id)) setQuery('');
  };

  const sample = useMemo<Invoice>(() => ({ ...SEED[0], status: 'paid', payMethod: 'cash', createdAt: Date.now() }), []);
  const receiptInvoice = lastPaid ?? sample;
  const selling = screen === 'F1' && view === 'cockpit';

  return (
    <div ref={root} tabIndex={0} onKeyDown={onKey} aria-label="Simulador de Vendra POS"
      className="vpos glass-vuelo relative flex flex-col overflow-hidden rounded-2xl outline-none focus-visible:ring-1 focus-visible:ring-voltaje/50 lg:h-[640px]">
      {/* One bar: brand + modules (pos.pirotecnia Topbar) · scanner · view switch. Shortcuts live on the controls themselves. */}
      <header className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-borde bg-surf-400/70 px-3 py-2 sm:px-4 lg:h-14 lg:flex-nowrap lg:py-0">
        <VendraLogo variant="horizontal" size={22} title="vendra." className="hidden shrink-0 sm:block" />
        <VendraLogo variant="symbol" size={22} title="vendra." className="shrink-0 sm:hidden" />
        <nav aria-label="Módulos" className="flex items-stretch gap-0.5 self-stretch">
          {NAV.map(n => {
            const on = screen === n.key && view === 'cockpit';
            return (
              <button key={n.key} type="button" onClick={() => go(n.key)} aria-current={on ? 'page' : undefined} aria-keyshortcuts={n.key}
                className={`relative inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-medium transition-colors ${on ? 'text-hueso' : 'text-muted hover:text-hueso'}`}>
                <kbd className={`kbd max-sm:hidden ${on ? '!border-voltaje/50 !text-voltaje' : ''}`}>{n.key}</kbd>{n.label}
                {on && <span aria-hidden="true" className="absolute inset-x-1.5 bottom-0 h-0.5 rounded-full bg-voltaje" />}
              </button>
            );
          })}
        </nav>
        <div className="flex min-w-0 basis-full items-center gap-2 lg:basis-auto lg:flex-1">
          {selling ? (
            <div className="relative min-w-0 flex-1 lg:mx-auto lg:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input ref={scanner} data-scanner-input type="search" placeholder="> escanea o busca" aria-label="Buscar producto: escanea o escribe" aria-keyshortcuts="/"
                value={query} onChange={e => setQuery(e.target.value)} onKeyDown={onScanKey} className="input !min-h-10 pl-9 pr-10 text-sm" />
              {!query && <kbd className="kbd pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">/</kbd>}
            </div>
          ) : <span className="flex-1" />}
          <div className="glass-vuelo flex shrink-0 rounded-lg p-0.5 font-mono text-xs" role="group" aria-label="Vista del simulador">
            {VIEWS.map(([v, label, short, Icon]) => (
              <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v} aria-label={label} title={label}
                className={`flex min-h-9 min-w-9 items-center justify-center gap-1.5 rounded-md px-2.5 transition-colors ${view === v ? 'bg-hueso text-noche' : 'text-hueso/75 hover:text-hueso'}`}>
                <Icon size={14} aria-hidden="true" /><span className="hidden sm:inline xl:hidden">{short}</span><span className="hidden xl:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {view === 'receipt' ? (
        <div data-lenis-prevent className="vpos-scroll flex min-h-0 flex-1 bg-surf-600/60 px-4 py-6 lg:overflow-y-auto">
          <div className="m-auto flex flex-col items-center gap-4">
            <div className="glass-vuelo flex rounded-lg p-0.5 font-mono text-xs" role="group" aria-label="Ancho del papel">
              {([58, 80] as Paper[]).map(w => (
                <button key={w} type="button" aria-pressed={paper === w} onClick={() => setPaper(w)} className={`min-h-9 rounded-md px-3 transition-colors ${paper === w ? 'bg-hueso text-noche' : 'text-hueso/75 hover:text-hueso'}`}>{w} mm</button>
              ))}
            </div>
            <ThermalReceipt invoice={receiptInvoice} paper={paper} />
            <p className="max-w-sm text-center font-mono text-[11px] leading-relaxed text-muted">
              {lastPaid ? `Ticket de la factura #${lastPaid.code}, recién cobrada.` : 'Ejemplo: factura #4821. Cobra una venta con [F12] y verás la tuya.'} Papel {paper} mm · 203 ppp · logotipo 40 mm (320 puntos), solo negro.
            </p>
          </div>
        </div>
      ) : screen !== 'F1' ? (
        <div data-lenis-prevent className="vpos-scroll min-h-0 flex-1 lg:overflow-y-auto">
          {screen === 'F2' ? <InventoryScreen stockOf={stockOf} /> : (
            <CierreScreen pending={pendingList} invoice={payInvoice} code={code} codeRef={codeInput} onCode={c => { setCode(c); setPaid(null); resetPay(); }}
              method={method} onMethod={setMethod} provider={provider} onProvider={setProvider} cash={cash} onCash={setCash} onPay={pay} paid={paid} onPrint={() => setView('receipt')} />
          )}
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 md:grid-cols-[3fr_2fr]">
          <div className="@container flex min-h-0 min-w-0 flex-col md:border-r md:border-borde">
            <div className="shrink-0 space-y-2 border-b border-white/5 px-3 py-2.5 sm:px-4">
              {parked.length > 0 && (
                <div className="scrollbar-none -mx-3 flex items-center gap-2 overflow-x-auto px-3 sm:-mx-4 sm:px-4" role="group" aria-label="Ventas en pausa">
                  <span className="eyebrow shrink-0">En pausa</span>
                  {parked.map((p, i) => (
                    <button key={i} type="button" onClick={() => resume(i)} className="chip press !border-warn/40 !text-warn">
                      <Play className="h-3.5 w-3.5" aria-hidden="true" /><span className="font-mono tabular-nums">{formatCOP(cartTotal(p))}</span>
                      <span className="text-muted">· {p.reduce((s, x) => s + x.qty, 0)} u</span>{i === 0 && !cart.length && <kbd className="kbd">F8</kbd>}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <div className="scrollbar-none flex min-w-0 gap-1.5 overflow-x-auto" role="group" aria-label="Categorías">
                  <button type="button" className="chip press !rounded-full" aria-pressed={cat === null} onClick={() => setCat(null)}>Todas</button>
                  {CATEGORIES.map(c => <button key={c.id} type="button" className="chip press !rounded-full" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}><span aria-hidden="true">{c.icon}</span>{c.name}</button>)}
                </div>
                <p className="ml-auto min-w-0 text-xs text-muted" aria-live="polite">
                  {hint ? <span className="text-warn">{hint}</span> : scanMatch && (
                    <span className="flex items-center gap-1.5"><kbd className="kbd">Enter</kbd> agrega <span className="truncate font-medium text-hueso">{scanMatch.p.name}</span> · <span className="font-mono tabular-nums text-hueso">{formatCOP(scanMatch.pres.price)}</span></span>
                  )}
                </p>
              </div>
            </div>
            <div data-lenis-prevent className="vpos-scroll min-h-0 flex-1 p-3 sm:p-4 lg:overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="mx-auto mt-6 max-w-xs text-center text-sm text-muted">Nada con "{query.trim()}". Prueba otra palabra o escanea el código.</p>
              ) : (
                <div className="grid gap-3 @lg:grid-cols-2" data-product-grid>
                  {filtered.map(p => <ProductCard key={p.id} product={p} stockLeft={stockOf(p.id)} items={cart} onAdd={id => add(p.id, id)} />)}
                </div>
              )}
            </div>
          </div>
          <aside aria-label="Ticket de venta" className="flex min-h-[320px] flex-col border-t border-borde bg-noche/50 md:min-h-0 md:border-t-0">
            {created ? <CodeDisplay invoice={created} onNewSale={newSale} onPrint={() => setView('receipt')} />
              : <CartPanel items={cart} activeId={active} onActive={setActiveId} onQty={setQty} onRemove={id => setCart(c => c.filter(i => i.presentationId !== id))} onCheckout={openCharge} onCancel={() => setConfirm(true)} onPark={park} />}
          </aside>
        </div>
      )}

      {charging && (
        <ChargeModal total={total} units={cart.reduce((s, i) => s + i.qty, 0)} method={method} onMethod={setMethod} provider={provider} onProvider={setProvider}
          cash={cash} onCash={setCash} onConfirm={charge} onInvoiceOnly={checkout} onClose={() => setCharging(false)} />
      )}

      {confirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-noche/70 p-4" onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); setConfirm(false); } }}>
          <div role="dialog" aria-modal="true" aria-label="Cancelar la venta" className="w-full max-w-sm rounded-xl border border-white/10 bg-superficie p-5">
            <h3 className="font-pos text-base font-semibold text-hueso">¿Cancelar la venta?</h3>
            <p className="mt-1 text-sm text-muted">{cart.length > 1 ? `Se quitan los ${cart.length} productos del ticket.` : 'Se quita el producto del ticket.'}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" autoFocus onClick={() => setConfirm(false)} className="press min-h-10 rounded-lg border border-white/10 px-4 text-sm text-slate-200 hover:border-white/25">Seguir vendiendo</button>
              <button type="button" onClick={() => { setCart([]); setConfirm(false); }} className="press min-h-10 rounded-lg bg-error px-4 text-sm font-semibold text-noche">Cancelar venta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
