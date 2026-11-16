import { handleLeadRequest } from '@/lib/leads/intake';

export const runtime = 'nodejs';

export function POST(req: Request) {
  return handleLeadRequest(req, {
    supabaseUrl: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ipSalt: process.env.LEAD_IP_SALT,
  });
}
