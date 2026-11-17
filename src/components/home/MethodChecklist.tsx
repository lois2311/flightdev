import Leg from './Leg';
import { LEGS } from '@/content/flightplan';

// Challenge / response, like a cockpit checklist. Content mirrors the process published on the service pages (src/content/services.ts).
const ITEMS = [
  { c: 'Diagnóstico', r: 'Proceso, personas y costo', text: 'Entendemos el proceso, quién lo opera y cuánto cuesta el problema. Definimos qué construir primero.' },
  { c: 'Primera versión útil', r: 'En semanas', text: 'Una versión que resuelve el problema más costoso, en manos del equipo que la va a usar.' },
  { c: 'Iteración', r: 'Cada semana', text: 'Cada semana ves avances funcionando y decides con algo real en pantalla.' },
  { c: 'Integraciones', r: 'Con registro y alertas', text: 'Conectamos lo que ya usas con registro de errores, reintentos y alertas, para no perder datos.' },
  { c: 'Producción', r: 'Operación y soporte', text: 'Lo ponemos en producción y lo acompañamos después del lanzamiento.' },
  { c: 'Medición', r: 'Antes y después', text: 'Comparamos el antes y el después con datos del propio proceso.' },
];

/** 004 MÉTODO: a printed checklist on paper, the one light surface below the hero. */
export default function MethodChecklist() {
  return (
    <Leg {...LEGS.method} next={LEGS.destination} tone="vuelo" className="pb-[clamp(72px,9vw,128px)] pt-16">
      <div className="grid gap-[clamp(40px,6vw,96px)] lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <h2 id="metodo-t" className="h2 max-w-[12ch] text-[clamp(2.2rem,4.6vw,4rem)]">Cómo despegamos un proyecto.</h2>
          <p className="m-0 max-w-[42ch] text-lg leading-[1.6] text-niebla">El proceso que describimos en cada servicio, escrito como una lista de chequeo: qué se revisa y qué debe quedar listo.</p>
        </div>
        <div className="rounded-[3px] bg-nube p-[clamp(20px,3.4vw,44px)] text-vuelo">
          <div className="flex items-center justify-between gap-4 border-b-2 border-vuelo pb-3 font-mono text-[11px] tracking-[.14em]">
            <span>LISTA DE CHEQUEO · PROYECTO NUEVO</span><span className="max-sm:hidden">FD-OPS</span>
          </div>
          <ol className="m-0 list-none p-0">
            {ITEMS.map((it, i) => (
              <li key={it.c} className="border-b border-vuelo/15 py-5 last:border-b-0">
                <p className="m-0 flex items-baseline gap-3 font-mono text-[12.5px] uppercase tracking-[.08em] sm:text-[13.5px]">
                  <span className="text-vuelo/65">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-medium">{it.c}</span>
                  <span aria-hidden="true" className="leader" />
                  <span className="text-right font-medium text-[#1d5fb8]">{it.r}</span>
                </p>
                <p className="m-0 mt-2 pl-[2.1rem] text-[15px] leading-[1.55] text-vuelo/75">{it.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Leg>
  );
}
