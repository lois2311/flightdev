-- FlightDev Growth core: public lead intake + the CRM data model it feeds.
-- Target: Supabase Postgres (>= 15). Idempotent where Postgres allows it.
-- Security model: every table has RLS enabled and NO policies, and anon/authenticated
-- have no grants. The only public write path is public.create_lead(), callable by
-- service_role only (the Next.js route handler holds that key server-side).

create table if not exists public.companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 120),
  sector      text check (char_length(sector) <= 60),
  size_range  text check (char_length(size_range) <= 20),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
-- Not unique: names typed in a public form are not identity. Merging duplicates is a CRM task.
create index if not exists companies_name_idx on public.companies (lower(name));

create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid references public.companies (id) on delete set null,
  first_name  text not null check (char_length(first_name) between 1 and 80),
  last_name   text check (char_length(last_name) <= 80),
  email       text not null check (char_length(email) <= 160),
  phone       text check (char_length(phone) <= 30),
  position    text check (char_length(position) <= 80),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create unique index if not exists contacts_email_key on public.contacts (lower(email));
create index if not exists contacts_company_idx on public.contacts (company_id);

-- Pipelines are per product line; stages are data, not frontend constants.
create table if not exists public.pipelines (
  id    uuid primary key default gen_random_uuid(),
  key   text not null unique check (key in ('vendra', 'fleettrack', 'services')),
  name  text not null
);

create table if not exists public.pipeline_stages (
  id           uuid primary key default gen_random_uuid(),
  pipeline_id  uuid not null references public.pipelines (id) on delete restrict,
  key          text not null check (key ~ '^[a-z_]{2,40}$'),
  name         text not null,
  position     smallint not null,
  is_won       boolean not null default false,
  is_lost      boolean not null default false,
  unique (pipeline_id, key),
  unique (pipeline_id, position),
  check (not (is_won and is_lost))
);

create table if not exists public.leads (
  id                 uuid primary key default gen_random_uuid(),
  contact_id         uuid not null references public.contacts (id) on delete restrict,
  company_id         uuid references public.companies (id) on delete set null,
  stage_id           uuid not null references public.pipeline_stages (id) on delete restrict,
  product_interest   text not null check (product_interest in ('vendra', 'fleettrack', 'software', 'automation', 'other')),
  business_type      text check (char_length(business_type) <= 60),
  details            jsonb not null default '{}'::jsonb,
  message            text check (char_length(message) <= 1500),
  priority           text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  assigned_to        uuid,
  source             text check (char_length(source) <= 300),
  medium             text check (char_length(medium) <= 300),
  campaign           text check (char_length(campaign) <= 300),
  content            text check (char_length(content) <= 300),
  term               text check (char_length(term) <= 300),
  landing_page       text check (char_length(landing_page) <= 300),
  referrer           text check (char_length(referrer) <= 300),
  consent_status     text not null check (consent_status in ('granted', 'revoked')),
  consent_timestamp  timestamptz not null,
  consent_version    text not null check (char_length(consent_version) <= 20),
  marketing_opt_in   boolean not null default false,
  ip_hash            text check (char_length(ip_hash) = 64),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists leads_contact_idx on public.leads (contact_id);
create index if not exists leads_company_idx on public.leads (company_id);
create index if not exists leads_stage_idx on public.leads (stage_id);
create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_ip_recent_idx on public.leads (ip_hash, created_at) where ip_hash is not null;

create table if not exists public.activities (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads (id) on delete cascade,
  type        text not null check (type in ('form_submission', 'form_resubmission', 'call', 'email', 'meeting', 'demo', 'follow_up', 'note', 'task')),
  subject     text not null check (char_length(subject) <= 160),
  body        text check (char_length(body) <= 4000),
  due_at      timestamptz,
  done_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists activities_lead_idx on public.activities (lead_id, created_at desc);
create index if not exists activities_open_tasks_idx on public.activities (due_at) where type = 'task' and done_at is null;

-- Ley 1581: people who asked not to receive commercial communications. Checked on every intake.
create table if not exists public.suppression_list (
  email       text primary key check (email = lower(email) and char_length(email) <= 160),
  reason      text not null check (reason in ('opt_out', 'data_deletion', 'bounce', 'manual')),
  created_at  timestamptz not null default now()
);

create table if not exists public.campaigns (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) <= 120),
  product       text not null check (product in ('vendra', 'fleettrack', 'software', 'automation', 'other')),
  channel       text not null check (char_length(channel) <= 60),
  utm_source    text check (char_length(utm_source) <= 300),
  utm_campaign  text not null unique check (char_length(utm_campaign) <= 300),
  budget_cop    numeric(14, 2) check (budget_cop >= 0),
  starts_on     date,
  ends_on       date,
  created_at    timestamptz not null default now(),
  check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

-- Seed pipelines and stages (stable keys; names editable later from the CRM).
insert into public.pipelines (key, name) values
  ('vendra', 'Vendra POS'), ('fleettrack', 'FleetTrack Pro'), ('services', 'Servicios FlightDev')
on conflict (key) do nothing;

insert into public.pipeline_stages (pipeline_id, key, name, position, is_won, is_lost)
select p.id, s.key, s.name, s.position, s.key = 'won', s.key = 'lost'
from public.pipelines p
join (values
  ('vendra', 'new', 'Nuevo lead', 1), ('vendra', 'pending_contact', 'Pendiente de contacto', 2),
  ('vendra', 'contacted', 'Contactado', 3), ('vendra', 'qualified', 'Calificado', 4),
  ('vendra', 'demo', 'Demostración', 5), ('vendra', 'proposal', 'Propuesta', 6),
  ('vendra', 'negotiation', 'Negociación', 7), ('vendra', 'won', 'Ganado', 8), ('vendra', 'lost', 'Perdido', 9),
  ('fleettrack', 'new', 'Nuevo lead', 1), ('fleettrack', 'pending_contact', 'Pendiente de contacto', 2),
  ('fleettrack', 'contacted', 'Contactado', 3), ('fleettrack', 'ops_qualification', 'Calificación operativa', 4),
  ('fleettrack', 'demo', 'Demostración', 5), ('fleettrack', 'diagnosis', 'Diagnóstico', 6),
  ('fleettrack', 'proposal', 'Propuesta', 7), ('fleettrack', 'negotiation', 'Negociación', 8),
  ('fleettrack', 'won', 'Ganado', 9), ('fleettrack', 'lost', 'Perdido', 10),
  ('services', 'new', 'Nuevo lead', 1), ('services', 'pending_contact', 'Pendiente de contacto', 2),
  ('services', 'contacted', 'Contactado', 3), ('services', 'qualified', 'Calificado', 4),
  ('services', 'diagnosis', 'Diagnóstico', 5), ('services', 'proposal', 'Propuesta', 6),
  ('services', 'negotiation', 'Negociación', 7), ('services', 'won', 'Ganado', 8), ('services', 'lost', 'Perdido', 9)
) as s (pipeline, key, name, position) on s.pipeline = p.key
on conflict (pipeline_id, key) do nothing;

-- Single transactional intake. Returns {status: created|duplicate|rate_limited}; never returns stored data.
create or replace function public.create_lead(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_email      text := lower(btrim(payload ->> 'email'));
  v_product    text := payload ->> 'product_interest';
  v_company    text := nullif(btrim(payload ->> 'company'), '');
  v_ip_hash    text := payload ->> 'ip_hash';
  v_pipeline   text;
  v_contact_id uuid;
  v_company_id uuid;
  v_stage_id   uuid;
  v_lead_id    uuid;
  v_recent     int;
  v_new        boolean;
  -- The email is unverified, so submitted fields never touch a stored contact; a person reviews them in the activity.
  v_submitted  text := left(jsonb_strip_nulls(jsonb_build_object(
    'first_name', payload ->> 'first_name', 'last_name', payload ->> 'last_name', 'phone', payload ->> 'phone',
    'position', payload ->> 'position', 'company', payload ->> 'company', 'business_type', payload ->> 'business_type',
    'details', payload -> 'details', 'marketing_opt_in', payload -> 'marketing_opt_in', 'message', payload ->> 'message'
  ))::text, 4000);
begin
  if v_email is null or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  if v_product is null or v_product not in ('vendra', 'fleettrack', 'software', 'automation', 'other') then
    raise exception 'invalid_product' using errcode = '22023';
  end if;
  if coalesce((payload ->> 'consent')::boolean, false) is not true then
    raise exception 'consent_required' using errcode = '22023';
  end if;

  -- ponytail: counts stored leads per hashed IP; spam that never reaches here (honeypot) is not counted.
  if v_ip_hash is not null then
    select count(*) into v_recent from leads
    where ip_hash = v_ip_hash and created_at > now() - interval '10 minutes';
    if v_recent >= 5 then
      return jsonb_build_object('status', 'rate_limited');
    end if;
  end if;

  -- Existing contact: the no-op update only locks the row and returns it; nothing is changed (xmax = 0 means inserted).
  insert into contacts (first_name, last_name, email, phone, position)
  values (btrim(payload ->> 'first_name'), nullif(btrim(payload ->> 'last_name'), ''), v_email,
          nullif(btrim(payload ->> 'phone'), ''), nullif(btrim(payload ->> 'position'), ''))
  on conflict ((lower(email))) do update set updated_at = contacts.updated_at
  returning id, company_id, (xmax = 0) into v_contact_id, v_company_id, v_new;

  if v_new and v_company is not null then
    insert into companies (name) values (v_company) returning id into v_company_id;
    update contacts set company_id = v_company_id where id = v_contact_id;
  end if;

  v_pipeline := case when v_product in ('vendra', 'fleettrack') then v_product else 'services' end;

  -- Duplicate = an open lead (not won/lost) for the same contact and product.
  select l.id into v_lead_id
  from leads l join pipeline_stages s on s.id = l.stage_id
  where l.contact_id = v_contact_id and l.product_interest = v_product and not s.is_won and not s.is_lost
  order by l.created_at desc
  limit 1;

  if v_lead_id is not null then
    -- Resubmissions add no lead, so the IP limit above never sees them: cap them per lead instead.
    select count(*) into v_recent from activities
    where lead_id = v_lead_id and type = 'form_resubmission' and created_at > now() - interval '10 minutes';
    if v_recent < 3 then
      insert into activities (lead_id, type, subject, body)
      values (v_lead_id, 'form_resubmission', 'Nuevo envío del formulario', v_submitted);
      update leads set updated_at = now() where id = v_lead_id;
    end if;
    return jsonb_build_object('status', 'duplicate');
  end if;

  select s.id into v_stage_id
  from pipeline_stages s join pipelines p on p.id = s.pipeline_id
  where p.key = v_pipeline
  order by s.position
  limit 1;

  insert into leads (contact_id, company_id, stage_id, product_interest, business_type, details, message,
                     source, medium, campaign, content, term, landing_page, referrer,
                     consent_status, consent_timestamp, consent_version, marketing_opt_in, ip_hash)
  values (v_contact_id, v_company_id, v_stage_id, v_product, nullif(payload ->> 'business_type', ''),
          coalesce(payload -> 'details', '{}'::jsonb), nullif(payload ->> 'message', ''),
          payload ->> 'source', payload ->> 'medium', payload ->> 'campaign', payload ->> 'content',
          payload ->> 'term', payload ->> 'landing_page', payload ->> 'referrer',
          'granted', now(), coalesce(payload ->> 'consent_version', 'unknown'),
          coalesce((payload ->> 'marketing_opt_in')::boolean, false)
            and not exists (select 1 from suppression_list where email = v_email),
          v_ip_hash)
  returning id into v_lead_id;

  insert into activities (lead_id, type, subject, body, due_at)
  values (v_lead_id, 'task', 'Primer contacto con el lead', v_submitted, now() + interval '1 day');

  return jsonb_build_object('status', 'created');
end;
$$;

-- Lock everything down: no direct table access for client roles, RPC only for service_role.
alter table public.companies        enable row level security;
alter table public.contacts         enable row level security;
alter table public.pipelines        enable row level security;
alter table public.pipeline_stages  enable row level security;
alter table public.leads            enable row level security;
alter table public.activities       enable row level security;
alter table public.suppression_list enable row level security;
alter table public.campaigns        enable row level security;

revoke all on public.companies, public.contacts, public.pipelines, public.pipeline_stages,
  public.leads, public.activities, public.suppression_list, public.campaigns from anon, authenticated;
revoke all on function public.create_lead(jsonb) from public, anon, authenticated;
grant execute on function public.create_lead(jsonb) to service_role;
