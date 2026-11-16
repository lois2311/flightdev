import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

const MIGRATION = readFileSync(new URL('./0001_growth_core.sql', import.meta.url), 'utf8');
const IP = 'a'.repeat(64);

const base = {
  email: 'Ana@Tienda.co', first_name: 'Ana', last_name: 'Ríos', company: 'Tienda Ana', phone: '3001234567',
  product_interest: 'vendra', consent: true, consent_version: '2026-11', marketing_opt_in: true,
  source: 'google', medium: 'organic', landing_page: '/productos/vendra', details: { points_of_sale: '2-3' }, ip_hash: IP,
};

let db: PGlite;
const createLead = async (payload: object) =>
  (await db.query<{ r: { status: string } }>('select public.create_lead($1::jsonb) as r', [JSON.stringify(payload)])).rows[0].r.status;
const count = async (table: string) => Number((await db.query<{ n: number }>(`select count(*)::int as n from public.${table}`)).rows[0].n);

// One embedded Postgres per file (startup is slow); each test starts from empty data tables.
beforeAll(async () => {
  db = new PGlite();
  // Supabase ships these roles; PGlite does not.
  await db.exec('create role anon; create role authenticated; create role service_role;');
  await db.exec(MIGRATION);
}, 120_000);
beforeEach(() => db.exec('truncate public.activities, public.leads, public.contacts, public.companies, public.suppression_list'));

describe('0001_growth_core migration', () => {
  it('is idempotent', async () => {
    await expect(db.exec(MIGRATION)).resolves.toBeDefined();
    expect(await count('pipeline_stages')).toBe(28);
  });

  it('creates contact, company, lead in the first stage of the product pipeline, and an initial task', async () => {
    expect(await createLead(base)).toBe('created');
    const lead = (await db.query<{ stage: string; pipeline: string; consent_status: string; marketing_opt_in: boolean; email: string }>(`
      select s.key as stage, p.key as pipeline, l.consent_status, l.marketing_opt_in, c.email
      from leads l join pipeline_stages s on s.id = l.stage_id join pipelines p on p.id = s.pipeline_id join contacts c on c.id = l.contact_id`)).rows[0];
    expect(lead).toEqual({ stage: 'new', pipeline: 'vendra', consent_status: 'granted', marketing_opt_in: true, email: 'ana@tienda.co' });
    expect(await count('companies')).toBe(1);
    const task = (await db.query<{ type: string; due: boolean }>(`select type, due_at > now() as due from activities`)).rows;
    expect(task).toEqual([{ type: 'task', due: true }]);
  });

  it('routes software/automation/other leads to the services pipeline', async () => {
    await createLead({ ...base, product_interest: 'automation' });
    const { rows } = await db.query<{ key: string }>('select p.key from leads l join pipeline_stages s on s.id = l.stage_id join pipelines p on p.id = s.pipeline_id');
    expect(rows[0].key).toBe('services');
  });

  it('treats an open lead for the same email and product as a duplicate and logs a resubmission', async () => {
    await createLead(base);
    expect(await createLead({ ...base, email: 'ana@tienda.co', ip_hash: 'b'.repeat(64) })).toBe('duplicate');
    expect(await count('leads')).toBe(1);
    const { rows } = await db.query<{ type: string }>('select type from activities order by created_at');
    expect(rows.map(r => r.type)).toContain('form_resubmission');
  });

  it('opens a new lead when the same contact asks about another product', async () => {
    await createLead(base);
    expect(await createLead({ ...base, product_interest: 'fleettrack' })).toBe('created');
    expect(await count('leads')).toBe(2);
    expect(await count('contacts')).toBe(1);
  });

  it('never writes public input onto an existing contact, not even blank fields', async () => {
    await createLead({ ...base, phone: undefined });
    await createLead({ ...base, first_name: 'Impostor', phone: '3119999999', position: 'Atacante', product_interest: 'software' });
    const { rows } = await db.query<{ first_name: string; phone: string | null; position: string | null }>('select first_name, phone, position from contacts');
    expect(rows[0]).toEqual({ first_name: 'Ana', phone: null, position: null });
    const body = (await db.query<{ body: string }>(`select body from activities where body like '%Impostor%'`)).rows[0].body;
    expect(JSON.parse(body)).toMatchObject({ first_name: 'Impostor', phone: '3119999999', position: 'Atacante' });
  });

  it('caps resubmissions per lead so one IP cannot write unlimited rows', async () => {
    await createLead(base);
    for (let i = 0; i < 6; i++) expect(await createLead(base)).toBe('duplicate');
    const { rows } = await db.query<{ n: number }>(`select count(*)::int as n from activities where type = 'form_resubmission'`);
    expect(rows[0].n).toBe(3);
  });

  it('never attaches a new contact to an existing company by typed name', async () => {
    await createLead({ ...base, company: 'Cliente Grande SAS' });
    await createLead({ ...base, email: 'x@otro.co', company: 'cliente grande sas' });
    const { rows } = await db.query<{ n: number }>('select count(distinct company_id)::int as n from contacts');
    expect(rows[0].n).toBe(2);
  });

  it('forces marketing opt-in off for suppressed emails', async () => {
    await db.query(`insert into suppression_list (email, reason) values ('ana@tienda.co', 'opt_out')`);
    await createLead(base);
    const { rows } = await db.query<{ marketing_opt_in: boolean }>('select marketing_opt_in from leads');
    expect(rows[0].marketing_opt_in).toBe(false);
  });

  it('rate-limits a hashed IP after 5 leads in 10 minutes', async () => {
    for (let i = 0; i < 5; i++) expect(await createLead({ ...base, email: `p${i}@x.co` })).toBe('created');
    expect(await createLead({ ...base, email: 'p6@x.co' })).toBe('rate_limited');
  });

  it('rejects missing consent, bad email and unknown product', async () => {
    await expect(createLead({ ...base, consent: false })).rejects.toThrow('consent_required');
    await expect(createLead({ ...base, email: 'nope' })).rejects.toThrow('invalid_email');
    await expect(createLead({ ...base, product_interest: 'crm' })).rejects.toThrow('invalid_product');
    expect(await count('leads')).toBe(0);
  });

  it('gives client roles no table access and no RPC access', async () => {
    const { rows } = await db.query<{ t: boolean; f: boolean }>(`
      select has_table_privilege('anon', 'public.leads', 'select') as t,
             has_function_privilege('anon', 'public.create_lead(jsonb)', 'execute') as f`);
    expect(rows[0]).toEqual({ t: false, f: false });
    const svc = await db.query<{ f: boolean }>(`select has_function_privilege('service_role', 'public.create_lead(jsonb)', 'execute') as f`);
    expect(svc.rows[0].f).toBe(true);
  });
});
