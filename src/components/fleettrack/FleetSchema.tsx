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
      <div className="grid gap-px border border-borde bg-borde md:grid-cols-3">
        {ACTORS.map(({ Icon, who, where, does }) => (
          <div key={who} className="flex flex-col gap-4 bg-noche p-6">
            <div className="flex items-center gap-3">
              <Icon aria-hidden="true" size={22} strokeWidth={1.7} className="shrink-0 text-cielo-claro" />
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
