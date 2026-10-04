// Cart rules ported from pos.pirotecnia (cartStore / cartItem): one line per presentation,
// stock cap is per PRODUCT (all presentations count), qty <= 0 removes the line.
import type { Presentation, Product, InvoiceItem } from './data';

export type CartItem = InvoiceItem;

export const productQtyInCart = (items: CartItem[], productId: string) =>
  items.filter(i => i.productId === productId).reduce((s, i) => s + i.qty, 0);

export const cartTotal = (items: CartItem[]) => items.reduce((s, i) => s + i.subtotal, 0);

/** Returns the new list, or null when the stock cap blocks the add. */
export function addItem(items: CartItem[], product: Product, pres: Presentation, stockLeft: number): CartItem[] | null {
  if (productQtyInCart(items, product.id) >= stockLeft) return null;
  const hit = items.find(i => i.presentationId === pres.id);
  if (hit) return items.map(i => (i === hit ? { ...i, qty: i.qty + 1, subtotal: (i.qty + 1) * i.price } : i));
  return [...items, { presentationId: pres.id, productId: product.id, productName: product.name, label: pres.label, price: pres.price, qty: 1, subtotal: pres.price }];
}

export function updateQty(items: CartItem[], presentationId: string, qty: number, stockLeftOf: (productId: string) => number): CartItem[] {
  if (qty <= 0) return items.filter(i => i.presentationId !== presentationId);
  return items.map(i => {
    if (i.presentationId !== presentationId) return i;
    const others = productQtyInCart(items, i.productId) - i.qty;
    if (others + qty > stockLeftOf(i.productId)) return i;
    return { ...i, qty, subtotal: qty * i.price };
  });
}
