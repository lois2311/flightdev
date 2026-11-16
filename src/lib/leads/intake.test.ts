import { describe, expect, it, vi } from 'vitest';
import { handleLeadRequest } from './intake';
import { validateLead } from './schema';

const ENV = { supabaseUrl: 'https://db.example.co', serviceRoleKey: 'service-key', ipSalt: 'salt' };
const VALID = {
  firstName: 'Ana', company: 'Tienda Ana', email: 'ana@tienda.co', product: 'vendra', businessType: 'Ferretería',
  pointsOfSale: '2-3', consent: true, elapsedMs: 9000, website: '', attribution: { source: 'google', landingPage: '/productos/vendra' },
};

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://flightdev.dev/api/leads', {
    method: 'POST',
    headers: { host: 'flightdev.dev', origin: 'https://flightdev.dev', 'x-forwarded-for': '190.0.0.1, 10.0.0.1', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
const rpc = (status: number, body: object) => vi.fn(async () => new Response(JSON.stringify(body), { status }));

describe('handleLeadRequest', () => {
  it('stores a valid lead through the RPC with a hashed IP and returns 201 without echoing data', async () => {
    const fetchImpl = rpc(200, { status: 'created' });
    const res = await handleLeadRequest(post(VALID), ENV, fetchImpl);
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://db.example.co/rest/v1/rpc/create_lead');
    const { payload } = JSON.parse(init.body as string);
    expect(payload).toMatchObject({ email: 'ana@tienda.co', product_interest: 'vendra', details: { points_of_sale: '2-3' }, source: 'google', consent: true });
    expect(payload.ip_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(payload)).not.toContain('190.0.0.1');
  });

  it('answers a duplicate exactly like a new lead', async () => {
    const res = await handleLeadRequest(post(VALID), ENV, rpc(200, { status: 'duplicate' }));
    expect(res.status).toBe(201);
  });

  it('returns 429 when the database rate-limits the IP', async () => {
    const res = await handleLeadRequest(post(VALID), ENV, rpc(200, { status: 'rate_limited' }));
    expect(res.status).toBe(429);
  });

  it('silently accepts but never stores honeypot or instant submissions', async () => {
    const fetchImpl = rpc(200, { status: 'created' });
    expect((await handleLeadRequest(post({ ...VALID, website: 'http://spam' }), ENV, fetchImpl)).status).toBe(201);
    expect((await handleLeadRequest(post({ ...VALID, elapsedMs: 300 }), ENV, fetchImpl)).status).toBe(201);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('rejects cross-origin posts', async () => {
    const res = await handleLeadRequest(post(VALID, { origin: 'https://evil.example' }), ENV, rpc(200, {}));
    expect(res.status).toBe(403);
  });

  it('returns field errors for invalid input', async () => {
    const res = await handleLeadRequest(post({ ...VALID, email: 'x', consent: false }), ENV, rpc(200, {}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(Object.keys(body.fields).sort()).toEqual(['consent', 'email']);
  });

  it('rejects malformed and oversized bodies', async () => {
    expect((await handleLeadRequest(post('{nope'), ENV, rpc(200, {}))).status).toBe(400);
    expect((await handleLeadRequest(post('[]'), ENV, rpc(200, {}))).status).toBe(400);
    expect((await handleLeadRequest(post({ ...VALID, message: 'x'.repeat(20_000) }), ENV, rpc(200, {}))).status).toBe(413);
    // 4,000 two-byte characters: under the limit in characters, over it in bytes.
    expect((await handleLeadRequest(post({ ...VALID, company: 'ñ'.repeat(4_000), message: 'ñ'.repeat(1_400) }), ENV, rpc(200, {}))).status).toBe(413);
  });

  it('strips control characters that Postgres jsonb would reject', () => {
    const r = validateLead({ ...VALID, company: 'Tienda\u0000 Ana', message: 'línea 1\nlínea 2\u0007' });
    expect(r.ok && [r.value.company, r.value.message]).toEqual(['Tienda Ana', 'línea 1\nlínea 2']);
  });

  it('strips unpaired surrogates but keeps emoji', () => {
    const r = validateLead({ ...VALID, company: 'a\ud800b', message: 'Hola 👋 equipo\udfff' });
    expect(r.ok && [r.value.company, r.value.message]).toEqual(['ab', 'Hola 👋 equipo']);
  });

  it('returns 503 when storage is not configured', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await handleLeadRequest(post(VALID), {}, rpc(200, {}))).status).toBe(503);
    err.mockRestore();
  });

  it('returns 502 and logs no PII when the database fails', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await handleLeadRequest(post(VALID), ENV, rpc(500, { code: 'XX000', message: 'boom' }));
    expect(res.status).toBe(502);
    expect(err.mock.calls.flat().join(' ')).not.toContain('ana@tienda.co');
    err.mockRestore();
  });
});

describe('validateLead', () => {
  it('requires a message only for open-ended products', () => {
    const r = validateLead({ ...VALID, product: 'software', businessType: '' });
    expect(r.ok ? {} : r.errors).toHaveProperty('message');
    expect(validateLead(VALID).ok).toBe(true);
  });

  it('rejects options that do not belong to the selected product', () => {
    const r = validateLead({ ...VALID, product: 'fleettrack', businessType: 'Ferretería' });
    expect(r.ok ? {} : r.errors).toHaveProperty('businessType');
  });

  it('normalizes email case and drops unknown attribution keys', () => {
    const r = validateLead({ ...VALID, email: ' Ana@Tienda.CO ', attribution: { source: 'x', evil: 'y' } });
    expect(r.ok && r.value.email).toBe('ana@tienda.co');
    expect(r.ok && r.value.attribution).toEqual({ source: 'x' });
  });
});
