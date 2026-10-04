import { RECEIPT_FOOTER, RECEIPT_HEADER, type Invoice } from '../../lib/vendra/data';
import { formatCOP, formatDate, payMethodLabel } from '../../lib/vendra/format';
import VendraLogo from './VendraLogo';

export type Paper = 58 | 80;

// Cut edge: zigzag along top and bottom, like the printer's tear bar.
const N = 24;
const cut = 'polygon(' + [
  ...Array.from({ length: N + 1 }, (_, i) => `${(i / N) * 100}% ${i % 2 ? 0 : 7}px`),
  ...Array.from({ length: N + 1 }, (_, i) => `${100 - (i / N) * 100}% calc(100% - ${i % 2 ? 0 : 7}px)`),
].join(',') + ')';

/**
 * Same structure as buildHTMLReceipt in pos.pirotecnia/src/lib/printService.js: header, Factura/Fecha/Vendedor,
 * item rows, TOTAL, MÉTODO DE PAGO, footer lines, then the 40 mm 1-bit vendra. logo and "by flightdev".
 */
export default function ThermalReceipt({ invoice, paper }: { invoice: Invoice; paper: Paper }) {
  const row = 'flex justify-between';
  return (
    <div
      role="img"
      aria-label={`Vista previa del ticket térmico de la factura ${invoice.code}`}
      className="mx-auto max-w-full bg-white text-black"
      style={{ width: `${paper}mm`, padding: '7px 3mm 9px', fontFamily: "'Courier New', Courier, monospace", fontSize: '9.5pt', fontWeight: 700, lineHeight: 1.4, WebkitTextStroke: '0.25px #000', clipPath: cut, filter: 'contrast(1.25)' }}
    >
      {RECEIPT_HEADER.map((h, i) => <div key={h} className={`text-center ${i === 0 ? 'text-[11pt]' : ''}`}>{h}</div>)}
      <div className="my-[2mm] border-t border-dashed border-black" />
      <div>Factura:  #{invoice.code}</div>
      <div>Fecha:    {formatDate(invoice.createdAt)}</div>
      <div>Vendedor: {invoice.sellerName}</div>
      <div className="my-[2mm] border-t border-dashed border-black" />
      {invoice.items.map(it => (
        <div key={it.presentationId} className="mb-[1mm]">
          <div>{it.productName}</div>
          <div className={row}><span>&nbsp;&nbsp;{it.label}</span><span>x{it.qty}&nbsp;&nbsp;{formatCOP(it.subtotal)}</span></div>
        </div>
      ))}
      <div className="my-[2mm] border-t border-black" />
      <div className={`${row} text-[11pt]`}><span>TOTAL</span><span>{formatCOP(invoice.total)}</span></div>
      <div className="my-[2mm] border-t border-dashed border-black" />
      <div>MÉTODO DE PAGO: {payMethodLabel(invoice.payMethod, invoice.transferProvider)}</div>
      <div className="my-[2mm] border-t border-dashed border-black" />
      {RECEIPT_FOOTER.map(f => <div key={f} className="text-center">{f}</div>)}
      <div className="mt-[3mm] flex justify-center [&>svg]:h-auto [&>svg]:w-[40mm]"><VendraLogo variant="thermal" size={32} /></div>
      <div className="mt-[1mm] text-center text-[7pt]">by flightdev</div>
    </div>
  );
}
