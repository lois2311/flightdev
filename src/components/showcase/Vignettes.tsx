// Static, code-drawn illustrations of each product's core moment. Callers caption them as illustrations with sample data:
// they are never presented as screenshots (no real screenshots exist yet, backlog CONT-2).

const TICKET = [['CINTA AISLANTE 18 MM', '$4.500'], ['TORNILLO DRYWALL X100', '$12.500'], ['BOMBILLO LED 9 W', '$8.000']] as const;

/** Vendra cashier: the 4-digit code the customer brings from the floor, the ticket it loads, and the payment. */
export function VendraVignette({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`rounded-[22px] border border-white/10 bg-[#0b1626] p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] ${className}`}>
      <div className="flex flex-col gap-4 rounded-2xl border border-borde bg-[linear-gradient(180deg,#10233d,#0c1b30)] p-5">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[.14em] text-muted">
          <span>CAJA 01 · COBRO</span><span className="rounded-sm bg-voltaje/15 px-1.5 py-0.5 text-voltaje">COBRADO</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[.14em] text-muted">CÓDIGO</span>
          <span className="flex gap-1.5">
            {'6960'.split('').map((d, i) => <span key={i} className="grid h-11 w-9 place-items-center rounded-lg border border-voltaje/40 bg-voltaje/10 font-mono text-xl font-bold text-voltaje">{d}</span>)}
          </span>
        </div>
        <ul className="m-0 flex list-none flex-col gap-2 border-y border-dashed border-borde p-0 py-3 font-mono text-[11px] text-niebla">
          {TICKET.map(([n, p]) => <li key={n} className="flex justify-between gap-4"><span>{n}</span><span className="tnum">{p}</span></li>)}
        </ul>
        <div className="flex items-end justify-between">
          <span className="font-mono text-[10px] tracking-[.14em] text-muted">TOTAL</span>
          <span className="tnum font-display text-3xl font-bold text-hueso">$25.000</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-[12px] font-semibold">
          {['Efectivo', 'Nequi', 'Daviplata'].map((p, i) => <span key={p} className={`rounded-lg border py-2 ${i === 1 ? 'border-voltaje/50 bg-voltaje/12 text-voltaje' : 'border-borde text-niebla'}`}>{p}</span>)}
        </div>
      </div>
    </div>
  );
}

/** FleetTrack driver app: an open shift with its money in and out, and the service assigned to it. */
export function FleetVignette({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`w-[248px] rounded-[34px] border border-white/12 bg-[#0b1626] p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] ${className}`}>
      <div className="flex flex-col gap-3 overflow-hidden rounded-[27px] bg-[linear-gradient(180deg,#10233d,#0b1a2f)] px-4 pb-5 pt-3">
        <span className="mx-auto h-1.5 w-16 rounded-full bg-white/10" />
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[.12em]">
          <span className="text-muted">VEHÍCULO 07</span>
          <span className="flex items-center gap-1.5 text-cielo-claro"><span className="size-1.5 rounded-full bg-cielo" />TURNO ABIERTO</span>
        </div>
        <p className="m-0 font-display text-[22px] font-semibold leading-tight text-hueso">Turno de hoy</p>
        <dl className="m-0 flex flex-col gap-px overflow-hidden rounded-xl border border-borde bg-borde text-[12px]">
          {[['Ingresos', '$180.000', 'text-hueso'], ['Gastos', '$22.000', 'text-niebla'], ['Combustible', '$45.000', 'text-niebla']].map(([k, v, c]) => (
            <div key={k} className="flex justify-between bg-superficie px-3 py-2.5"><dt className="text-muted">{k}</dt><dd className={`tnum m-0 font-semibold ${c}`}>{v}</dd></div>
          ))}
        </dl>
        <div className="flex flex-col gap-1 rounded-xl border border-cielo/30 bg-cielo/10 px-3 py-2.5">
          <span className="font-mono text-[10px] tracking-[.12em] text-cielo-claro">SERVICIO ASIGNADO</span>
          <span className="text-[12px] text-hueso">Recogida 14:30 · En camino</span>
        </div>
        <span className="rounded-xl bg-cielo py-2.5 text-center text-[13px] font-semibold text-noche">Registrar gasto</span>
      </div>
    </div>
  );
}
