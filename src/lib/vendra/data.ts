// Demo tenant. Catalog structure (products → presentations, category, stock) mirrors the POS e2e fixtures
// (pos.pirotecnia/e2e/fixtures.js); the first three products and both pending invoices are taken from it as-is.
import type { PayMethod, Provider } from './format';

export type Presentation = { id: string; label: string; price: number };
export type Category = { id: string; name: string; icon: string };
export type Product = { id: string; name: string; categoryId: string; stock: number; presentations: Presentation[] };
export type InvoiceItem = { presentationId: string; productId: string; productName: string; label: string; price: number; qty: number; subtotal: number };
export type Invoice = {
  code: string; items: InvoiceItem[]; total: number; status: 'pending' | 'paid' | 'cancelled';
  createdAt: number; sellerName: string; payMethod?: PayMethod; transferProvider?: Provider; received?: number;
};

export const LOCATION_NAME = 'Local Principal';
export const REGISTER_NAME = 'Caja 1';
export const SELLER_NAME = 'Carlos Rodríguez';
export const RECEIPT_HEADER = ['LOCAL PRINCIPAL'];
export const RECEIPT_FOOTER = ['¡Gracias por su compra!', 'Manipule con responsabilidad'];

export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Volcanes', icon: '🌋' },
  { id: 'c2', name: 'Luces de bengala', icon: '✨' },
];

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Volcán mágico', categoryId: 'c1', stock: 30, presentations: [{ id: 'p1-u', label: 'Unidad', price: 3000 }] },
  { id: 'p2', name: 'Bengala dorada x10', categoryId: 'c2', stock: 2, presentations: [{ id: 'p2-u', label: 'Unidad', price: 4500 }, { id: 'p2-x12', label: 'Paquete x12', price: 39000 }] },
  { id: 'p3', name: 'Cohete silbador', categoryId: 'c1', stock: 0, presentations: [{ id: 'p3-u', label: 'Unidad', price: 6000 }] },
  { id: 'p4', name: 'Fuente de chispas', categoryId: 'c1', stock: 18, presentations: [{ id: 'p4-u', label: 'Unidad', price: 8500 }, { id: 'p4-x6', label: 'Caja x6', price: 45000 }] },
  { id: 'p5', name: 'Bengala plateada x5', categoryId: 'c2', stock: 40, presentations: [{ id: 'p5-u', label: 'Unidad', price: 3800 }] },
];

const flat = (): InvoiceItem[] => [
  { presentationId: 'p1-u', productId: 'p1', productName: 'Volcán mágico', label: 'Unidad', price: 3000, qty: 3, subtotal: 9000 },
];
export const seedInvoices = (now: number): Invoice[] => [
  { code: '4821', status: 'pending', sellerName: 'Carlos Rodríguez', createdAt: now - 5 * 60000, total: 45000,
    items: [...flat(), { presentationId: 'p2-x12', productId: 'p2', productName: 'Bengala dorada x10', label: 'Paquete x12', price: 36000, qty: 1, subtotal: 36000 }] },
  { code: '4822', status: 'pending', sellerName: 'Sandra Gómez', createdAt: now - 10 * 60000, total: 68000,
    items: [...flat(), { presentationId: 'p2-x12', productId: 'p2', productName: 'Bengala dorada x10', label: 'Paquete x12', price: 59000, qty: 1, subtotal: 59000 }] },
];
