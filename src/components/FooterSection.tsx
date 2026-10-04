import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import PlaneMark from './PlaneMark';
import { CONTACT_EMAIL } from '../config';

const clock = () => new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());

export default function FooterSection() {
  const [time, setTime] = useState(clock);
  const [brief, setBrief] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => { const id = setInterval(() => setTime(clock()), 15000); return () => clearInterval(id); }, []);

  const invalid = touched && brief.trim().length < 10;
  const submit = (e: FormEvent) => {
    e.preventDefault(); setTouched(true);
    if (brief.trim().length < 10) return;
    window.dispatchEvent(new Event('fd:takeoff'));
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Brief de proyecto — Flight Dev')}&body=${encodeURIComponent(brief)}`;
  };

  return (
    <footer id="brief" className="relative overflow-hidden bg-noche text-hueso">
      <div className="border-t border-borde" />
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36">
        <h2 data-fly="cta" className="font-display text-[clamp(2.6rem,9vw,8rem)] font-bold leading-[1]">¿LISTO PARA<br />EL DESPEGUE?</h2>
        <p className="font-display mt-6 text-[clamp(1.2rem,2.4vw,2rem)] text-cielo">Construyamos algo que valga la pena volar.</p>

        <form onSubmit={submit} noValidate className="mt-14 max-w-2xl">
          <label htmlFor="brief-text" className="font-mono text-xs text-muted">TU PROYECTO — ¿qué construimos y para quién?</label>
          <textarea id="brief-text" rows={4} value={brief} onChange={e => setBrief(e.target.value)} onBlur={() => setTouched(true)} aria-invalid={invalid} aria-describedby="brief-err" placeholder="> Escribe tu correo o describe tu proyecto_" className={`mt-2 w-full resize-y rounded-xl border bg-superficie p-4 text-hueso outline-none placeholder:text-muted focus:border-cielo ${invalid ? 'border-red-400' : 'border-borde'}`} />
          <p id="brief-err" className="mt-1 min-h-5 font-mono text-xs text-red-300">{invalid ? 'Cuéntanos en una o dos frases (mínimo 10 caracteres).' : ''}</p>
          <button type="submit" data-takeoff className="mt-2 inline-flex items-center gap-2 rounded-xl bg-voltaje px-6 py-3 font-mono text-sm font-bold text-noche transition-transform hover:-translate-y-px">
            [ Enviar Proyecto <ArrowRight size={16} aria-hidden="true" /> ]
          </button>
          <p className="mt-3 font-mono text-xs text-muted">Abre tu app de correo dirigida a {CONTACT_EMAIL}.</p>
        </form>

        <div className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-borde pt-6 font-mono text-xs text-muted">
          <span className="flex items-center gap-2 text-hueso"><PlaneMark size={20} fold="#7DB8FF" /><span className="font-display text-base font-semibold lowercase">flightdev</span></span>
          <span className="tnum">Hora local {time} (UTC−5)</span>
          <span>flightdev © {new Date().getFullYear()} · Software · Productos · Automatizaciones · Manizales, Colombia</span>
        </div>
      </div>
    </footer>
  );
}
