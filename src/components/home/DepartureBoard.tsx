// Departure-board ticker. Only claims already made elsewhere on the site; decorative duplicate of real content, so aria-hidden.
const ROWS = [
  ['FD-01', 'VENDRA POS', 'PUNTO DE VENTA Y CAJA', 'EN OPERACIÓN'],
  ['FD-02', 'FLEETTRACK PRO', 'GESTIÓN DE FLOTAS', 'EN OPERACIÓN'],
  ['FD-10', 'SOFTWARE A LA MEDIDA', 'PLATAFORMAS Y PORTALES', 'ABIERTO'],
  ['FD-20', 'AUTOMATIZACIÓN', 'INTEGRACIONES Y PROCESOS', 'ABIERTO'],
  ['MZL', 'MANIZALES · COLOMBIA', '05°04′N 75°31′W', 'BASE'],
] as const;

function Row() {
  return (
    <ul className="m-0 flex shrink-0 list-none items-center p-0">
      {ROWS.map(([code, name, what, status]) => (
        <li key={code} className="flex items-center gap-4 whitespace-nowrap border-r border-borde px-8 font-mono text-[12px] tracking-[.12em]">
          <span className="text-muted">{code}</span>
          <span className="text-hueso">{name}</span>
          <span className="text-muted max-sm:hidden">{what}</span>
          <span className={`rounded-sm px-1.5 py-0.5 text-[10.5px] ${status === 'EN OPERACIÓN' ? 'bg-voltaje/12 text-voltaje' : 'bg-cielo/12 text-cielo-claro'}`}>{status}</span>
        </li>
      ))}
    </ul>
  );
}

// The pause control is a native checkbox (CSS :has pauses the track), so keyboard users can stop the motion (WCAG 2.2.2) without client JS.
export default function DepartureBoard() {
  return (
    <div className="marquee relative border-y border-borde bg-[#081122]">
      <div aria-hidden="true" className="overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track flex w-max"><Row /><Row /></div>
      </div>
      <label className="absolute right-2 top-1/2 flex motion-reduce:hidden -translate-y-1/2 cursor-pointer items-center gap-2 rounded-full border border-borde bg-[#081122] px-3 py-1.5 font-mono text-[10.5px] tracking-[.12em] text-muted has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cielo">
        <input type="checkbox" className="peer sr-only" />
        {/* Constant accessible name: "checked" means paused, so the visible verb is hidden from assistive tech. */}
        <span aria-hidden="true" className="peer-checked:hidden">PAUSAR</span><span aria-hidden="true" className="hidden peer-checked:inline">REANUDAR</span>
        <span className="sr-only">Pausar el tablero animado</span>
      </label>
    </div>
  );
}
