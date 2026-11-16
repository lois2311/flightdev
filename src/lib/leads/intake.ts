import { createHash } from 'node:crypto';
import { toRpcPayload, validateLead } from './schema';

export type IntakeEnv = { supabaseUrl?: string; serviceRoleKey?: string; ipSalt?: string };

const MAX_BODY_BYTES = 10_000;
/** Humans need more than this to fill the form; bots that post instantly are dropped silently. */
const MIN_FILL_MS = 1500;
const RPC_TIMEOUT_MS = 8000;

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
// Same answer for created, duplicate and silently-dropped spam: the endpoint never reveals what it stored.
const accepted = () => json(201, { ok: true });

// Logs carry no PII: event, status and error code only.
const logError = (event: string, detail: Record<string, unknown>) => console.error(JSON.stringify({ scope: 'lead-intake', event, ...detail }));

// Assumes Vercel, which overwrites x-forwarded-for. Behind another proxy (e.g. Cloudflare) revisit this: the header becomes spoofable.
function clientIp(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null;
}

function sameOrigin(req: Request) {
  const origin = req.headers.get('origin');
  if (!origin) return true; // non-browser clients; still bound by validation, honeypot and rate limit
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

export async function handleLeadRequest(req: Request, env: IntakeEnv, fetchImpl: typeof fetch = fetch): Promise<Response> {
  if (!sameOrigin(req)) return json(403, { error: 'forbidden' });

  if (Number(req.headers.get('content-length')) > MAX_BODY_BYTES) return json(413, { error: 'payload_too_large' });
  const text = await req.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return json(413, { error: 'payload_too_large' });

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return json(400, { error: 'invalid_json' });
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  const honeypot = typeof body.website === 'string' && body.website.trim() !== '';
  const tooFast = typeof body.elapsedMs !== 'number' || body.elapsedMs < MIN_FILL_MS;
  if (honeypot || tooFast) return accepted();

  const result = validateLead(body);
  if (!result.ok) return json(400, { error: 'validation', fields: result.errors });

  if (!env.supabaseUrl || !env.serviceRoleKey || !env.ipSalt) {
    logError('not_configured', {});
    return json(503, { error: 'unavailable' });
  }

  const ip = clientIp(req);
  const ipHash = ip ? createHash('sha256').update(env.ipSalt + ip).digest('hex') : null;

  let res: Response;
  try {
    res = await fetchImpl(`${env.supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/create_lead`, {
      method: 'POST',
      headers: { apikey: env.serviceRoleKey, authorization: `Bearer ${env.serviceRoleKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({ payload: toRpcPayload(result.value, ipHash) }),
      signal: AbortSignal.timeout(RPC_TIMEOUT_MS),
    });
  } catch (err) {
    logError('rpc_unreachable', { name: err instanceof Error ? err.name : 'unknown' });
    return json(502, { error: 'unavailable' });
  }

  if (!res.ok) {
    const code = await res.json().then((b: { code?: string }) => b?.code, () => undefined);
    logError('rpc_failed', { status: res.status, code });
    return json(code === '22023' ? 400 : 502, { error: code === '22023' ? 'validation' : 'unavailable' });
  }

  const status = await res.json().then((b: { status?: string }) => b?.status, () => undefined);
  if (status === 'rate_limited') return json(429, { error: 'rate_limited' });
  if (status !== 'created' && status !== 'duplicate') {
    logError('rpc_unexpected', { status });
    return json(502, { error: 'unavailable' });
  }
  return accepted();
}
