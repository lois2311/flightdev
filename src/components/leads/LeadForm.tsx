'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { CONTACT_EMAIL } from '@/config';
import { track } from '@/lib/analytics';
import { readAttribution } from '@/lib/attribution';
import {
  FLEET_BUSINESS, FLEET_RANGES, POS_RANGES, PRODUCTS, VENDRA_BUSINESS, validateLead,
  type FieldErrors, type LeadInput, type Product,
} from '@/lib/leads/schema';

type Values = Omit<LeadInput, 'attribution' | 'product'> & { product: Product | '' };
type Status =
  | { kind: 'editing' }
  | { kind: 'submitting' }
  | { kind: 'sent' }
  | { kind: 'failed'; message: string; mailto: boolean };

const EMPTY: Values = {
  firstName: '', lastName: '', company: '', email: '', phone: '', position: '', product: '',
  businessType: '', pointsOfSale: '', vehicles: '', drivers: '', message: '', consent: false, marketingOptIn: false,
};
const PRODUCT_FIELDS = { businessType: '', pointsOfSale: '', vehicles: '', drivers: '' } as const;
const FIELD_ORDER: (keyof Values)[] = ['firstName', 'lastName', 'company', 'position', 'email', 'phone', 'product', 'businessType', 'pointsOfSale', 'vehicles', 'drivers', 'message', 'consent'];

/**
 * Lead capture. Validation runs on blur and on submit with the same rules the API enforces.
 * Input is never cleared on failure; the success state replaces the form.
 */
export default function LeadForm({ product, formName = 'contacto', title }: { product?: Product; formName?: string; title?: ReactNode }) {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [values, setValues] = useState<Values>({ ...EMPTY, product: product ?? '' });
  const [touched, setTouched] = useState<Partial<Record<keyof Values, true>>>({});
  const [status, setStatus] = useState<Status>({ kind: 'editing' });
  // Fill time counts from mount, not first focus: autofill + a quick submit must not look like a bot.
  const startedAt = useRef<number | null>(null);
  const reported = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const check = validateLead({ ...values, attribution: {} });
  const errors: FieldErrors = check.ok ? {} : check.errors;
  const err = (k: keyof Values) => (touched[k] ? errors[k] : undefined);

  useEffect(() => { startedAt.current = Date.now(); }, []);

  const start = () => {
    if (reported.current) return;
    reported.current = true;
    track('form_start', { form: formName, product: values.product || undefined });
  };
  const set = <K extends keyof Values>(k: K, v: Values[K]) => setValues(prev => ({ ...prev, [k]: v }));
  const blur = (k: keyof Values) => setTouched(t => ({ ...t, [k]: true }));
  const pickProduct = (p: Product) => setValues(prev => ({ ...prev, ...PRODUCT_FIELDS, product: p }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status.kind === 'submitting') return;
    const payload = { ...values, attribution: readAttribution() };
    const result = validateLead(payload);
    if (!result.ok) {
      setTouched(Object.fromEntries(FIELD_ORDER.map(k => [k, true])));
      const first = FIELD_ORDER.find(k => k in result.errors);
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setStatus({ kind: 'submitting' });
    track('form_submit', { form: formName, product: values.product });
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...payload, website: honeypot.current?.value ?? '', elapsedMs: Date.now() - (startedAt.current ?? Date.now()) }),
      });
      if (res.status === 201) {
        track('lead_created', { form: formName, product: values.product });
        setStatus({ kind: 'sent' });
        return;
      }
      if (res.status === 400) {
        const body = await res.json().catch(() => ({}));
        if (body?.fields) {
          setTouched(Object.fromEntries(Object.keys(body.fields).map(k => [k, true])));
          setStatus({ kind: 'failed', message: 'Revisa los campos marcados e inténtalo de nuevo.', mailto: false });
        } else {
          setStatus({ kind: 'failed', message: 'No pudimos procesar tu solicitud. Tus datos siguen aquí: revísalos o escríbenos directamente.', mailto: true });
        }
        return;
      }
      if (res.status === 429) {
        setStatus({ kind: 'failed', message: 'Recibimos varios envíos desde tu conexión. Espera unos minutos o escríbenos directamente.', mailto: true });
        return;
      }
      setStatus({ kind: 'failed', message: 'No pudimos registrar tu solicitud en este momento. Tus datos siguen aquí: inténtalo de nuevo o escríbenos.', mailto: true });
    } catch {
      setStatus({ kind: 'failed', message: 'Parece que no hay conexión. Tus datos siguen aquí: inténtalo de nuevo cuando vuelva.', mailto: true });
    }
  };

  if (status.kind === 'sent') {
    return (
      <div role="status" className="flex flex-col gap-4 rounded-[20px] border border-voltaje/30 bg-superficie p-[clamp(22px,4vw,36px)]">
        <span className="font-mono text-[11px] tracking-[.1em] text-voltaje">SOLICITUD RECIBIDA</span>
        <p className="m-0 font-display text-2xl font-semibold text-hueso">Gracias, {values.firstName}. Ya tenemos tu solicitud.</p>
        <p className="m-0 max-w-[52ch] leading-relaxed text-niebla">Una persona de nuestro equipo la revisa y te escribe a <b className="text-hueso">{values.email}</b> para coordinar el siguiente paso.</p>
        <Link href="/blog" className="w-fit text-sm font-semibold text-cielo-claro underline underline-offset-4">Mientras tanto, lee nuestros artículos</Link>
      </div>
    );
  }

  const isVendra = values.product === 'vendra', isFleet = values.product === 'fleettrack';
  const openEnded = values.product !== '' && !isVendra && !isFleet;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Solicitud desde flightdev: ' + (PRODUCTS.find(p => p.value === values.product)?.label ?? 'contacto'))}&body=${encodeURIComponent(values.message)}`;

  return (
    <form ref={formRef} onSubmit={submit} onFocus={start} noValidate aria-busy={status.kind === 'submitting'}
      className="relative flex flex-col gap-6 rounded-[20px] border border-borde border-t-cielo-claro/35 bg-superficie p-[clamp(20px,4vw,36px)] shadow-[inset_0_1px_0_rgba(125,184,255,.15),0_40px_80px_-40px_rgba(0,0,0,.7)]">
      {title}
      {/* Honeypot: invisible to people and assistive tech; bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>No llenar este campo<input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id('firstName')} label="Nombre" error={err('firstName')}>
          <input id={id('firstName')} data-field="firstName" className="field h-12 px-4" autoComplete="given-name" maxLength={80}
            value={values.firstName} onChange={e => set('firstName', e.target.value)} onBlur={() => blur('firstName')} {...aria(id('firstName'), err('firstName'))} />
        </Field>
        <Field id={id('lastName')} label="Apellido" optional error={err('lastName')}>
          <input id={id('lastName')} data-field="lastName" className="field h-12 px-4" autoComplete="family-name" maxLength={80}
            value={values.lastName} onChange={e => set('lastName', e.target.value)} onBlur={() => blur('lastName')} {...aria(id('lastName'), err('lastName'))} />
        </Field>
        <Field id={id('company')} label="Empresa o negocio" error={err('company')}>
          <input id={id('company')} data-field="company" className="field h-12 px-4" autoComplete="organization" maxLength={120}
            value={values.company} onChange={e => set('company', e.target.value)} onBlur={() => blur('company')} {...aria(id('company'), err('company'))} />
        </Field>
        <Field id={id('position')} label="Cargo" optional error={err('position')}>
          <input id={id('position')} data-field="position" className="field h-12 px-4" autoComplete="organization-title" maxLength={80}
            value={values.position} onChange={e => set('position', e.target.value)} onBlur={() => blur('position')} {...aria(id('position'), err('position'))} />
        </Field>
        <Field id={id('email')} label="Correo corporativo" error={err('email')}>
          <input id={id('email')} data-field="email" type="email" inputMode="email" className="field h-12 px-4" autoComplete="email" maxLength={160}
            value={values.email} onChange={e => set('email', e.target.value)} onBlur={() => blur('email')} {...aria(id('email'), err('email'))} />
        </Field>
        <Field id={id('phone')} label="Teléfono o WhatsApp" optional error={err('phone')}>
          <input id={id('phone')} data-field="phone" type="tel" inputMode="tel" className="field h-12 px-4" autoComplete="tel" maxLength={30}
            value={values.phone} onChange={e => set('phone', e.target.value)} onBlur={() => blur('phone')} {...aria(id('phone'), err('phone'))} />
        </Field>
      </div>

      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0" aria-describedby={err('product') ? id('product-err') : undefined}>
        <legend className="field-label mb-3 p-0">¿Qué te interesa?</legend>
        <div className="flex flex-wrap gap-2">
          {PRODUCTS.map((p, i) => {
            const on = values.product === p.value;
            return (
              <label key={p.value} className={`flex min-h-11 cursor-pointer items-center rounded-[3px] border px-4 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cielo ${on ? 'border-cielo bg-cielo/15 text-hueso' : 'border-borde text-niebla hover:border-cielo/50'}`}>
                <input type="radio" name={id('product')} value={p.value} checked={on} data-field={i === 0 ? 'product' : undefined}
                  onChange={() => pickProduct(p.value)} onBlur={() => blur('product')} className="sr-only" />
                {p.label}
              </label>
            );
          })}
        </div>
        {err('product') && <p id={id('product-err')} className="field-error">{err('product')}</p>}
      </fieldset>

      {(isVendra || isFleet) && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={id('businessType')} label={isVendra ? 'Tipo de negocio' : 'Tipo de empresa'} optional error={err('businessType')}>
            <Select id={id('businessType')} field="businessType" value={values.businessType} options={isVendra ? VENDRA_BUSINESS : FLEET_BUSINESS}
              onChange={v => set('businessType', v)} onBlur={() => blur('businessType')} error={err('businessType')} />
          </Field>
          {isVendra ? (
            <Field id={id('pointsOfSale')} label="Puntos de venta" optional error={err('pointsOfSale')}>
              <Select id={id('pointsOfSale')} field="pointsOfSale" value={values.pointsOfSale} options={POS_RANGES}
                onChange={v => set('pointsOfSale', v)} onBlur={() => blur('pointsOfSale')} error={err('pointsOfSale')} />
            </Field>
          ) : (
            <>
              <Field id={id('vehicles')} label="Vehículos aproximados" optional error={err('vehicles')}>
                <Select id={id('vehicles')} field="vehicles" value={values.vehicles} options={FLEET_RANGES}
                  onChange={v => set('vehicles', v)} onBlur={() => blur('vehicles')} error={err('vehicles')} />
              </Field>
              <Field id={id('drivers')} label="Conductores aproximados" optional error={err('drivers')}>
                <Select id={id('drivers')} field="drivers" value={values.drivers} options={FLEET_RANGES}
                  onChange={v => set('drivers', v)} onBlur={() => blur('drivers')} error={err('drivers')} />
              </Field>
            </>
          )}
        </div>
      )}

      <Field id={id('message')} label={openEnded ? 'Cuéntanos qué necesitas' : '¿Qué necesitas resolver?'} optional={!openEnded} error={err('message')}
        hint={`${values.message.length} / 1500`}>
        <textarea id={id('message')} data-field="message" rows={4} maxLength={1500} className="field resize-y px-4 py-3 leading-normal"
          placeholder={isFleet ? 'Ej: controlar gastos y mantenimiento de 12 vehículos' : isVendra ? 'Ej: agilizar la caja en temporada alta' : 'Ej: conectar nuestro sistema de pedidos con la facturación'}
          value={values.message} onChange={e => set('message', e.target.value)} onBlur={() => blur('message')} {...aria(id('message'), err('message'))} />
      </Field>

      <div className="flex flex-col gap-3 text-sm leading-relaxed text-niebla">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" data-field="consent" checked={values.consent} onChange={e => set('consent', e.target.checked)} onBlur={() => blur('consent')}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[#B4E854]" {...aria(id('consent'), err('consent'))} />
          <span>Autorizo a FlightDev a tratar mis datos personales para responder esta solicitud, según la{' '}
            <Link href="/politica-de-privacidad" className="text-cielo-claro underline underline-offset-2">Política de tratamiento de datos</Link>.</span>
        </label>
        {err('consent') && <p id={`${id('consent')}-err`} className="field-error -mt-1 pl-8">{err('consent')}</p>}
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={values.marketingOptIn} onChange={e => set('marketingOptIn', e.target.checked)} className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[#B4E854]" />
          <span>Quiero recibir novedades y contenido de FlightDev (opcional, puedo darme de baja cuando quiera).</span>
        </label>
      </div>

      {status.kind === 'failed' && (
        <div role="alert" className="flex flex-col gap-2 rounded-[3px] border border-error/40 bg-error/10 px-4 py-3 text-sm text-hueso">
          <span>{status.message}</span>
          {status.mailto && <a href={mailto} className="w-fit font-semibold text-cielo-claro underline underline-offset-2">Escribir a {CONTACT_EMAIL}</a>}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs text-muted">Respondemos en horario hábil de Colombia.</span>
        <button type="submit" disabled={status.kind === 'submitting'}
          className="btn cursor-pointer border-none bg-voltaje text-noche hover:bg-voltaje-hover disabled:cursor-wait disabled:opacity-70">
          {status.kind === 'submitting' ? 'Enviando…' : 'Enviar solicitud'}
        </button>
      </div>
    </form>
  );
}

const aria = (fieldId: string, error?: string) => ({ 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? `${fieldId}-err` : undefined });

function Field({ id, label, optional, error, hint, children }: { id: string; label: string; optional?: boolean; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className="field-label flex justify-between gap-3">
        <span>{label}{optional && <span className="font-normal text-muted"> (opcional)</span>}</span>
        {hint && <span className="tnum font-mono text-[11px] text-muted">{hint}</span>}
      </label>
      {children}
      {error && <p id={`${id}-err`} className="field-error">{error}</p>}
    </div>
  );
}

function Select({ id, field, value, options, onChange, onBlur, error }: {
  id: string; field: string; value: string; options: readonly string[]; onChange: (v: string) => void; onBlur: () => void; error?: string;
}) {
  return (
    <select id={id} data-field={field} className="field h-12 px-4" value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} {...aria(id, error)}>
      <option value="">Selecciona…</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
