import { Car, LayoutDashboard, Link2 } from 'lucide-react';

const ACTORS = [
  { Icon: LayoutDashboard, who: 'Administrador', where: 'Panel web', does: ['Vehículos y documentos', 'Turnos y horarios', 'Ingresos, gastos y metas', 'Servicios y asignación'] },
  { Icon: Car, who: 'Conductor', where: 'App en el celular', does: ['Abre y cierra su turno', 'Registra ingresos y gastos', 'Atiende servicios asignados'] },
  { Icon: Link2, who: 'Cliente final', where: 'Enlace público', does: ['Consulta el estado de su servicio', 'Sin crear una cuenta'] },
];

/** Conceptual diagram of who uses FleetTrack and how. Deliberately not a product screenshot. */
export default function FleetSchema() {
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="relative grid gap-4 rounded-[22px] border border-borde bg-[linear-gradient(180deg,#0F2340,#0B1A31)] p-[clamp(16px,3vw,32px)] md:grid-cols-3">
        <div aria-hidden="true" className="absolute left-[16%] right-[16%] top-[58px] hidden border-t border-dashed border-cielo/40 md:block" />
        {ACTORS.map(({ Icon, who, where, does }) => (
          <div key={who} className="relative flex flex-col gap-4 rounded-2xl border border-borde bg-superficie p-5">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl border border-cielo/30 bg-noche text-cielo-claro"><Icon size={20} strokeWidth={1.7} /></span>
              <div className="flex flex-col">
                <span className="font-display text-lg font-semibold text-hueso">{who}</span>
                <span className="font-mono text-[11px] tracking-[.08em] text-muted">{where.toUpperCase()}</span>
              </div>
            </div>
            <ul className="m-0 flex list-none flex-col gap-2 border-t border-borde p-0 pt-4 text-[15px] text-niebla">
              {does.map(d => <li key={d} className="flex gap-2.5"><span aria-hidden="true" className="text-cielo">›</span>{d}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <figcaption className="font-mono text-xs text-muted">Esquema conceptual de los usuarios de FleetTrack Pro. No es una captura de la interfaz.</figcaption>
    </figure>
  );
}
