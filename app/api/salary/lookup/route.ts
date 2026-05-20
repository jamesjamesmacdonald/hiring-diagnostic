// GET /api/salary/lookup?role=X&region=Y
// Passthrough to the salary data source. Returns 204 if no data (key
// missing or upstream failure). Client should treat 204 as "fallback notice".

import { fetchSalaryData } from '@/lib/salary';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const role = url.searchParams.get('role') ?? '';
  const region = url.searchParams.get('region') ?? '';
  const data = await fetchSalaryData(role, region);
  if (!data) {
    return new Response(null, { status: 204 });
  }
  return Response.json(data);
}
